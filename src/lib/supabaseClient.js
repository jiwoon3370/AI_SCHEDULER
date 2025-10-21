import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
	// 친절한 경고: 런타임에서 발생하는 uncaught 에러를 막고 앱이 계속 동작하도록 함
	// VITE_ 접두사가 붙은 값은 클라이언트 번들에 포함됩니다. 익명(anon) 키만 사용하세요.
	console.warn(
		'VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not set. Supabase client is disabled. Set these environment variables in your Netlify site settings.'
	)
}

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

export function isSupabaseConfigured() {
	return !!supabase
}