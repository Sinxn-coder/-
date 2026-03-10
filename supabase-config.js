// Supabase Configuration
const SUPABASE_URL = "https://kwrszibirsysedhhfkkq.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_UyavIQCoc3VM2Gx6GwwIkA_ebDi47DW";

// Initialize the Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other scripts (if using modules)
// For plain JS, it's globally available as 'supabase'
window.supabase = supabase;
