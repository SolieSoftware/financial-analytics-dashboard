import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { paths } from '@/utils/paths'
import { redirect } from 'next/navigation'
import { createClient as createServerClient } from '@/utils/supabase/serverClient'
import { cookies } from 'next/headers'

export async function middleware(request: NextRequest) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser();


  if (!user) {
    return redirect(paths.login)
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/stock-profile',
    '/watchlist',
    '/reports',
    '/profile',
    '/register',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}