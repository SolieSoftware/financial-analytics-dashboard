import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/serverClient";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const supabase = await createClient(cookies());

  const { data, error } = await supabase.from("listings").select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log(data);

  return NextResponse.json(data);
}
