
import { createClient } from '@supabase/supabase-js';

// IMPORTANT: Replace with your actual Supabase Project URL and Anon Key
// You can get these from your Supabase project settings
const supabaseUrl = 'https://dkwqiygrfbfdzgngqbvu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrd3FpeWdyZmJmZHpnbmdxYnZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyODUzMTcsImV4cCI6MjA3Njg2MTMxN30.f6VnzbKZFafQ7JSMUVv-QpIBvQ28HrvxjH5Bde8tNWQ';

// FIX: Removed the check for placeholder credentials as they are set, which was causing a compile-time error.

export const supabase = createClient(supabaseUrl, supabaseAnonKey);