import { supabase } from './supabase'

export const registerDriverForStripe = async (userId: string) => {
  const { data, error } = await supabase.functions.invoke('create-driver-account', {
    body: { user_id: userId }
  })
  if (error) throw error
  return data
}
