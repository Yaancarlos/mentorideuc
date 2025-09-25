import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://xweqqodptdkqqjpjgyer.supabase.co"
const supabasePublishableKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3ZXFxb2RwdGRrcXFqcGpneWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NTc3OTcsImV4cCI6MjA3NDMzMzc5N30.JGkfgj8IbCfiraxUKf7JBcOdaEHvr1SXOXSTr21j5uE"

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})