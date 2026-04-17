import { NextResponse } from "next/server";
import { mockInvestors } from "@/lib/mock-data";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDb();
    const investors = await db.collection("investors").find({}).toArray();
    return NextResponse.json(investors);
  } catch {
    return NextResponse.json(mockInvestors);
  }
}
