import { NextRequest, NextResponse } from "next/server";

const FASTAPI_URL = "http://localhost:8000";

export async function GET(request: NextRequest) {
  try {
    if (!FASTAPI_URL) {
      return NextResponse.json(
        { error: "FASTAPI_URL is not set" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get("ticker");

    if (!ticker) {
      return NextResponse.json(
        { error: "No ticker parameter provided" },
        { status: 400 }
      );
    }

    console.log("ticker", ticker);

    const response = await fetch(`${FASTAPI_URL}/api/tickers/${ticker}/data`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from Yahoo Finance Data" },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching ticker data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
