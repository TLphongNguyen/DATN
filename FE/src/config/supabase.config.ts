import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zbibrtzipjlnmgotkxzq.supabase.co';
const supabaseKey =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpiaWJydHppcGpsbm1nb3RreHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0ODUwMTMsImV4cCI6MjA2NDA2MTAxM30.UCUvB5G_KR-lXbL3xOmWp4r_VnG4uFfj2P3E_to27yM';

export const supabase = createClient(supabaseUrl, supabaseKey);
