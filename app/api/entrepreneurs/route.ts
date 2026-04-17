import { NextResponse } from "next/server";
import { mockEntrepreneurs } from "@/lib/mock-data";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDb();
    const entrepreneurs = await db.collection("entrepreneurs").find({}).toArray();
    return NextResponse.json(entrepreneurs);
  } catch {
    return NextResponse.json(mockEntrepreneurs);
  }
}
