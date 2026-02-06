import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export let supabase;
export let isSupabaseConfigured = false;

if (supabaseUrl && supabaseAnonKey) {
    try {
        supabase = createClient(supabaseUrl, supabaseAnonKey);
        isSupabaseConfigured = true;
    } catch (e) {
        console.error("Supabase client failed to initialize:", e);
    }
} else {
    console.error("Missing Supabase credentials in .env file");
}
