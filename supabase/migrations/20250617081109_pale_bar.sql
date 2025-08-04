-- Create function to accept ride with transaction safety
CREATE OR REPLACE FUNCTION accept_ride_transaction(p_ride_id UUID, p_driver_id UUID)
RETURNS TABLE(
  id UUID,
  rider_id UUID,
  driver_id UUID,
  pickup_address TEXT,
  destination_address TEXT,
  ride_type TEXT,
  status TEXT,
  fare_amount DECIMAL(10,2),
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  -- Update the ride if it's still available
  UPDATE rides 
  SET 
    driver_id = p_driver_id,
    status = 'accepted',
    updated_at = NOW()
  WHERE 
    rides.id = p_ride_id 
    AND rides.status = 'requested' 
    AND rides.driver_id IS NULL;

  -- Check if the update was successful
  IF NOT FOUND THEN
    RETURN; -- Ride was already accepted or doesn't exist
  END IF;

  -- Return the updated ride
  RETURN QUERY
  SELECT 
    r.id,
    r.rider_id,
    r.driver_id,
    r.pickup_address,
    r.destination_address,
    r.ride_type,
    r.status,
    r.fare_amount,
    r.created_at
  FROM rides r
  WHERE r.id = p_ride_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to calculate distance between two points
CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 DECIMAL(10,8),
  lng1 DECIMAL(11,8),
  lat2 DECIMAL(10,8),
  lng2 DECIMAL(11,8)
) RETURNS DECIMAL(10,2) AS $$
DECLARE
  earth_radius DECIMAL := 6371; -- Earth's radius in kilometers
  dlat DECIMAL;
  dlng DECIMAL;
  a DECIMAL;
  c DECIMAL;
  distance DECIMAL;
BEGIN
  dlat := RADIANS(lat2 - lat1);
  dlng := RADIANS(lng2 - lng1);
  
  a := SIN(dlat/2) * SIN(dlat/2) + 
       COS(RADIANS(lat1)) * COS(RADIANS(lat2)) * 
       SIN(dlng/2) * SIN(dlng/2);
  
  c := 2 * ATAN2(SQRT(a), SQRT(1-a));
  distance := earth_radius * c;
  
  RETURN ROUND(distance, 2);
END;
$$ LANGUAGE plpgsql;

-- Create function to get nearby available rides for drivers
CREATE OR REPLACE FUNCTION get_nearby_rides(
  driver_lat DECIMAL(10,8),
  driver_lng DECIMAL(11,8),
  max_distance_km DECIMAL DEFAULT 10
) RETURNS TABLE(
  id UUID,
  rider_id UUID,
  pickup_address TEXT,
  pickup_latitude DECIMAL(10,8),
  pickup_longitude DECIMAL(11,8),
  destination_address TEXT,
  destination_latitude DECIMAL(10,8),
  destination_longitude DECIMAL(11,8),
  ride_type TEXT,
  fare_amount DECIMAL(10,2),
  distance_km DECIMAL(10,2),
  created_at TIMESTAMPTZ,
  rider_name TEXT,
  rider_phone TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.rider_id,
    r.pickup_address,
    r.pickup_latitude,
    r.pickup_longitude,
    r.destination_address,
    r.destination_latitude,
    r.destination_longitude,
    r.ride_type,
    r.fare_amount,
    calculate_distance(driver_lat, driver_lng, r.pickup_latitude, r.pickup_longitude) as distance_km,
    r.created_at,
    p.name as rider_name,
    p.phone as rider_phone
  FROM rides r
  JOIN profiles p ON r.rider_id = p.id
  WHERE 
    r.status = 'requested' 
    AND r.driver_id IS NULL
    AND calculate_distance(driver_lat, driver_lng, r.pickup_latitude, r.pickup_longitude) <= max_distance_km
  ORDER BY distance_km ASC, r.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update driver location during ride
CREATE OR REPLACE FUNCTION update_driver_location(
  p_ride_id UUID,
  p_latitude DECIMAL(10,8),
  p_longitude DECIMAL(11,8)
) RETURNS BOOLEAN AS $$
DECLARE
  ride_exists BOOLEAN;
BEGIN
  -- Check if the ride exists and is in progress
  SELECT EXISTS(
    SELECT 1 FROM rides 
    WHERE id = p_ride_id 
    AND status IN ('accepted', 'in_progress')
    AND driver_id = auth.uid()
  ) INTO ride_exists;

  IF NOT ride_exists THEN
    RETURN FALSE;
  END IF;

  -- Insert location update
  INSERT INTO ride_locations (ride_id, driver_latitude, driver_longitude)
  VALUES (p_ride_id, p_latitude, p_longitude);

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;