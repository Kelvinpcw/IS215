import React, { useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring, 
  withDelay, 
  Easing,
  interpolate,
  Extrapolate,
  useAnimatedScrollHandler
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function Index() {
  const router = useRouter();
  const scrollY = useSharedValue(0);
  const scrollRef = useRef(null);
  
  // Multiple animated values for staggered animations
  const fadeAnim = useSharedValue(0);
  const welcomeSlideAnim = useSharedValue(50);
  const medicationSlideAnim = useSharedValue(70);
  const appointmentsSlideAnim = useSharedValue(90);
  const tipsSlideAnim = useSharedValue(110);
  const emergencySlideAnim = useSharedValue(50);
  
  // Scale animations for cards on interaction
  const actionCardScale = useSharedValue(1);
  
  useEffect(() => {
    // Main content fade in
    fadeAnim.value = withTiming(1, { duration: 1000 });
    
    // Staggered slide-up animations
    welcomeSlideAnim.value = withTiming(0, { 
      duration: 800, 
      easing: Easing.out(Easing.quad) 
    });
    
    medicationSlideAnim.value = withDelay(
      200, 
      withTiming(0, { 
        duration: 800, 
        easing: Easing.out(Easing.quad) 
      })
    );
    
    appointmentsSlideAnim.value = withDelay(
      400, 
      withTiming(0, { 
        duration: 800, 
        easing: Easing.out(Easing.quad) 
      })
    );
    
    tipsSlideAnim.value = withDelay(
      600, 
      withTiming(0, { 
        duration: 800, 
        easing: Easing.out(Easing.quad) 
      })
    );
    
    emergencySlideAnim.value = withDelay(
      800, 
      withTiming(0, { 
        duration: 800, 
        easing: Easing.out(Easing.quad) 
      })
    );
  }, []);
  
  // Scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  
  // Animated styles for sections
  const welcomeAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ translateY: welcomeSlideAnim.value }],
    };
  });
  
  const medicationAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ translateY: medicationSlideAnim.value }],
    };
  });
  
  const appointmentsAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ translateY: appointmentsSlideAnim.value }],
    };
  });
  
  const tipsAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ translateY: tipsSlideAnim.value }],
    };
  });
  
  const emergencyAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ translateY: emergencySlideAnim.value }],
    };
  });
  
  // Parallax effect for header
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { 
          translateY: interpolate(
            scrollY.value,
            [0, 100],
            [0, -20],
            Extrapolate.CLAMP
          ) 
        }
      ],
      opacity: interpolate(
        scrollY.value,
        [0, 100],
        [1, 0.9],
        Extrapolate.CLAMP
      )
    };
  });
  
  // Action card press animation
  const actionCardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: actionCardScale.value }]
    };
  });

  const pressActionCard = () => {
    actionCardScale.value = withSpring(0.95, { damping: 10 });
    setTimeout(() => {
      actionCardScale.value = withSpring(1);
    }, 150);
  };

  const navigateTo = (screen: string) => {
    pressActionCard();
    setTimeout(() => {
      router.push(screen);
    }, 150);
  };

  // Images with actual URLs instead of placeholders
  const logoImage = require('../assets/images/singhealth-logo.png'); // You'll need to add this to your assets
  const tipImages = {
    hydration: require('../assets/images/hydration-tip.jpg'), // You'll need to add this to your assets
    sleep: require('../assets/images/sleep-tip.jpg') // You'll need to add this to your assets
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#f0f9ff', '#ffffff']}
        style={styles.background}
      />
      
      {/* Header with Animated Opacity */}
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <Image 
          source={logoImage} 
          style={styles.logo}
          defaultSource={require('../assets/images/logo-placeholder.png')} // Placeholder during loading
        />
        <AnimatedTouchableOpacity 
          style={[styles.profileButton, actionCardAnimatedStyle]}
          onPress={() => navigateTo('/profile')}
          onPressIn={pressActionCard}
        >
          <Ionicons name="person-circle-outline" size={32} color="#0077b6" />
        </AnimatedTouchableOpacity>
      </Animated.View>
      
      <Animated.ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        ref={scrollRef}
        onScroll={scrollHandler}
        scrollEventThrottle={16} // Important for smooth animations
      >
        <Animated.View style={[styles.welcomeSection, welcomeAnimatedStyle]}>
          <Text style={styles.welcomeText}>Welcome to SingHealth</Text>
          <Text style={styles.subtitle}>Your health, our priority</Text>
          
          {/* Quick Action Cards - With Press Animation */}
          <View style={styles.quickActionsContainer}>
            {/* First row */}
            <View style={styles.actionRow}>
              <AnimatedTouchableOpacity 
                style={[styles.actionCard, actionCardAnimatedStyle]}
                onPress={() => navigateTo('/appointments')}
                onPressIn={pressActionCard}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name="calendar" size={28} color="#ffffff" />
                </View>
                <Text style={styles.actionText}>Book Appointment</Text>
              </AnimatedTouchableOpacity>
              
              <AnimatedTouchableOpacity 
                style={[styles.actionCard, actionCardAnimatedStyle]}
                onPress={() => navigateTo('/health')}
                onPressIn={pressActionCard}
              >
                <View style={[styles.iconContainer, { backgroundColor: '#22c55e' }]}>
                  <Ionicons name="medkit" size={28} color="#ffffff" />
                </View>
                <Text style={styles.actionText}>Health Assistant</Text>
              </AnimatedTouchableOpacity>
            </View>
            
            {/* Second row */}
            <View style={styles.actionRow}>
              <AnimatedTouchableOpacity 
                style={[styles.actionCard, actionCardAnimatedStyle]}
                onPress={() => navigateTo('/medication')}
                onPressIn={pressActionCard}
              >
                <View style={[styles.iconContainer, { backgroundColor: '#f59e0b' }]}>
                  <Ionicons name="medical" size={28} color="#ffffff" />
                </View>
                <Text style={styles.actionText}>Medication</Text>
              </AnimatedTouchableOpacity>
              
              <AnimatedTouchableOpacity 
                style={[styles.actionCard, actionCardAnimatedStyle]}
                onPress={() => navigateTo('/reports')}
                onPressIn={pressActionCard}
              >
                <View style={[styles.iconContainer, { backgroundColor: '#8b5cf6' }]}>
                  <Ionicons name="document-text" size={28} color="#ffffff" />
                </View>
                <Text style={styles.actionText}>Health Report</Text>
              </AnimatedTouchableOpacity>
            </View>
          </View>
        </Animated.View>
        
        {/* Medication Reminders Section with staggered animation */}
        <Animated.View style={[styles.sectionContainer, medicationAnimatedStyle]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Medication Reminders</Text>
            <TouchableOpacity onPress={() => navigateTo('/medication')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {/* Today's Medication Card */}
          <TouchableOpacity 
            style={styles.medicationCard}
            activeOpacity={0.8}
          >
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
            <TouchableOpacity 
              style={styles.takenButton}
              activeOpacity={0.7}
            >
              <Text style={styles.takenButtonText}>Mark as Taken</Text>
            </TouchableOpacity>
          </TouchableOpacity>
          
          {/* Evening Medication Card */}
          <TouchableOpacity 
            style={styles.medicationCard}
            activeOpacity={0.8}
          >
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
          </TouchableOpacity>
          
          {/* Add Medication Button */}
          <TouchableOpacity 
            style={styles.addMedicationButton}
            onPress={() => navigateTo('/medication')}
            activeOpacity={0.7}
          >
            <Ionicons name="add-circle-outline" size={20} color="#ffffff" />
            <Text style={styles.addMedicationText}>Add Medication</Text>
          </TouchableOpacity>
        </Animated.View>
        
        {/* Upcoming Appointments Section with staggered animation */}
        <Animated.View style={[styles.sectionContainer, appointmentsAnimatedStyle]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
            <TouchableOpacity onPress={() => navigateTo('/appointments')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.appointmentCard}
            activeOpacity={0.8}
          >
            <View style={styles.appointmentCardLeft}>
              <Text style={styles.appointmentDate}>Wed, Apr 2</Text>
              <Text style={styles.appointmentTime}>9:30 AM</Text>
            </View>
            <View style={styles.appointmentCardRight}>
              <Text style={styles.doctorName}>Dr. Tan Mei Ling</Text>
              <Text style={styles.appointmentType}>General Checkup</Text>
              <Text style={styles.appointmentLocation}>Singapore General Hospital</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
        
        {/* Health Tips Section with staggered animation and improved images */}
        <Animated.View style={[styles.sectionContainer, tipsAnimatedStyle]}>
          <Text style={styles.sectionTitle}>Health Tips</Text>
          
          <TouchableOpacity 
            style={styles.tipCard}
            activeOpacity={0.8}
          >
            <Image 
              source={tipImages.hydration} 
              style={styles.tipImage}
              defaultSource={require('../assets/images/tip-placeholder.png')}
            />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Stay Hydrated</Text>
              <Text style={styles.tipDescription}>
                Drink at least 8 glasses of water daily to maintain optimal health.
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tipCard}
            activeOpacity={0.8}
          >
            <Image 
              source={tipImages.sleep} 
              style={styles.tipImage}
              defaultSource={require('../assets/images/tip-placeholder.png')}
            />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Sleep Well</Text>
              <Text style={styles.tipDescription}>
                Aim for 7-8 hours of quality sleep for better physical and mental health.
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
        
        {/* Emergency Information with bounce animation */}
        <Animated.View style={[emergencyAnimatedStyle, { marginHorizontal: 20, marginBottom: 30 }]}>
          <TouchableOpacity 
            style={styles.emergencyBanner}
            activeOpacity={0.8}
          >
            <Ionicons name="alert-circle" size={24} color="#ffffff" />
            <Text style={styles.emergencyText}>Emergency? Call 995</Text>
          </TouchableOpacity>
        </Animated.View>
        
        <View style={styles.footer} />
      </Animated.ScrollView>
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
    zIndex: 10,
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
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: (width - 60) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0077b6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionText: {
    marginTop: 5,
    fontWeight: '600',
    color: '#1e293b',
    fontSize: 14,
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
    fontSize: 20,
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
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
  // Medication styles (improved)
  medicationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addMedicationText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
  // Tip styles (improved)
  tipCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 15,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 15,
  },
  tipImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
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
    borderRadius: 16,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
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