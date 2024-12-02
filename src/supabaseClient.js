import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pddaheejvijsusnibcmn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkZGFoZWVqdmlqc3VzbmliY21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI1ODkyNzcsImV4cCI6MjA0ODE2NTI3N30.D1l280cmh8X2WdlVIfxYBov7DReALSA1LbBvdqh3vkQ';

export const supabase = createClient(supabaseUrl, supabaseKey);
