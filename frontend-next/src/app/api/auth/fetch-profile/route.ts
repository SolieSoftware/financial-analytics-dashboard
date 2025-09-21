import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/serverClient";
import { requestProfileType } from "@/utils/types/auth";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const body = await request.json();

    if (!body.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", body.email);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
