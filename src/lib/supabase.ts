
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wuysgzjbdoucysqsrrrb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1eXNnempiZG91Y3lzcXNycnJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzMzEyMjUsImV4cCI6MjA1NTkwNzIyNX0.qZYALM4VYMKw_z8_-F929qSNPM6YdRiLYf8zhD0r0zY'
export const supabase = createClient(supabaseUrl, supabaseKey)
