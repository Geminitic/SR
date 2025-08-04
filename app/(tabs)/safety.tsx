import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Shield, Phone, Users, MapPin, TriangleAlert as AlertTriangle, Clock, Info } from 'lucide-react-native';

export default function Safety() {
  const [sosPressed, setSosPressed] = useState(false);

  const handleEmergencySOS = () => {
    Alert.alert(
      'Emergency SOS',
      'This will immediately contact emergency services and notify your emergency contacts with your location.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call Emergency', 
          style: 'destructive',
          onPress: () => {
            setSosPressed(true);
            // In production, this would:
            // 1. Call 911 or local emergency services
            // 2. Send SMS to emergency contacts with location
            // 3. Notify SafeRide support team
            // 4. Start recording trip data for incident report
            
            setTimeout(() => {
              Alert.alert(
                'Emergency Services Contacted',
                'Emergency services have been notified and your location has been shared with your emergency contacts.',
                [{ text: 'OK', onPress: () => setSosPressed(false) }]
              );
            }, 2000);
          }
        }
      ]
    );
  };

  const handleCall911 = () => {
    Linking.openURL('tel:911');
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:+1-780-555-0123');
  };

  const safetyTips = [
    {
      title: 'Verify Your Driver',
      description: 'Always check the driver\'s photo, name, and vehicle details before getting in.',
      icon: Users,
    },
    {
      title: 'Share Your Trip',
      description: 'Let friends or family know your pickup and destination before starting your ride.',
      icon: MapPin,
    },
    {
      title: 'Trust Your Instincts',
      description: 'If something doesn\'t feel right, don\'t hesitate to end the ride and contact support.',
      icon: AlertTriangle,
    },
    {
      title: 'Emergency Contacts',
      description: 'Keep your emergency contacts updated in your profile for immediate assistance.',
      icon: Phone,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Shield size={32} color="#3B82F6" />
          <Text style={styles.title}>Safety Center</Text>
          <Text style={styles.subtitle}>Your safety is our top priority</Text>
        </View>

        {/* Emergency SOS Button */}
        <View style={styles.emergencySection}>
          <TouchableOpacity
            style={[styles.sosButton, sosPressed && styles.sosButtonPressed]}
            onPress={handleEmergencySOS}
            disabled={sosPressed}
          >
            <Shield size={32} color="white" />
            <Text style={styles.sosText}>
              {sosPressed ? 'Calling Emergency Services...' : 'Emergency SOS'}
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.sosDescription}>
            Press and hold for immediate emergency assistance
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionCard} onPress={handleCall911}>
              <Phone size={24} color="#EF4444" />
              <Text style={styles.quickActionTitle}>Call 911</Text>
              <Text style={styles.quickActionDescription}>Emergency services</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionCard} onPress={handleCallSupport}>
              <Users size={24} color="#3B82F6" />
              <Text style={styles.quickActionTitle}>SafeRide Support</Text>
              <Text style={styles.quickActionDescription}>24/7 assistance</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Current Trip Safety */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trip Safety Features</Text>
          
          <View style={styles.safetyFeatureCard}>
            <View style={styles.featureItem}>
              <MapPin size={20} color="#10B981" />
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Real-time Tracking</Text>
                <Text style={styles.featureDescription}>
                  Your location is monitored throughout the ride
                </Text>
              </View>
            </View>
            
            <View style={styles.featureItem}>
              <Shield size={20} color="#10B981" />
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Verified Drivers</Text>
                <Text style={styles.featureDescription}>
                  All drivers undergo background checks and training
                </Text>
              </View>
            </View>
            
            <View style={styles.featureItem}>
              <Clock size={20} color="#10B981" />
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Trip Monitoring</Text>
                <Text style={styles.featureDescription}>
                  Automatic alerts if trip deviates from expected route
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Safety Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety Tips</Text>
          
          {safetyTips.map((tip, index) => {
            const IconComponent = tip.icon;
            return (
              <View key={index} style={styles.tipCard}>
                <View style={styles.tipIcon}>
                  <IconComponent size={24} color="#F59E0B" />
                </View>
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <Text style={styles.tipDescription}>{tip.description}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Emergency Contacts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          
          <View style={styles.contactsCard}>
            <View style={styles.contactItem}>
              <Text style={styles.contactType}>Emergency Services</Text>
              <TouchableOpacity onPress={handleCall911}>
                <Text style={styles.contactNumber}>911</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.contactItem}>
              <Text style={styles.contactType}>SafeRide Support</Text>
              <TouchableOpacity onPress={handleCallSupport}>
                <Text style={styles.contactNumber}>+1 (780) 555-0123</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.contactItem}>
              <Text style={styles.contactType}>Edmonton Police (Non-Emergency)</Text>
              <TouchableOpacity onPress={() => Linking.openURL('tel:+1-780-423-4567')}>
                <Text style={styles.contactNumber}>+1 (780) 423-4567</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Safety Information */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <Info size={24} color="#3B82F6" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Safety Information</Text>
              <Text style={styles.infoDescription}>
                SafeRide is committed to providing the safest transportation experience possible. 
                All volunteer drivers undergo thorough background checks, vehicle inspections, 
                and safety training as required by Edmonton regulations.
              </Text>
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
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  emergencySection: {
    padding: 24,
    alignItems: 'center',
  },
  sosButton: {
    backgroundColor: '#EF4444',
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 16,
  },
  sosButtonPressed: {
    backgroundColor: '#DC2626',
    transform: [{ scale: 0.95 }],
  },
  sosText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
    textAlign: 'center',
  },
  sosDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 200,
  },
  section: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionCard: {
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
  quickActionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  safetyFeatureCard: {
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
    marginBottom: 16,
  },
  featureText: {
    flex: 1,
    marginLeft: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  tipCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tipIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  contactsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  contactType: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
  },
  contactNumber: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoContent: {
    flex: 1,
    marginLeft: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  infoDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});