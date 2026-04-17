import { NextResponse } from "next/server";
import { mockPosts } from "@/lib/mock-data";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDb();
    const posts = await db
      .collection("posts")
      .find({}, { sort: { createdAt: -1 } })
      .toArray();
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json(mockPosts);
  }
}

export async function POST(request: Request) {
  const json = await request.json();
  const newPost = {
    ...json,
    id: `post-${Date.now()}`,
    timestamp: "Just now",
    createdAt: new Date(),
  };

  try {
    const db = await getDb();
    await db.collection("posts").insertOne(newPost);
    return NextResponse.json({ success: true, persisted: true, post: newPost });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create post";
    console.error("Community post persistence unavailable:", message);
    return NextResponse.json({
      success: true,
      persisted: false,
      warning: "Post accepted but database is currently unavailable.",
      post: newPost,
    });
  }
}
