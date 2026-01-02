import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fjapncbcetbchzoostmw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqYXBuY2JjZXRiY2h6b29zdG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNjcxNjMsImV4cCI6MjA4Mjk0MzE2M30.vdXqcBVhMmlEwzZkMUFDwaCfS2jcn7B6he1UkqkhFYA';

export const supabase = createClient(supabaseUrl, supabaseKey);