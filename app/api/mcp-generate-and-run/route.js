import { NextResponse } from "next/server";
import { createTestNexusGraph } from "../../../lib/langgraph/graph.js";

export async function POST(request) {
  try {
    const { credentials, testCases, suiteName } = await request.json();

    // 1. Compile LangGraph State Machine
    const app = createTestNexusGraph();

    // 2. Invoke StateGraph with initial state
    const finalState = await app.invoke({
      credentials: {
        url: credentials?.url || "https://qa01.therapbd.net/",
        providerCode: credentials?.providerCode || "SQA-TH",
        loginName: credentials?.loginName || "ifty-u1",
        password: credentials?.password || "therap321#",
      },
      testCases: testCases || [],
      suiteName: suiteName || "Automated Functional Suite",
      retryCount: 0,
    });

    // 3. Return LangGraph-driven artifacts & execution metrics
    return NextResponse.json({
      engine: "LangGraph Multi-Agent State Machine",
      logs: finalState.logs,
      generatedPom: finalState.generatedPom,
      generatedSpec: finalState.generatedSpec,
      executionResult: finalState.executionResult,
    });
  } catch (error) {
    console.error("LangGraph Execution Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
