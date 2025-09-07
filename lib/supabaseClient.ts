import { createClient } from '@supabase/supabase-js';

// Supabase project URL aur anon key ko environment variables se read karenge
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Supabase client create
export const supabase = createClient(supabaseUrl, supabaseKey);
