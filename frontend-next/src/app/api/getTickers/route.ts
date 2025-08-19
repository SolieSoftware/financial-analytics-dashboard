import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/serverClient";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {

    const { query } = await request.json();

    const supabase = await createClient(cookies());

    const { data, error } = await supabase.from("listings").select("Symbol").gt("Market Cap", 10000000000).ilike("Symbol", `%${query}%`).limit(30);

    if (error) {
      console.error("Error fetching tickers:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const tickers: { [key: string]: boolean } = {};

    data.forEach((item: { Symbol: string }) => {
      tickers[item.Symbol] = false;
    });

    return NextResponse.json({data: tickers});
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
