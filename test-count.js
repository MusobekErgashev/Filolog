import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkCount() {
    console.log("Fetching profiles count...");
    const { count, error, data } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
    
    console.log("Count:", count);
    console.log("Error:", error);
    
    // Also try without head: true to see if we get any rows
    const { data: rows, error: rowsError } = await supabase.from('profiles').select('*');
    console.log("Rows length:", rows?.length);
    console.log("Rows Error:", rowsError);
}

checkCount();
