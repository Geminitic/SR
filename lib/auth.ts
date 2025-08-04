import { supabase } from './supabase'
import { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

export interface AuthUser {
  id: string
  email: string
  name: string
  phone?: string
  role: 'rider' | 'driver' | 'admin'
  profileImageUrl?: string
}

export class AuthService {
  async signUp(email: string, password: string, userData: { name: string; phone?: string }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          phone: userData.phone,
        },
      },
    })

    if (error) throw error

    // Update profile with additional data
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          phone: userData.phone,
        })
        .eq('id', data.user.id)

      if (profileError) throw profileError
    }

    return data
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  }

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return null

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error || !profile) return null

    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      phone: profile.phone || undefined,
      role: profile.role as 'rider' | 'driver' | 'admin',
      profileImageUrl: profile.profile_image_url || undefined,
    }
  }

  async updateProfile(updates: Partial<Pick<Profile, 'name' | 'phone' | 'profile_image_url'>>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)

    if (error) throw error
  }

  async updateUserRole(role: 'rider' | 'driver') {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', user.id)

    if (error) throw error

    // If becoming a driver, create driver_info record
    if (role === 'driver') {
      const { error: driverError } = await supabase
        .from('driver_info')
        .upsert({
          user_id: user.id,
          verification_status: 'pending',
          background_check_status: 'pending',
        })

      if (driverError) throw driverError
    }
  }

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) throw error
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = await this.getCurrentUser()
        callback(user)
      } else {
        callback(null)
      }
    })
  }
}

export const authService = new AuthService()