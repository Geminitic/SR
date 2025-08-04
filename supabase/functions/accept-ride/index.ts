import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { ride_id, driver_id } = await req.json()

    // Use a transaction to ensure only one driver can accept the ride
    const { data, error } = await supabaseClient.rpc('accept_ride_transaction', {
      p_ride_id: ride_id,
      p_driver_id: driver_id
    })

    if (error) {
      throw error
    }

    if (!data) {
      return new Response(
        JSON.stringify({ error: 'Ride already accepted by another driver' }),
        { 
          status: 409, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // TODO: Send push notification to rider about ride acceptance
    // await sendPushNotification(ride.rider_id, 'Your ride has been accepted!')

    return new Response(
      JSON.stringify({ success: true, ride: data }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})