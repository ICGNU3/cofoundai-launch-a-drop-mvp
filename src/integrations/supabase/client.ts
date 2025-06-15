
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://mwopsiduetlwehpcrkzg.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13b3BzaWR1ZXRsd2VocGNya3pnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NDczMzQsImV4cCI6MjA2NTUyMzMzNH0.LEW0Yv954JLgghQqwf51FZsRx7bkNFkl3a_2JzLEeZU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
