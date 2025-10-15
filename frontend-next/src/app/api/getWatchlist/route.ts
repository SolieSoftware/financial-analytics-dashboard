import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/serverClient";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    
    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase.from('watchlist').select('*').eq('user_id', user.id);
    
    
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data }, { status: 200 });
  } catch (error) {
    console.error("Error getting watchlist:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}