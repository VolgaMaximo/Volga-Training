import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oswvsqryavzrqwbnjvbc.supabase.co';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_8woC0zgnxHFVTpGDt_m5SA_oVDKNYZZ';

export const supabase = createClient(url, key);
