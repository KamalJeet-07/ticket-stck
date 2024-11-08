import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ijchgdqksnpnzsppvyxo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqY2hnZHFrc25wbnpzcHB2eXhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEwNTE5NzQsImV4cCI6MjA0NjYyNzk3NH0.d8hT1OH2NTWFRZpkVDZeiqLlj8a6KOLUt3rP9EAp4Fw';

export const supabase = createClient(supabaseUrl, supabaseKey);