import React, { useEffect } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function Index() {
  const router = useRouter();
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);
  
  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 1000 });
    slideAnim.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.quad) });
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ translateY: slideAnim.value }],
    };
  });

  const navigateTo = (screen: string) => {
    router.push(screen);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#f0f9ff', '#ffffff']}
        style={styles.background}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://placehold.co/200x50?text=SingHealth' }} 
          style={styles.logo}
        />
        <TouchableOpacity style={styles.profileButton} onPress={() => navigateTo('/profile')}>
          <Ionicons name="person-circle-outline" size={32} color="#0077b6" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.welcomeSection, animatedStyle]}>
          <Text style={styles.welcomeText}>Welcome to SingHealth</Text>
          <Text style={styles.subtitle}>Your health, our priority</Text>
          
          {/* Quick Action Cards - Modified to 2x2 grid */}
          <View style={styles.quickActionsContainer}>
            {/* First row */}
            <View style={styles.actionRow}>
              <TouchableOpacity 
                style={styles.actionCard}
                onPress={() => navigateTo('/appointments')}
              >
                <Ionicons name="calendar" size={28} color="#0077b6" />
                <Text style={styles.actionText}>Book Appointment</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionCard}
                onPress={() => navigateTo('/health')}
              >
                <Ionicons name="medkit" size={28} color="#0077b6" />
                <Text style={styles.actionText}>Health Assistant</Text>
              </TouchableOpacity>
            </View>
            
            {/* Second row */}
            <View style={styles.actionRow}>
              <TouchableOpacity 
                style={styles.actionCard}
                onPress={() => navigateTo('/medication')}
              >
                <Ionicons name="medical" size={28} color="#0077b6" />
                <Text style={styles.actionText}>Medication</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionCard}
                onPress={() => navigateTo('/reports')}
              >
                <Ionicons name="document-text" size={28} color="#0077b6" />
                <Text style={styles.actionText}>Health Report</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
        
        {/* Medication Reminders Section (Moved up) */}
        <Animated.View style={[styles.sectionContainer, animatedStyle]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Medication Reminders</Text>
            <TouchableOpacity onPress={() => navigateTo('/medication')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {/* Today's Medication Card */}
          <View style={styles.medicationCard}>
            <View style={styles.medicationTime}>
              <Ionicons name="time-outline" size={24} color="#0077b6" />
              <Text style={styles.medTimeText}>8:00 AM</Text>
            </View>
            <View style={styles.medicationDivider} />
            <View style={styles.medicationDetails}>
              <Text style={styles.medicationName}>Simvastatin 20mg</Text>
              <Text style={styles.medicationInstructions}>
                Take 1 tablet with food
              </Text>
              <View style={styles.medicationStatusContainer}>
                <View style={styles.statusIndicator} />
                <Text style={styles.statusText}>Take now</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.takenButton}>
              <Text style={styles.takenButtonText}>Mark as Taken</Text>
            </TouchableOpacity>
          </View>
          
          {/* Evening Medication Card */}
          <View style={styles.medicationCard}>
            <View style={styles.medicationTime}>
              <Ionicons name="time-outline" size={24} color="#0077b6" />
              <Text style={styles.medTimeText}>7:00 PM</Text>
            </View>
            <View style={styles.medicationDivider} />
            <View style={styles.medicationDetails}>
              <Text style={styles.medicationName}>Metformin 500mg</Text>
              <Text style={styles.medicationInstructions}>
                Take 1 tablet after dinner
              </Text>
              <View style={styles.medicationStatusContainer}>
                <View style={styles.upcomingIndicator} />
                <Text style={styles.upcomingStatusText}>Upcoming</Text>
              </View>
            </View>
          </View>
          
          {/* Add Medication Button */}
          <TouchableOpacity 
            style={styles.addMedicationButton}
            onPress={() => navigateTo('/medication')}
          >
            <Ionicons name="add-circle-outline" size={20} color="#ffffff" />
            <Text style={styles.addMedicationText}>Add Medication</Text>
          </TouchableOpacity>
        </Animated.View>
        
        {/* Upcoming Appointments Section (Moved down) */}
        <Animated.View style={[styles.sectionContainer, animatedStyle]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
            <TouchableOpacity onPress={() => navigateTo('/appointments')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.appointmentCard}>
            <View style={styles.appointmentCardLeft}>
              <Text style={styles.appointmentDate}>Wed, Apr 2</Text>
              <Text style={styles.appointmentTime}>9:30 AM</Text>
            </View>
            <View style={styles.appointmentCardRight}>
              <Text style={styles.doctorName}>Dr. Tan Mei Ling</Text>
              <Text style={styles.appointmentType}>General Checkup</Text>
              <Text style={styles.appointmentLocation}>Singapore General Hospital</Text>
            </View>
          </View>
          
          {/* Empty state for when no appointments */}
          {/* 
          <View style={styles.emptyStateContainer}>
            <Ionicons name="calendar-outline" size={60} color="#cbd5e1" />
            <Text style={styles.emptyStateText}>No upcoming appointments</Text>
            <TouchableOpacity 
              style={styles.bookButton}
              onPress={() => navigateTo('/appointments')}
            >
              <Text style={styles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
          */}
        </Animated.View>
        
        {/* Health Tips Section */}
        <Animated.View style={[styles.sectionContainer, animatedStyle]}>
          <Text style={styles.sectionTitle}>Health Tips</Text>
          
          <TouchableOpacity style={styles.tipCard}>
            <Image 
              source={{ uri: 'https://placehold.co/100?text=Health' }} 
              style={styles.tipImage}
            />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Stay Hydrated</Text>
              <Text style={styles.tipDescription}>
                Drink at least 8 glasses of water daily to maintain optimal health.
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.tipCard}>
            <Image 
              source={{ uri: 'https://placehold.co/100?text=Health' }} 
              style={styles.tipImage}
            />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Sleep Well</Text>
              <Text style={styles.tipDescription}>
                Aim for 7-8 hours of quality sleep for better physical and mental health.
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
        
        {/* Emergency Information */}
        <TouchableOpacity style={styles.emergencyBanner}>
          <Ionicons name="alert-circle" size={24} color="#ffffff" />
          <Text style={styles.emergencyText}>Emergency? Call 995</Text>
        </TouchableOpacity>
        
        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 300,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  logo: {
    width: 150,
    height: 40,
    resizeMode: 'contain',
  },
  profileButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  welcomeSection: {
    padding: 20,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0077b6',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 25,
  },
  quickActionsContainer: {
    marginVertical: 10,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  actionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: (width - 60) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  actionText: {
    marginTop: 10,
    fontWeight: '600',
    color: '#1e293b',
  },
  sectionContainer: {
    padding: 20,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 15,
  },
  seeAllText: {
    color: '#0077b6',
    fontWeight: '600',
  },
  appointmentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 10,
  },
  appointmentCardLeft: {
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
    paddingRight: 15,
    marginRight: 15,
    justifyContent: 'center',
  },
  appointmentDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  appointmentTime: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 5,
  },
  appointmentCardRight: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },
  appointmentType: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 5,
  },
  appointmentLocation: {
    fontSize: 14,
    color: '#64748b',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748b',
    marginVertical: 10,
  },
  bookButton: {
    backgroundColor: '#0077b6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  bookButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  // Medication styles (new)
  medicationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  medicationTime: {
    alignItems: 'center',
    width: 60,
  },
  medTimeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0077b6',
    marginTop: 5,
  },
  medicationDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#e2e8f0',
    marginHorizontal: 15,
  },
  medicationDetails: {
    flex: 1,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  medicationInstructions: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  medicationStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
    marginRight: 6,
  },
  upcomingIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#94a3b8',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#22c55e',
    fontWeight: '600',
  },
  upcomingStatusText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  takenButton: {
    backgroundColor: '#e2f2ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 10,
  },
  takenButtonText: {
    color: '#0077b6',
    fontWeight: '600',
    fontSize: 12,
  },
  addMedicationButton: {
    backgroundColor: '#0077b6',
    borderRadius: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  addMedicationText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
  // Existing styles from your original component
  tipCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 15,
  },
  tipImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  tipContent: {
    flex: 1,
    justifyContent: 'center',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },
  tipDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  emergencyBanner: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 30,
  },
  emergencyText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  footer: {
    height: 40,
  },
});