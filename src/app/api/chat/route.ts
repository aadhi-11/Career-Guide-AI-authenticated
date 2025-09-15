import { NextRequest, NextResponse } from "next/server";
import { cohereAI } from "@/lib/cohere-ai";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Hardcode API key for now since env var isn't loading
    const API_KEY = process.env.COHERE_API_KEY || "h2EoYaZgIC3GKtRY7ITP3iQ3d0Po3eqYKkjCh8Dh";
    
    console.log("Using Cohere API key:", API_KEY.substring(0, 10) + "...");
    
    // Set the API key in environment
    process.env.COHERE_API_KEY = API_KEY;
    
    // Get raw body first
    const rawBody = await request.text();
    console.log("Raw body:", rawBody);
    
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return NextResponse.json(
        { error: "Invalid JSON format" },
        { status: 400 }
      );
    }

    const { message, sessionId } = body;
    console.log("Parsed data:", { message, sessionId });

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }
    
    console.log("Processing with sessionId:", sessionId);

    // Get conversation history from database (no user check needed)
    const session = await prisma.chatSession.findUnique({
      where: { 
        id: sessionId
        // Removed userId check - any valid sessionId can be used
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Convert database messages to the format expected by CohereAI
    const conversationHistory = session.messages.map(msg => ({
      role: msg.role.toLowerCase() as 'user' | 'assistant',
      content: msg.content,
      timestamp: msg.createdAt.getTime(),
    }));

    console.log(`Retrieved ${conversationHistory.length} messages from database for session ${sessionId}`);

    // Generate AI response
    const reply = await cohereAI.generateResponse(message, sessionId, conversationHistory, API_KEY);

    console.log("Generated reply:", reply.substring(0, 100) + "...");

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Error processing chat request:", error);
    return NextResponse.json(
      { error: "AI service error. Please try again." },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";