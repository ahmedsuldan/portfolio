/* =====================================================
   SUPABASE CONFIGURATION
   =====================================================
   1. Tag https://supabase.com -> samee account (bilaash ah).
   2. Samee "New Project".
   3. Ka qaado Project URL iyo anon public key:
      Project Settings -> API
   4. Ku dhaji halkan hoose.
   ===================================================== */

const SUPABASE_URL = "https://prhyjexacbmqwofjnwbz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByaHlqZXhhY2JtcXdvZmpud2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5NzczNjcsImV4cCI6MjA5NzU1MzM2N30.9h_j3h3t9i3omMKWfQtQZtLMPoY3QbnS38GU2G_YqZ0";

// Initialize Supabase client (uses the global `supabase` object from the CDN script)
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
