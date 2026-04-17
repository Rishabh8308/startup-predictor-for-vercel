import { NextResponse } from "next/server";

function getMlApiUrl() {
  if (process.env.ML_API_URL) return process.env.ML_API_URL;
  if (process.env.NODE_ENV !== "production") return "http://127.0.0.1:8000";
  throw new Error("Missing ML_API_URL in production environment");
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = Number(searchParams.get("limit") ?? 20);
    const limit = Number.isFinite(limitParam)
      ? Math.min(Math.max(Math.trunc(limitParam), 1), 100)
      : 20;

    const apiUrl = getMlApiUrl();
    const response = await fetch(`${apiUrl}/predictions?limit=${limit}`, {
      method: "GET",
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) {
      return NextResponse.json([]);
    }
    const history = await response.json();

    return NextResponse.json(history);
  } catch (error) {
    console.error("Prediction history unavailable:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const apiUrl = getMlApiUrl();
    const response = await fetch(`${apiUrl}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("FastAPI error:", response.status, errorText);
      return NextResponse.json(
        { error: `FastAPI returned ${response.status}: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Prediction API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Prediction failed" },
      { status: 500 }
    );
  }
}
