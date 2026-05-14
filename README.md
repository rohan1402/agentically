# Agentically

> AI-powered compliance intelligence for healthcare organizations.

Agentically lets healthcare staff search accreditation standards in plain English and get precise, cited answers in seconds — no manual PDF searching required.

**Live Demo → [agentically.vercel.app](#)** &nbsp;|&nbsp; **Landing Page → [agentically.vercel.app](#)**

---

## What makes it different

Most AI search tools have one retrieval path — embed the query, find similar chunks, return them.

Agentically has three, and picks the right one automatically:

| Query type | Example | What happens |
|------------|---------|--------------|
| **Semantic Q&A** | "What are the infection control requirements?" | Vector search → synthesized answer with citations |
| **Exact citation** | "Show me chapter QM.1" | Direct lookup → verbatim regulatory text |
| **Browse** | "List all available sections" | Aggregation → full chapter index |
| **Hybrid** | "Explain QM.1 and show me the exact text" | Both tools fire in parallel → combined response |

That's the difference between RAG and **agentic RAG**.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Agent reasoning | Anthropic Claude (`claude-sonnet-4`) |
| Vector database | MongoDB Atlas Vector Search |
| Embeddings | Voyage AI `voyage-3-large` (1024-dim, cosine) |
| Web interface | Next.js 15 + Tailwind CSS |
| Hosting | Vercel |

---

## Project Structure

```
agentically/
├── web/                        # Next.js web app
│   ├── app/
│   │   ├── page.tsx            # Landing page
│   │   ├── demo/page.tsx       # Chat demo UI
│   │   └── api/chat/route.ts   # Agent API endpoint
│   ├── components/             # ChatMessage, TypingIndicator
│   └── lib/                    # Agent core, MongoDB singleton
├── src/
│   ├── agent.ts                # CLI agent loop
│   └── tools.ts                # Tool implementations
├── atlas-trigger/
│   └── auto-embed.js           # Atlas trigger for auto-embedding on insert
├── seed-database.ts            # PDF ingestion pipeline
├── PRODUCT_SPEC.md             # Internal product spec
└── ONBOARDING.md               # Client onboarding checklist
```

---

## Running Locally

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free M0 tier works)
- Voyage AI API key (free via Atlas → AI Models)
- Anthropic API key

### Web App

```bash
cd web
cp .env.example .env.local
# fill in MONGODB_URI, VOYAGE_API_KEY, ANTHROPIC_API_KEY
npm install
npm run dev
```

Open `http://localhost:3000` — landing page.
Open `http://localhost:3000/demo` — live chat demo.

### Seed the database

Place your compliance PDF in the project root, then:

```bash
npm run seed
```

This parses the PDF, generates embeddings via Voyage AI, and inserts all chunks into MongoDB Atlas.

---

## Performance

- **1,919** NIAHO standard chunks indexed
- **1,024-dim** embeddings with cosine similarity
- **3–8 second** average response time
- **13/13** test queries passed across all retrieval modes

---

## Built by

**Rohan Pant** · [rohan.pant14@gmail.com](mailto:rohan.pant14@gmail.com)
