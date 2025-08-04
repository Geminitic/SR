import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from '@/hooks/useLocation';
import { MapPin, Clock, Shield, Star, Car, Users } from 'lucide-react-native';

export default function Home() {
  const { user } = useAuth();
  const { location } = useLocation();

  const handleQuickBook = () => {
    Alert.alert('Quick Book', 'This will open the ride booking screen');
  };

  const handleEmergency = () => {
    Alert.alert(
      'Emergency SOS',
      'This will contact emergency services and your emergency contacts',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Emergency', style: 'destructive' }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#3B82F6', '#1D4ED8']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>Hello, {user?.name || 'User'}!</Text>
            <Text style={styles.subGreeting}>
              {user?.role === 'driver' ? 'Ready to help your community?' : 'Where would you like to go?'}
            </Text>
            
            {location && (
              <View style={styles.locationContainer}>
                <MapPin size={16} color="#E5E7EB" />
                <Text style={styles.locationText}>
                  Current location: Edmonton, AB
                </Text>
              </View>
            )}
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.actionGrid}>
            {user?.role === 'rider' ? (
              <>
                <TouchableOpacity style={styles.actionCard} onPress={handleQuickBook}>
                  <Car size={32} color="#3B82F6" />
                  <Text style={styles.actionTitle}>Book Ride</Text>
                  <Text style={styles.actionDescription}>Request a safe ride now</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionCard}>
                  <Clock size={32} color="#10B981" />
                  <Text style={styles.actionTitle}>Schedule</Text>
                  <Text style={styles.actionDescription}>Plan a future trip</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity style={styles.actionCard}>
                  <Users size={32} color="#10B981" />
                  <Text style={styles.actionTitle}>Go Online</Text>
                  <Text style={styles.actionDescription}>Start receiving ride requests</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionCard}>
                  <Star size={32} color="#F59E0B" />
                  <Text style={styles.actionTitle}>Earnings</Text>
                  <Text style={styles.actionDescription}>View your trip history</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Safety Features */}
        <View style={styles.safetySection}>
          <Text style={styles.sectionTitle}>Safety First</Text>
          
          <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergency}>
            <Shield size={24} color="white" />
            <Text style={styles.emergencyText}>Emergency SOS</Text>
          </TouchableOpacity>
          
          <View style={styles.safetyFeatures}>
            <View style={styles.featureItem}>
              <Shield size={20} color="#10B981" />
              <Text style={styles.featureText}>Verified Drivers</Text>
            </View>
            <View style={styles.featureItem}>
              <MapPin size={20} color="#10B981" />
              <Text style={styles.featureText}>Real-time Tracking</Text>
            </View>
            <View style={styles.featureItem}>
              <Clock size={20} color="#10B981" />
              <Text style={styles.featureText}>24/7 Support</Text>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.recentActivity}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          
          <View style={styles.activityCard}>
            <Text style={styles.activityText}>
              {user?.role === 'rider' 
                ? 'No recent rides. Book your first ride!' 
                : 'No recent trips. Go online to start helping!'}
            </Text>
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
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingBottom: 32,
  },
  headerContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subGreeting: {
    fontSize: 16,
    color: '#E5E7EB',
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#E5E7EB',
    marginLeft: 8,
  },
  quickActions: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  safetySection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  emergencyButton: {
    backgroundColor: '#EF4444',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emergencyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  safetyFeatures: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#1F2937',
    marginLeft: 12,
  },
  recentActivity: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  activityText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});