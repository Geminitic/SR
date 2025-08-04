export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          phone: string | null
          role: 'rider' | 'driver' | 'admin'
          profile_image_url: string | null
          emergency_contacts: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          phone?: string | null
          role?: 'rider' | 'driver' | 'admin'
          profile_image_url?: string | null
          emergency_contacts?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone?: string | null
          role?: 'rider' | 'driver' | 'admin'
          profile_image_url?: string | null
          emergency_contacts?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      rides: {
        Row: {
          id: string
          rider_id: string
          driver_id: string | null
          pickup_address: string
          pickup_latitude: number
          pickup_longitude: number
          destination_address: string
          destination_latitude: number
          destination_longitude: number
          ride_type: 'volunteer' | 'weekday' | 'drive_back'
          status: 'requested' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'emergency'
          scheduled_time: string | null
          fare_amount: number | null
          payment_status: 'pending' | 'paid' | 'failed' | null
          notes: string | null
          created_at: string
          updated_at: string
          started_at: string | null
          completed_at: string | null
        }
        Insert: {
          id?: string
          rider_id: string
          driver_id?: string | null
          pickup_address: string
          pickup_latitude: number
          pickup_longitude: number
          destination_address: string
          destination_latitude: number
          destination_longitude: number
          ride_type: 'volunteer' | 'weekday' | 'drive_back'
          status?: 'requested' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'emergency'
          scheduled_time?: string | null
          fare_amount?: number | null
          payment_status?: 'pending' | 'paid' | 'failed' | null
          notes?: string | null
          created_at?: string
          updated_at?: string
          started_at?: string | null
          completed_at?: string | null
        }
        Update: {
          id?: string
          rider_id?: string
          driver_id?: string | null
          pickup_address?: string
          pickup_latitude?: number
          pickup_longitude?: number
          destination_address?: string
          destination_latitude?: number
          destination_longitude?: number
          ride_type?: 'volunteer' | 'weekday' | 'drive_back'
          status?: 'requested' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'emergency'
          scheduled_time?: string | null
          fare_amount?: number | null
          payment_status?: 'pending' | 'paid' | 'failed' | null
          notes?: string | null
          created_at?: string
          updated_at?: string
          started_at?: string | null
          completed_at?: string | null
        }
      }
      driver_info: {
        Row: {
          id: string
          user_id: string
          vehicle_make: string | null
          vehicle_model: string | null
          vehicle_year: number | null
          vehicle_color: string | null
          license_plate: string | null
          drivers_license_number: string | null
          verification_status: 'pending' | 'verified' | 'rejected'
          background_check_status: 'pending' | 'approved' | 'rejected'
          is_available: boolean
          availability_volunteer: boolean
          availability_weekday: boolean
          total_earnings: number
          total_rides: number
          rating: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_year?: number | null
          vehicle_color?: string | null
          license_plate?: string | null
          drivers_license_number?: string | null
          verification_status?: 'pending' | 'verified' | 'rejected'
          background_check_status?: 'pending' | 'approved' | 'rejected'
          is_available?: boolean
          availability_volunteer?: boolean
          availability_weekday?: boolean
          total_earnings?: number
          total_rides?: number
          rating?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_year?: number | null
          vehicle_color?: string | null
          license_plate?: string | null
          drivers_license_number?: string | null
          verification_status?: 'pending' | 'verified' | 'rejected'
          background_check_status?: 'pending' | 'approved' | 'rejected'
          is_available?: boolean
          availability_volunteer?: boolean
          availability_weekday?: boolean
          total_earnings?: number
          total_rides?: number
          rating?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      emergency_contacts: {
        Row: {
          id: string
          user_id: string
          name: string
          phone: string
          relationship: string
          priority: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          phone: string
          relationship: string
          priority?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          phone?: string
          relationship?: string
          priority?: number
          created_at?: string
          updated_at?: string
        }
      }
      ride_locations: {
        Row: {
          id: string
          ride_id: string
          driver_latitude: number
          driver_longitude: number
          timestamp: string
        }
        Insert: {
          id?: string
          ride_id: string
          driver_latitude: number
          driver_longitude: number
          timestamp?: string
        }
        Update: {
          id?: string
          ride_id?: string
          driver_latitude?: number
          driver_longitude?: number
          timestamp?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}