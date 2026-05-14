# Healthcare Standards Agent — Internal Product Spec
**Version:** 1.0 · **Date:** May 2026
**Product:** Rohan Pant · **Sales:** Siddhant Rawat

---

## What It Is

A conversational AI agent that lets healthcare staff search compliance documents in plain English and get precise, cited answers in seconds — no manual PDF searching required.

Built on: **Anthropic Claude** (reasoning) + **MongoDB Atlas Vector Search** (retrieval) + **Voyage AI** (embeddings).

---

## What It Does

### Three Query Modes

| Mode | Example Input | What Happens |
|------|--------------|--------------|
| **Q&A** | "What are the infection control requirements for surgical areas?" | Semantic search across all standards → synthesized answer with citations |
| **Citation** | "Show me chapter QM.1" or "Give me the exact text of MM.2" | Exact chapter lookup → verbatim text returned, no paraphrasing |
| **Browse** | "What sections are available?" or "List all QM chapters" | Aggregates and returns full section/chapter index |

### Hybrid Mode
If a user asks both a conceptual question AND requests exact text in one message, the agent calls both tools in parallel and combines the results.

---

## How It Works (Technical Summary)

```
User question
     │
     ▼
Claude decides which tool(s) to call
     │
     ├─→ search_standards      → Voyage AI embeds query → MongoDB $vectorSearch → top-k chunks
     ├─→ get_standard_by_chapter → MongoDB exact/prefix match → verbatim text
     └─→ list_sections          → MongoDB aggregation → chapter index
     │
     ▼
Claude synthesizes final answer with citations
     │
     ▼
Response delivered to user
```

**Data:** 1,919 NIAHO standard chunks stored in MongoDB Atlas with 1,024-dimensional embeddings.

---

## What It Can Do Today

- ✅ Answer any natural-language question about NIAHO accreditation standards
- ✅ Return verbatim chapter text on request (exact citations)
- ✅ Browse and list all available sections and chapters
- ✅ Handle hybrid queries (explanation + exact text in one response)
- ✅ Maintain conversation memory within a session
- ✅ Web chat UI accessible via browser (no CLI required)
- ✅ Works with any compliance document set (not just NIAHO)

---

## What It Cannot Do Yet

- ❌ No user authentication or role-based access control
- ❌ No PDF upload UI (documents must be added manually via seed script)
- ❌ No multi-tenant support (one document set per deployment)
- ❌ No audit logging of queries/responses
- ❌ No mobile app (web only)
- ❌ No integration with existing hospital EHR/EMR systems

*All of these are buildable — none are architectural blockers.*

---

## Performance

| Metric | Value |
|--------|-------|
| Average response time | 3–8 seconds |
| Documents indexed | 1,919 chunks (NIAHO full standards) |
| Embedding dimensions | 1,024 (Voyage AI voyage-3-large) |
| Search accuracy | Cosine similarity, HNSW approximate nearest neighbor |
| Test score | 13/13 queries passed |

---

## Cost to Run

| Component | Cost |
|-----------|------|
| MongoDB Atlas M0 (current) | Free |
| Voyage AI embeddings | Free (200M token quota) |
| Anthropic Claude (per query) | ~$0.01–$0.05 per query |
| Hosting (Vercel) | Free (hobby) / $20/month (pro) |
| **Total for a pilot (~500 queries/month)** | **~$5–$25/month** |

At production scale (M10+ cluster, 10K queries/month): ~$100–$200/month.

---

## What a Client Needs to Provide

1. Their compliance documents (PDF, Word, etc.)
2. Which staff roles need access
3. Where they want it integrated (standalone web app, Slack, intranet portal)
4. Data residency requirements (cloud vs. on-premise)
5. Expected query volume per month
6. IT point of contact for integration

---

## Pilot Timeline

| Week | Milestone |
|------|-----------|
| 1 | Signed pilot agreement, documents received |
| 2 | Documents indexed, demo environment live |
| 3 | Staff trial with feedback collection |
| 4 | Iteration + handoff |

---

## Competitive Differentiation

- **Not a keyword search** — understands meaning, not just words
- **Exact citations** — returns verbatim regulatory text, not AI-generated summaries
- **Any document set** — swap NIAHO for any compliance library (Joint Commission, CMS, internal SOPs)
- **Fast to deploy** — new client live in under 1 week
- **Transparent costs** — no black-box pricing, runs on open infrastructure

---

*This document is for internal use. Do not share with clients.*
