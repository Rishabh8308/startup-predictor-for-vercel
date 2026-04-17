import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Mock match logic
  return NextResponse.json({ success: true, matches: [] });
}
