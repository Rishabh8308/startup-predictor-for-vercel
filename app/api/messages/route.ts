import { NextResponse } from "next/server";
import { mockMessages } from "@/lib/mock-data";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDb();
    const messages = await db
      .collection("messages")
      .find({}, { sort: { createdAt: -1 } })
      .toArray();
    return NextResponse.json(messages);
  } catch {
    return NextResponse.json(mockMessages);
  }
}

export async function POST(request: Request) {
  const json = await request.json();
  const newMessage = { ...json, createdAt: new Date() };

  try {
    const db = await getDb();
    await db.collection("messages").insertOne(newMessage);
    return NextResponse.json({ success: true, persisted: true, message: "Sent successfully" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send message";
    console.error("Message persistence unavailable:", message);
    return NextResponse.json({
      success: true,
      persisted: false,
      warning: "Message accepted but database is currently unavailable.",
      message: "Sent successfully",
      data: newMessage,
    });
  }
}
