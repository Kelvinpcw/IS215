import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeInDown
} from 'react-native-reanimated';

export default function Profile() {
  const router = useRouter();
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    opacity.value = withTiming(1, { duration: 1000 });
  }, []);
  
  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0077b6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <Ionicons name="settings-outline" size={24} color="#0077b6" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Profile Info */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)}>
          <View style={styles.profileInfoContainer}>
            <View style={styles.profileImageContainer}>
              <Ionicons name="person-circle" size={100} color="#0077b6" />
              <TouchableOpacity style={styles.editProfileButton}>
                <Ionicons name="pencil" size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.profileName}>Mary Tan</Text>
            <Text style={styles.profileId}>NRIC: S*****678J</Text>
            <View style={styles.profileActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="document-text-outline" size={22} color="#0077b6" />
                <Text style={styles.actionText}>Medical Records</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => router.push('/appointments')}
              >
                <Ionicons name="calendar-outline" size={22} color="#0077b6" />
                <Text style={styles.actionText}>Appointments</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
        
        {/* Medical Information */}
        <Animated.View 
          style={[styles.sectionContainer, cardStyle]}
          entering={FadeInDown.duration(600).delay(300)}
        >
          <Text style={styles.sectionTitle}>Medical Information</Text>
          
          <View style={styles.infoItem}>
            <View style={styles.infoItemLeft}>
              <Ionicons name="medical-outline" size={22} color="#0077b6" />
              <Text style={styles.infoLabel}>Blood Type</Text>
            </View>
            <Text style={styles.infoValue}>O+</Text>
          </View>
          
          <View style={styles.infoItem}>
            <View style={styles.infoItemLeft}>
              <Ionicons name="alert-circle-outline" size={22} color="#0077b6" />
              <Text style={styles.infoLabel}>Allergies</Text>
            </View>
            <Text style={styles.infoValue}>Penicillin, Peanuts, Asprin</Text>
          </View>
          
          <View style={styles.infoItem}>
            <View style={styles.infoItemLeft}>
              <Ionicons name="fitness-outline" size={22} color="#0077b6" />
              <Text style={styles.infoLabel}>Chronic Conditions</Text>
            </View>
            <Text style={styles.infoValue}>Hypertension</Text>
          </View>
          
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Medical Info</Text>
          </TouchableOpacity>
        </Animated.View>
        
        {/* Health Cards */}
        <Animated.View 
          style={[styles.sectionContainer, cardStyle]}
          entering={FadeInDown.duration(600).delay(400)}
        >
          <Text style={styles.sectionTitle}>Health Cards</Text>
          
          <View style={styles.healthCard}>
            <View style={styles.healthCardHeader}>
              <View>
                <Text style={styles.healthCardType}>Medical Card</Text>
                <Text style={styles.healthCardNumber}>SH-MC-123456789</Text>
              </View>
              <Ionicons name="medkit" size={28} color="#0077b6" />
            </View>
            <View style={styles.healthCardBody}>
              <Text style={styles.healthCardName}>John Tan</Text>
              <Text style={styles.healthCardExpiry}>Valid until: 31/12/2026</Text>
            </View>
          </View>
          
          <View style={styles.healthCard}>
            <View style={styles.healthCardHeader}>
              <View>
                <Text style={styles.healthCardType}>Insurance</Text>
                <Text style={styles.healthCardNumber}>MediShield Life</Text>
              </View>
              <Ionicons name="shield-checkmark" size={28} color="#0077b6" />
            </View>
            <View style={styles.healthCardBody}>
              <Text style={styles.healthCardName}>John Tan</Text>
              <Text style={styles.healthCardExpiry}>Policy #: MS-987654321</Text>
            </View>
          </View>
        </Animated.View>
        
        {/* Upcoming Appointments */}
        <Animated.View 
          style={[styles.sectionContainer, cardStyle]}
          entering={FadeInDown.duration(600).delay(500)}
        >
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
            <TouchableOpacity onPress={() => router.push('/appointments')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.appointmentCard}>
            <View style={styles.appointmentHeader}>
              <Text style={styles.appointmentDay}>WED</Text>
              <Text style={styles.appointmentDate}>2</Text>
              <Text style={styles.appointmentMonth}>APR</Text>
            </View>
            <View style={styles.appointmentBody}>
              <Text style={styles.appointmentTime}>9:30 AM</Text>
              <Text style={styles.appointmentDoctor}>Dr. Tan Mei Ling</Text>
              <Text style={styles.appointmentType}>General Checkup</Text>
              <Text style={styles.appointmentLocation}>Singapore General Hospital</Text>
            </View>
          </View>
        </Animated.View>
        
        {/* Notifications & Preferences */}
        <Animated.View 
          style={[styles.sectionContainer, cardStyle]}
          entering={FadeInDown.duration(600).delay(600)}
        >
          <Text style={styles.sectionTitle}>Notifications & Preferences</Text>
          
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceItemLeft}>
              <Ionicons name="notifications-outline" size={22} color="#0077b6" />
              <Text style={styles.preferenceLabel}>Appointment Reminders</Text>
            </View>
            <Switch 
              value={true}
              trackColor={{ false: '#e2e8f0', true: '#bae6fd' }}
              thumbColor={true ? '#0077b6' : '#f1f5f9'}
              ios_backgroundColor="#e2e8f0"
            />
          </View>
          
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceItemLeft}>
              <Ionicons name="mail-outline" size={22} color="#0077b6" />
              <Text style={styles.preferenceLabel}>Email Notifications</Text>
            </View>
            <Switch 
              value={true}
              trackColor={{ false: '#e2e8f0', true: '#bae6fd' }}
              thumbColor={true ? '#0077b6' : '#f1f5f9'}
              ios_backgroundColor="#e2e8f0"
            />
          </View>
          
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceItemLeft}>
              <Ionicons name="chatbox-outline" size={22} color="#0077b6" />
              <Text style={styles.preferenceLabel}>SMS Notifications</Text>
            </View>
            <Switch 
              value={false}
              trackColor={{ false: '#e2e8f0', true: '#bae6fd' }}
              thumbColor={false ? '#0077b6' : '#f1f5f9'}
              ios_backgroundColor="#e2e8f0"
            />
          </View>
        </Animated.View>
        
        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  content: {
    padding: 20,
  },
  profileInfoContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  editProfileButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0077b6',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },
  profileId: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
  },
  profileActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  actionButton: {
    alignItems: 'center',
    marginHorizontal: 15,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    color: '#0077b6',
    fontWeight: '500',
  },
  sectionContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionTitleContainer: {
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
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 16,
    color: '#1e293b',
    marginLeft: 10,
  },
  infoValue: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  editButton: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  editButtonText: {
    color: '#0077b6',
    fontWeight: '600',
  },
  healthCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#0077b6',
  },
  healthCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  healthCardType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0077b6',
    marginBottom: 5,
  },
  healthCardNumber: {
    fontSize: 14,
    color: '#64748b',
  },
  healthCardBody: {
    borderTopWidth: 1,
    borderTopColor: '#bae6fd',
    paddingTop: 15,
  },
  healthCardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 5,
  },
  healthCardExpiry: {
    fontSize: 14,
    color: '#64748b',
  },
  appointmentCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  appointmentHeader: {
    backgroundColor: '#0077b6',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
  },
  appointmentDay: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  appointmentDate: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  appointmentMonth: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  appointmentBody: {
    flex: 1,
    padding: 15,
  },
  appointmentTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0077b6',
    marginBottom: 5,
  },
  appointmentDoctor: {
    fontSize: 16,
    fontWeight: '600',
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
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  preferenceItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  preferenceLabel: {
    fontSize: 16,
    color: '#1e293b',
    marginLeft: 10,
  },
  footer: {
    height: 40,
  },
});