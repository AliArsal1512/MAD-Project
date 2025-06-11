import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ttgblbvyzomsjbmavtpl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0Z2JsYnZ5em9tc2pibWF2dHBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0OTA4MzgsImV4cCI6MjA2NTA2NjgzOH0.A_gSUudAaXTRpAQiH0u3KPnHhiSPPNC3Ei3KvppHDfg';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});