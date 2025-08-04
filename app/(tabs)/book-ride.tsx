import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Clock, DollarSign, Users, MessageCircle } from 'lucide-react-native';

const rideTypes = [
  {
    id: 'volunteer',
    title: 'Volunteer Ride',
    description: 'Free ride with community volunteers',
    price: 'Free',
    color: '#10B981',
  },
  {
    id: 'weekday',
    title: 'Weekday Ride',
    description: 'Affordable rides Monday-Friday',
    price: 'From $5.00',
    color: '#3B82F6',
  },
  {
    id: 'return',
    title: 'Drive-Back Service',
    description: 'Volunteer drives your car back',
    price: 'From $10.00',
    color: '#F59E0B',
  },
];

export default function BookRide() {
  const [selectedRideType, setSelectedRideType] = useState('volunteer');
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isImmediate, setIsImmediate] = useState(true);

  const handleBookRide = () => {
    if (!pickup || !destination) {
      Alert.alert('Error', 'Please enter pickup and destination locations');
      return;
    }

    Alert.alert(
      'Ride Booked!',
      'Your ride request has been sent to nearby drivers. You will be notified when a driver accepts.',
      [{ text: 'OK' }]
    );
  };

  const selectedRide = rideTypes.find(type => type.id === selectedRideType);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Book a Ride</Text>
          <Text style={styles.subtitle}>Safe transportation when you need it</Text>
        </View>

        {/* Ride Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Ride Type</Text>
          
          {rideTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.rideTypeCard,
                selectedRideType === type.id && styles.selectedRideType,
                { borderColor: selectedRideType === type.id ? type.color : '#E5E7EB' }
              ]}
              onPress={() => setSelectedRideType(type.id)}
            >
              <View style={styles.rideTypeContent}>
                <Text style={styles.rideTypeTitle}>{type.title}</Text>
                <Text style={styles.rideTypeDescription}>{type.description}</Text>
              </View>
              <Text style={[styles.rideTypePrice, { color: type.color }]}>
                {type.price}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Location Inputs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trip Details</Text>
          
          <View style={styles.inputContainer}>
            <MapPin size={20} color="#10B981" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Pickup location"
              placeholderTextColor="#9CA3AF"
              value={pickup}
              onChangeText={setPickup}
            />
          </View>

          <View style={styles.inputContainer}>
            <MapPin size={20} color="#EF4444" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Destination"
              placeholderTextColor="#9CA3AF"
              value={destination}
              onChangeText={setDestination}
            />
          </View>
        </View>

        {/* Timing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>When do you need this ride?</Text>
          
          <View style={styles.timingOptions}>
            <TouchableOpacity
              style={[styles.timingOption, isImmediate && styles.selectedTiming]}
              onPress={() => setIsImmediate(true)}
            >
              <Text style={[styles.timingText, isImmediate && styles.selectedTimingText]}>
                Now
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.timingOption, !isImmediate && styles.selectedTiming]}
              onPress={() => setIsImmediate(false)}
            >
              <Text style={[styles.timingText, !isImmediate && styles.selectedTimingText]}>
                Schedule
              </Text>
            </TouchableOpacity>
          </View>

          {!isImmediate && (
            <View style={styles.inputContainer}>
              <Clock size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Select date and time"
                placeholderTextColor="#9CA3AF"
                value={scheduledTime}
                onChangeText={setScheduledTime}
              />
            </View>
          )}
        </View>

        {/* Additional Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Notes (Optional)</Text>
          
          <View style={styles.notesContainer}>
            <MessageCircle size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, styles.notesInput]}
              placeholder="Any special requests or accessibility needs?"
              placeholderTextColor="#9CA3AF"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Booking Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Booking Summary</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Ride Type:</Text>
            <Text style={styles.summaryValue}>{selectedRide?.title}</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Estimated Cost:</Text>
            <Text style={[styles.summaryValue, { color: selectedRide?.color }]}>
              {selectedRide?.price}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Timing:</Text>
            <Text style={styles.summaryValue}>
              {isImmediate ? 'Immediate' : 'Scheduled'}
            </Text>
          </View>
        </View>

        {/* Book Button */}
        <TouchableOpacity
          style={[styles.bookButton, { backgroundColor: selectedRide?.color }]}
          onPress={handleBookRide}
        >
          <Text style={styles.bookButtonText}>Request Ride</Text>
        </TouchableOpacity>
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
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  rideTypeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedRideType: {
    transform: [{ scale: 1.02 }],
  },
  rideTypeContent: {
    flex: 1,
  },
  rideTypeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  rideTypeDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  rideTypePrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  notesInput: {
    minHeight: 80,
  },
  timingOptions: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timingOption: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  selectedTiming: {
    borderColor: '#3B82F6',
    backgroundColor: '#EBF8FF',
  },
  timingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  selectedTimingText: {
    color: '#3B82F6',
  },
  summary: {
    backgroundColor: 'white',
    margin: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryHeader: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  bookButton: {
    marginHorizontal: 24,
    marginBottom: 32,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  bookButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});