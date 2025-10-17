import { NextRequest, NextResponse } from "next/server";

const FASTAPI_URL = process.env.FASTAPI_URL || "http://localhost:8000";

export async function GET(request: NextRequest) {
    try {
        const response = await fetch(`${FASTAPI_URL}/api/financial-modelling-prep/biggest-gainers`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            return NextResponse.json({ error: "Failed to fetch biggest gainers" }, { status: 500 });
        }

        const data = await response.json();

        return NextResponse.json(data);

    } catch (error) {
        console.error("Error fetching biggest gainers:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}