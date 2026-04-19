/**
 * atlas-trigger/auto-embed.js
 *
 * MongoDB Atlas Database Trigger — Auto-Embedding on Insert
 *
 * What it does:
 *   Fires whenever a document is inserted into niaho_standards.standards
 *   that is missing the `embedding` field. Calls Voyage AI to generate
 *   a 1024-dim embedding and writes it back to the document.
 *
 * How to deploy:
 *   1. Atlas UI → App Services → Triggers → Add Trigger
 *   2. Trigger type: Database
 *   3. Cluster: healthcare-agent  |  DB: niaho_standards  |  Collection: standards
 *   4. Operation type: Insert Document (+ optionally Update Document)
 *   5. Enable "Full Document" in event type options
 *   6. Paste this function into the Function editor
 *   7. Add a secret "VOYAGE_API_KEY" in App Services → Values & Secrets
 *      and link it as a Value named VOYAGE_API_KEY
 *
 * Environment:
 *   - context.values.get("VOYAGE_API_KEY") — your Atlas-issued al- key
 *   - context.services.get("mongodb-atlas") — built-in Atlas data source
 */

exports = async function (changeEvent) {
  const VOYAGE_API_KEY = context.values.get("VOYAGE_API_KEY");
  const VOYAGE_URL = "https://ai.mongodb.com/v1/embeddings"; // Atlas-issued al- keys use this endpoint
  const VOYAGE_MODEL = "voyage-3-large";

  // Only process Insert events (or Updates missing the embedding field)
  const fullDocument = changeEvent.fullDocument;
  if (!fullDocument) {
    console.log("No full document in event — skipping.");
    return;
  }

  // Skip if embedding already present (avoid re-embedding on unrelated updates)
  if (fullDocument.embedding && fullDocument.embedding.length > 0) {
    console.log(`Document ${fullDocument._id} already has embedding — skipping.`);
    return;
  }

  const text = fullDocument.text;
  if (!text) {
    console.log(`Document ${fullDocument._id} has no text field — skipping.`);
    return;
  }

  console.log(`Generating embedding for document: ${fullDocument._id}`);

  // Call Voyage AI to embed the document text
  const response = await context.http.post({
    url: VOYAGE_URL,
    headers: {
      Authorization: [`Bearer ${VOYAGE_API_KEY}`],
      "Content-Type": ["application/json"],
    },
    body: JSON.stringify({
      input: [text],
      model: VOYAGE_MODEL,
      input_type: "document",
    }),
    encodeBodyAsJSON: false,
  });

  if (response.statusCode !== 200) {
    const errorBody = EJSON.parse(response.body.text());
    console.error(`Voyage AI error ${response.statusCode}:`, JSON.stringify(errorBody));
    return;
  }

  const result = EJSON.parse(response.body.text());
  const embedding = result.data[0].embedding;

  console.log(`Got embedding with ${embedding.length} dimensions. Writing back...`);

  // Write the embedding back to the document
  const collection = context.services
    .get("mongodb-atlas")
    .db("niaho_standards")
    .collection("standards");

  await collection.updateOne(
    { _id: fullDocument._id },
    { $set: { embedding: embedding } }
  );

  console.log(`Embedding saved for document ${fullDocument._id} (${embedding.length}-dim).`);
};
