import { NextRequest, NextResponse } from "next/server";

const FASTAPI_URL = process.env.FASTAPI_URL || "http://localhost:8000";
export async function GET(request: NextRequest) {
   try {

        if (!FASTAPI_URL) {
            return NextResponse.json({ error: "FASTAPI_URL is not set" }, { status: 500 });
        }

        if (!request) {
            return NextResponse.json({ error: "Request is not set" }, { status: 500 });
        }

        const { searchParams } = new URL(request.url);

        const symbol = searchParams.get("symbol");

        const response = await fetch(`${FASTAPI_URL}/api/market-news/${symbol}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });


        if (!response.ok) {
            return NextResponse.json({ error: "Failed to fetch market news" }, { status: 500 });
        }

        const data = await response.json();

        return NextResponse.json(data);

    } catch (error)  {
        console.error("Error fetching market summary:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}