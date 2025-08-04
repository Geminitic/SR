import { supabase } from './supabase'
import { Database } from '@/types/database'

type Ride = Database['public']['Tables']['rides']['Row']
type RideInsert = Database['public']['Tables']['rides']['Insert']
type RideUpdate = Database['public']['Tables']['rides']['Update']

export interface CreateRideRequest {
  pickupAddress: string
  pickupLatitude: number
  pickupLongitude: number
  destinationAddress: string
  destinationLatitude: number
  destinationLongitude: number
  rideType: 'volunteer' | 'weekday' | 'drive_back'
  scheduledTime?: string
  notes?: string
}

export interface RideWithDetails extends Ride {
  rider: {
    name: string
    phone: string | null
  }
  driver?: {
    name: string
    phone: string | null
    vehicle_make: string | null
    vehicle_model: string | null
    vehicle_color: string | null
    license_plate: string | null
  }
}

export const calculateRideFare = (
  distance: number,
  type: 'volunteer' | 'weekday' | 'return'
): number => {
  switch (type) {
    case 'volunteer':
      return Math.max(0, distance * 0)
    case 'weekday':
      return Math.max(5, distance * 1.75)
    case 'return':
      return Math.max(10, distance * 2.25)
    default:
      return 5
  }
}

export class RideService {
  async createRide(rideData: CreateRideRequest): Promise<Ride> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Calculate fare based on ride type and distance
    const fareAmount = this.calculateFare(rideData.rideType, rideData.pickupLatitude, rideData.pickupLongitude, rideData.destinationLatitude, rideData.destinationLongitude)

    const rideInsert: RideInsert = {
      rider_id: user.id,
      pickup_address: rideData.pickupAddress,
      pickup_latitude: rideData.pickupLatitude,
      pickup_longitude: rideData.pickupLongitude,
      destination_address: rideData.destinationAddress,
      destination_latitude: rideData.destinationLatitude,
      destination_longitude: rideData.destinationLongitude,
      ride_type: rideData.rideType,
      scheduled_time: rideData.scheduledTime,
      fare_amount: fareAmount,
      notes: rideData.notes,
      payment_status: rideData.rideType === 'volunteer' ? null : 'pending',
    }

    const { data, error } = await supabase
      .from('rides')
      .insert(rideInsert)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getAvailableRides(): Promise<RideWithDetails[]> {
    const { data, error } = await supabase
      .from('rides')
      .select(`
        *,
        rider:profiles!rides_rider_id_fkey(name, phone)
      `)
      .eq('status', 'requested')
      .is('driver_id', null)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data as RideWithDetails[]
  }

  async getUserRides(userId?: string): Promise<RideWithDetails[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const targetUserId = userId || user.id

    const { data, error } = await supabase
      .from('rides')
      .select(`
        *,
        rider:profiles!rides_rider_id_fkey(name, phone),
        driver:profiles!rides_driver_id_fkey(name, phone)
      `)
      .or(`rider_id.eq.${targetUserId},driver_id.eq.${targetUserId}`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as RideWithDetails[]
  }

  async acceptRide(rideId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Use a transaction to ensure only one driver can accept
    const { error } = await supabase.rpc('accept_ride', {
      ride_id: rideId,
      driver_id: user.id
    })

    if (error) throw error
  }

  async updateRideStatus(rideId: string, status: Ride['status'], additionalData?: Partial<RideUpdate>): Promise<void> {
    const updates: RideUpdate = {
      status,
      ...additionalData,
    }

    if (status === 'in_progress') {
      updates.started_at = new Date().toISOString()
    } else if (status === 'completed') {
      updates.completed_at = new Date().toISOString()
    }

    const { error } = await supabase
      .from('rides')
      .update(updates)
      .eq('id', rideId)

    if (error) throw error
  }

  async cancelRide(rideId: string): Promise<void> {
    await this.updateRideStatus(rideId, 'cancelled')
  }

  private calculateFare(rideType: string, pickupLat: number, pickupLng: number, destLat: number, destLng: number): number | null {
    if (rideType === 'volunteer') return null

    // Calculate distance using Haversine formula
    const distance = this.calculateDistance(pickupLat, pickupLng, destLat, destLng)
    
    if (rideType === 'weekday') {
      // Base fare $5 + $1.50 per km, minimum $3.50 (Edmonton bylaw)
      const fare = Math.max(5 + (distance * 1.5), 3.5)
      return Math.round(fare * 100) / 100 // Round to 2 decimal places
    }
    
    if (rideType === 'drive_back') {
      // Higher rate for drive-back service
      const fare = Math.max(10 + (distance * 2), 10)
      return Math.round(fare * 100) / 100
    }

    return null
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371 // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1)
    const dLng = this.toRadians(lng2 - lng1)
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  // Real-time subscriptions
  subscribeToRideUpdates(rideId: string, callback: (ride: Ride) => void) {
    return supabase
      .channel(`ride-${rideId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'rides',
        filter: `id=eq.${rideId}`
      }, (payload) => {
        callback(payload.new as Ride)
      })
      .subscribe()
  }

  subscribeToAvailableRides(callback: (rides: RideWithDetails[]) => void) {
    return supabase
      .channel('available-rides')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'rides',
        filter: 'status=eq.requested'
      }, async () => {
        // Refetch available rides when changes occur
        const rides = await this.getAvailableRides()
        callback(rides)
      })
      .subscribe()
  }
}

export const rideService = new RideService()