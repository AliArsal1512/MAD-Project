// supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://skhzfeqbhpimhszkdhmp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNraHpmZXFiaHBpbWhzemtkaG1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2ODIxOTgsImV4cCI6MjA2NTI1ODE5OH0.ygUlUITSyrx2gfX_kwJz5slSEDappdPNnpXHxfi6j1c'
);
