/**
 * Embedding API base URL.
 *
 * Atlas "model API keys" (AI Models → Create model API key) must use
 * https://ai.mongodb.com — the standalone Voyage endpoint returns 403 for those keys.
 *
 * Override with VOYAGE_EMBEDDINGS_URL if needed.
 */
export function getVoyageEmbeddingsUrl(): string {
  const override = process.env.VOYAGE_EMBEDDINGS_URL?.trim();
  if (override) return override;

  const key = process.env.VOYAGE_API_KEY ?? "";
  // Atlas-issued keys start with "al-" → must use ai.mongodb.com endpoint
  // Standard Voyage AI keys start with "pa-" → use api.voyageai.com
  if (key.startsWith("al-")) {
    return "https://ai.mongodb.com/v1/embeddings";
  }
  return "https://api.voyageai.com/v1/embeddings";
}
