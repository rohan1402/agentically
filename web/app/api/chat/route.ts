import { NextRequest, NextResponse } from "next/server";
import { runAgentTurn, ChatMessage } from "@/lib/agent";

// 60s timeout — required for multi-step agent tool calls.
// Works without limits in local dev. On Vercel, requires Pro plan.
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { message: string; history?: ChatMessage[] };
    const { message, history = [] } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const result = await runAgentTurn(message.trim(), history);
    return NextResponse.json(result);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Chat API error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
