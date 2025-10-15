import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/serverClient";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ticker } = await request.json();

    const { data, error } = await supabase.from('watchlist').insert({
        user_id: user.id,
        symbol: ticker,
        added_at: new Date().toISOString(),
    })
    .select()
    .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data }, { status: 200 });
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}