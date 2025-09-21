import { createClient } from "@/utils/supabase/serverClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { username, first_name, last_name, email } = await request.json()


  const { data, error } = await supabase.from('profiles').insert({
    id: user.id,
    username: username,
    first_name: first_name,
    last_name: last_name,
    email: user.email,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })
  .select()
  .single()

  if (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(
    { succes: true, 
        profile:data 
    }, { status: 200 })
    
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

