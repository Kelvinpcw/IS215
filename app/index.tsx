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
          
          {/* Quick Action Cards */}
          <View style={styles.quickActionsContainer}>
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
        </Animated.View>
        
        {/* Upcoming Appointments Section */}
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
        
        {/* Health Services Section */}
        <Animated.View style={[styles.sectionContainer, animatedStyle]}>
          <Text style={styles.sectionTitle}>Health Services</Text>
          
          <ScrollView 
            horizontal={true} 
            showsHorizontalScrollIndicator={false}
            style={styles.servicesScrollView}
          >
            <TouchableOpacity style={styles.serviceCard}>
              <Ionicons name="heart" size={24} color="#0077b6" />
              <Text style={styles.serviceTitle}>Cardiology</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.serviceCard}>
              <Ionicons name="fitness" size={24} color="#0077b6" />
              <Text style={styles.serviceTitle}>Orthopedics</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.serviceCard}>
              <Ionicons name="eye" size={24} color="#0077b6" />
              <Text style={styles.serviceTitle}>Ophthalmology</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.serviceCard}>
              <Ionicons name="woman" size={24} color="#0077b6" />
              <Text style={styles.serviceTitle}>OB-GYN</Text>
            </TouchableOpacity>
          </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
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
  servicesScrollView: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  serviceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    width: 120,
    height: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  serviceTitle: {
    marginTop: 10,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
  },
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