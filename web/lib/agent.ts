/**
 * web/lib/agent.ts
 *
 * Core agent logic for the web interface.
 * Self-contained: includes Voyage AI routing, MongoDB tool implementations,
 * Anthropic tool definitions, system prompt, and the runAgentTurn loop.
 */

import Anthropic from "@anthropic-ai/sdk";
import clientPromise from "./mongodb";

// ─── Config ──────────────────────────────────────────────────────────────────

const VOYAGE_API_KEY = process.env.VOYAGE_API_KEY!;
const DB_NAME = "niaho_standards";
const COLLECTION_NAME = "standards";
const VECTOR_INDEX_NAME = "vector_index";
const VOYAGE_MODEL = "voyage-3-large";
const MODEL = "claude-sonnet-4-20250514";
const MAX_TOKENS = 4096;
const TOP_K = 5;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// ─── Voyage AI ────────────────────────────────────────────────────────────────

function getVoyageUrl(): string {
  const override = process.env.VOYAGE_EMBEDDINGS_URL?.trim();
  if (override) return override;
  // Atlas-issued keys (al-) use the MongoDB endpoint; standard keys (pa-) use Voyage
  return (process.env.VOYAGE_API_KEY ?? "").startsWith("al-")
    ? "https://ai.mongodb.com/v1/embeddings"
    : "https://api.voyageai.com/v1/embeddings";
}

async function generateQueryEmbedding(query: string): Promise<number[]> {
  const response = await fetch(getVoyageUrl(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${VOYAGE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ input: [query], model: VOYAGE_MODEL, input_type: "query" }),
  });

  if (!response.ok) {
    throw new Error(`Voyage AI error ${response.status}: ${await response.text()}`);
  }

  const result = (await response.json()) as { data: Array<{ embedding: number[] }> };
  return result.data[0].embedding;
}

// ─── Tool: search_standards ───────────────────────────────────────────────────

async function searchStandards(query: string, topK: number = TOP_K) {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection(COLLECTION_NAME);

  const queryEmbedding = await generateQueryEmbedding(query);

  const results = await collection
    .aggregate([
      {
        $vectorSearch: {
          index: VECTOR_INDEX_NAME,
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: topK * 10,
          limit: topK,
        },
      },
      {
        $project: {
          _id: 0,
          chunk_id: 1,
          text: 1,
          metadata: 1,
          token_count: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
    ])
    .toArray();

  if (results.length === 0) {
    return { success: true, data: { message: "No relevant standards found.", results: [] } };
  }

  return {
    success: true,
    data: {
      query,
      total_results: results.length,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      results: results.map((r: any) => ({
        chapter: r.metadata.chapter,
        section: r.metadata.section,
        relevance_score: r.score?.toFixed(4),
        text: r.text,
        chunk_id: r.chunk_id,
      })),
    },
  };
}

// ─── Tool: get_standard_by_chapter ───────────────────────────────────────────

async function getStandardByChapter(chapterId: string) {
  const normalized = chapterId.trim();
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection(COLLECTION_NAME);
  const projection = { projection: { _id: 0, chunk_id: 1, text: 1, metadata: 1, token_count: 1 } };

  // 1. Exact match
  const exactResults = await collection.find({ "metadata.chapter": normalized }, projection).toArray();
  if (exactResults.length > 0) {
    return { success: true, data: { lookup_type: "exact", chapter_id: normalized, results: exactResults } };
  }

  // 2. Prefix match (e.g. "QM" → QM.1, QM.2, ...)
  const prefixRegex = new RegExp(`^${normalized.replace(".", "\\.")}`, "i");
  const prefixResults = await collection
    .find({ "metadata.chapter": { $regex: prefixRegex } }, projection)
    .sort({ "metadata.chapter": 1 })
    .toArray();
  if (prefixResults.length > 0) {
    return {
      success: true,
      data: {
        lookup_type: "prefix",
        chapter_id: normalized,
        message: `Showing all chapters starting with "${normalized}":`,
        results: prefixResults,
      },
    };
  }

  // 3. Semantic fallback
  const fallback = await searchStandards(`${normalized} healthcare standards`, 3);
  return {
    success: true,
    data: {
      lookup_type: "semantic_fallback",
      chapter_id: normalized,
      message: `Chapter "${normalized}" was not found. Here are semantically related standards:`,
      ...(fallback.data as object),
    },
  };
}

// ─── Tool: list_sections ──────────────────────────────────────────────────────

async function listSections(sectionFilter?: string) {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection(COLLECTION_NAME);

  const matchStage = sectionFilter
    ? {
        $match: {
          $or: [
            { "metadata.section": { $regex: sectionFilter, $options: "i" } },
            { "metadata.chapter": { $regex: `^${sectionFilter}`, $options: "i" } },
          ],
        },
      }
    : { $match: {} };

  const pipeline = [
    matchStage,
    { $group: { _id: { section: "$metadata.section", chapter: "$metadata.chapter" }, chunk_count: { $sum: 1 } } },
    { $sort: { "_id.section": 1 as const, "_id.chapter": 1 as const } },
    { $group: { _id: "$_id.section", chapters: { $push: { chapter_id: "$_id.chapter", chunk_count: "$chunk_count" } } } },
    { $sort: { _id: 1 as const } },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sectionGroups = await collection.aggregate(pipeline).toArray() as any[];
  const totalChapters = sectionGroups.reduce((sum, s) => sum + s.chapters.length, 0);

  return {
    success: true,
    data: {
      filter: sectionFilter ?? "none",
      total_sections: sectionGroups.length,
      total_chapters: totalChapters,
      sections: sectionGroups.map((s) => ({ section_name: s._id, chapters: s.chapters })),
    },
  };
}

// ─── Tool Executor ────────────────────────────────────────────────────────────

async function executeTool(name: string, input: Record<string, unknown>): Promise<string> {
  let result;
  switch (name) {
    case "search_standards":
      result = await searchStandards(input.query as string, (input.top_k as number) ?? TOP_K);
      break;
    case "get_standard_by_chapter":
      result = await getStandardByChapter(input.chapter_id as string);
      break;
    case "list_sections":
      result = await listSections(input.section_filter as string | undefined);
      break;
    default:
      return JSON.stringify({ error: `Unknown tool: ${name}` });
  }
  return JSON.stringify(result, null, 2);
}

// ─── Tool Definitions (Claude JSON Schema) ────────────────────────────────────

const tools: Anthropic.Tool[] = [
  {
    name: "search_standards",
    description: `Perform a semantic vector search across NIAHO healthcare accreditation standards.
Use this tool for general questions about requirements, topic-based searches (e.g., "fire safety",
"medication errors", "patient rights"), or when the user asks about a concept without citing a
specific chapter ID. Returns the top-k most semantically relevant chunks with citations and scores.`,
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "The natural language search query." },
        top_k: { type: "number", description: "Number of results to return (default: 5, max: 10)", default: TOP_K },
      },
      required: ["query"],
    },
  },
  {
    name: "get_standard_by_chapter",
    description: `Retrieve the exact verbatim text of a specific NIAHO chapter by its ID.
Use when the user asks for a specific chapter by ID (e.g., "Show me QM.1"), asks for exact/verbatim
text, or uses phrases like "cite", "show me exactly", "give me the text of".`,
    input_schema: {
      type: "object",
      properties: {
        chapter_id: { type: "string", description: 'Chapter identifier (e.g., "QM.1", "IC.3"). Case-insensitive.' },
      },
      required: ["chapter_id"],
    },
  },
  {
    name: "list_sections",
    description: `List all available sections and chapters in the NIAHO knowledge base.
Use when the user wants to browse available topics, asks "what chapters are there?", or wants
to see all chapters in a section (e.g., "list all QM chapters").`,
    input_schema: {
      type: "object",
      properties: {
        section_filter: { type: "string", description: 'Optional filter by section or chapter prefix (e.g., "QM", "IC").' },
      },
      required: [],
    },
  },
];

// ─── System Prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a Healthcare Standards Expert Agent specializing in NIAHO (National Integrated Accreditation for Healthcare Organizations) accreditation standards.

Your knowledge base is stored in MongoDB Atlas and you have access to three tools to query it.

## Tool Selection Rules

1. **search_standards** — Use for any general or conversational question about healthcare requirements.
2. **get_standard_by_chapter** — Use when the user explicitly requests a specific chapter by ID OR asks for exact/verbatim text.
3. **list_sections** — Use when the user wants to browse, discover, or get an overview of available content.

## Hybrid Queries
If a user asks both a conceptual question AND requests exact text, call BOTH tools — first search_standards, then get_standard_by_chapter.

## Response Format

**For Q&A:** Provide a clear, synthesized answer. Always cite sources: **[Chapter X.Y — Section Name]**.

**For Citation lookups:** Return the VERBATIM text exactly as stored. Label clearly: "**Chapter [ID] — [Section Name]**".

**For "not found":** State the chapter was not found, offer semantically related alternatives.

## General Guidelines
- Always cite chapter IDs (e.g., **QM.1**, **IC.3**)
- Be precise and professional — this is healthcare compliance information
- If uncertain, defer to the exact text from the knowledge base`;

// ─── Agent Turn ───────────────────────────────────────────────────────────────

export async function runAgentTurn(
  message: string,
  conversationHistory: ChatMessage[]
): Promise<{ text: string; history: ChatMessage[] }> {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

  // Build the full message list: prior conversation + current user message
  const internalHistory: Anthropic.MessageParam[] = [
    ...conversationHistory.map((m) => ({ role: m.role, content: m.content })),
    { role: "user" as const, content: message },
  ];

  // Agent loop — iterates until end_turn
  while (true) {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      tools,
      messages: internalHistory,
    });

    internalHistory.push({ role: "assistant", content: response.content });

    if (response.stop_reason === "tool_use") {
      const toolUseBlocks = response.content.filter(
        (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
      );

      const toolResults: Anthropic.ToolResultBlockParam[] = await Promise.all(
        toolUseBlocks.map(async (t) => ({
          type: "tool_result" as const,
          tool_use_id: t.id,
          content: await executeTool(t.name, t.input as Record<string, unknown>),
        }))
      );

      internalHistory.push({ role: "user", content: toolResults });
      continue;
    }

    if (response.stop_reason === "end_turn") {
      const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === "text");
      const responseText = textBlock?.text ?? "(No response generated)";

      return {
        text: responseText,
        history: [
          ...conversationHistory,
          { role: "user" as const, content: message },
          { role: "assistant" as const, content: responseText },
        ],
      };
    }

    return {
      text: `(Unexpected stop reason: ${response.stop_reason})`,
      history: conversationHistory,
    };
  }
}
