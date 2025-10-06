import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export default async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_approved', true)

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.status(200).json(data)
}
