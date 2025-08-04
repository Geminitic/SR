import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Car, MapPin, Clock, DollarSign, Users, Navigation, Phone } from 'lucide-react-native';

const mockRideRequests = [
  {
    id: '1',
    riderName: 'Sarah Johnson',
    pickup: '123 Main St, Edmonton',
    destination: '456 Oak Ave, Edmonton',
    distance: '2.3 km',
    estimatedFare: '$8.50',
    rideType: 'volunteer',
    timeRequested: '5 min ago',
    notes: 'Please call when you arrive',
  },
  {
    id: '2',
    riderName: 'Robert Smith',
    pickup: '789 Pine St, Edmonton',
    destination: 'University of Alberta',
    distance: '4.1 km',
    estimatedFare: '$12.00',
    rideType: 'weekday',
    timeRequested: '8 min ago',
    notes: 'Wheelchair accessible vehicle needed',
  },
];

export default function Driver() {
  const [isOnline, setIsOnline] = useState(false);
  const [availableForVolunteer, setAvailableForVolunteer] = useState(true);
  const [availableForWeekday, setAvailableForWeekday] = useState(false);
  const [currentRide, setCurrentRide] = useState(null);

  const handleToggleOnline = () => {
    setIsOnline(!isOnline);
    if (!isOnline) {
      Alert.alert('Going Online', 'You are now available to receive ride requests!');
    }
  };

  const handleAcceptRide = (rideId: string) => {
    Alert.alert(
      'Accept Ride',
      'Are you sure you want to accept this ride request?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Accept', 
          onPress: () => {
            const ride = mockRideRequests.find(r => r.id === rideId);
            setCurrentRide(ride);
            Alert.alert('Ride Accepted!', 'Navigate to pickup location and contact the rider.');
          }
        }
      ]
    );
  };

  const handleCompleteRide = () => {
    Alert.alert(
      'Complete Ride',
      'Mark this ride as completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Complete', 
          onPress: () => {
            setCurrentRide(null);
            Alert.alert('Ride Completed!', 'Thank you for helping your community.');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Driver Dashboard</Text>
          <Text style={styles.subtitle}>Help your community get around safely</Text>
        </View>

        {/* Online Status */}
        <View style={styles.statusSection}>
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <Text style={styles.statusTitle}>Driver Status</Text>
              <View style={[styles.statusIndicator, { backgroundColor: isOnline ? '#10B981' : '#EF4444' }]} />
            </View>
            
            <View style={styles.statusControl}>
              <Text style={styles.statusLabel}>
                {isOnline ? 'Online - Receiving Requests' : 'Offline'}
              </Text>
              <Switch
                value={isOnline}
                onValueChange={handleToggleOnline}
                trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                thumbColor={isOnline ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
          </View>
        </View>

        {/* Availability Settings */}
        {isOnline && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ride Type Availability</Text>
            
            <View style={styles.availabilityCard}>
              <View style={styles.availabilityItem}>
                <View style={styles.availabilityInfo}>
                  <Text style={styles.availabilityTitle}>Volunteer Rides</Text>
                  <Text style={styles.availabilityDescription}>Free community rides</Text>
                </View>
                <Switch
                  value={availableForVolunteer}
                  onValueChange={setAvailableForVolunteer}
                  trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                  thumbColor='#FFFFFF'
                />
              </View>
              
              <View style={styles.availabilityItem}>
                <View style={styles.availabilityInfo}>
                  <Text style={styles.availabilityTitle}>Weekday Rides</Text>
                  <Text style={styles.availabilityDescription}>Paid rides Mon-Fri</Text>
                </View>
                <Switch
                  value={availableForWeekday}
                  onValueChange={setAvailableForWeekday}
                  trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                  thumbColor='#FFFFFF'
                />
              </View>
            </View>
          </View>
        )}

        {/* Current Ride */}
        {currentRide && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current Ride</Text>
            
            <View style={styles.currentRideCard}>
              <View style={styles.rideHeader}>
                <Text style={styles.riderName}>{currentRide.riderName}</Text>
                <Text style={[styles.rideType, { 
                  color: currentRide.rideType === 'volunteer' ? '#10B981' : '#3B82F6' 
                }]}>
                  {currentRide.rideType === 'volunteer' ? 'Volunteer' : 'Paid'}
                </Text>
              </View>
              
              <View style={styles.rideDetails}>
                <View style={styles.rideLocation}>
                  <MapPin size={16} color="#10B981" />
                  <Text style={styles.locationText}>{currentRide.pickup}</Text>
                </View>
                <View style={styles.rideLocation}>
                  <MapPin size={16} color="#EF4444" />
                  <Text style={styles.locationText}>{currentRide.destination}</Text>
                </View>
              </View>
              
              <View style={styles.rideActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Navigation size={20} color="#3B82F6" />
                  <Text style={styles.actionButtonText}>Navigate</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                  <Phone size={20} color="#10B981" />
                  <Text style={styles.actionButtonText}>Call Rider</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.completeButton]}
                  onPress={handleCompleteRide}
                >
                  <Text style={styles.completeButtonText}>Complete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Available Rides */}
        {isOnline && !currentRide && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Ride Requests</Text>
            
            {mockRideRequests.length === 0 ? (
              <View style={styles.noRidesCard}>
                <Car size={48} color="#9CA3AF" />
                <Text style={styles.noRidesText}>No ride requests available</Text>
                <Text style={styles.noRidesSubtext}>
                  You'll be notified when new requests come in
                </Text>
              </View>
            ) : (
              mockRideRequests.map((ride) => (
                <View key={ride.id} style={styles.rideRequestCard}>
                  <View style={styles.rideRequestHeader}>
                    <Text style={styles.riderName}>{ride.riderName}</Text>
                    <View style={styles.rideRequestMeta}>
                      <Text style={styles.timeRequested}>{ride.timeRequested}</Text>
                      <Text style={[styles.estimatedFare, { 
                        color: ride.rideType === 'volunteer' ? '#10B981' : '#3B82F6' 
                      }]}>
                        {ride.estimatedFare}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.rideRequestDetails}>
                    <View style={styles.rideLocation}>
                      <MapPin size={16} color="#10B981" />
                      <Text style={styles.locationText}>{ride.pickup}</Text>
                    </View>
                    <View style={styles.rideLocation}>
                      <MapPin size={16} color="#EF4444" />
                      <Text style={styles.locationText}>{ride.destination}</Text>
                    </View>
                    
                    <View style={styles.rideRequestInfo}>
                      <Text style={styles.distanceText}>
                        <Clock size={14} color="#6B7280" /> {ride.distance} • ~15 min
                      </Text>
                    </View>
                    
                    {ride.notes && (
                      <View style={styles.notesContainer}>
                        <Text style={styles.notesText}>Note: {ride.notes}</Text>
                      </View>
                    )}
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.acceptButton}
                    onPress={() => handleAcceptRide(ride.id)}
                  >
                    <Text style={styles.acceptButtonText}>Accept Ride</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}

        {/* Earnings Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Summary</Text>
          
          <View style={styles.earningsCard}>
            <View style={styles.earningsItem}>
              <Text style={styles.earningsValue}>3</Text>
              <Text style={styles.earningsLabel}>Rides Completed</Text>
            </View>
            <View style={styles.earningsItem}>
              <Text style={styles.earningsValue}>$24.50</Text>
              <Text style={styles.earningsLabel}>Earnings</Text>
            </View>
            <View style={styles.earningsItem}>
              <Text style={styles.earningsValue}>2</Text>
              <Text style={styles.earningsLabel}>Volunteer Rides</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  statusSection: {
    padding: 24,
  },
  statusCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusControl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  availabilityCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  availabilityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  availabilityInfo: {
    flex: 1,
  },
  availabilityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  availabilityDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  currentRideCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  riderName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  rideType: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  rideDetails: {
    marginBottom: 16,
  },
  rideLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    flex: 1,
  },
  rideActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#1F2937',
    marginLeft: 4,
    fontWeight: '500',
  },
  completeButton: {
    backgroundColor: '#10B981',
  },
  completeButtonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  noRidesCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  noRidesText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  noRidesSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  rideRequestCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  rideRequestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rideRequestMeta: {
    alignItems: 'flex-end',
  },
  timeRequested: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  estimatedFare: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rideRequestDetails: {
    marginBottom: 16,
  },
  rideRequestInfo: {
    marginTop: 8,
    marginBottom: 8,
  },
  distanceText: {
    fontSize: 14,
    color: '#6B7280',
  },
  notesContainer: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  notesText: {
    fontSize: 14,
    color: '#92400E',
    fontStyle: 'italic',
  },
  acceptButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  earningsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  earningsItem: {
    alignItems: 'center',
  },
  earningsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  earningsLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});