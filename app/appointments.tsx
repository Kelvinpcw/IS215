import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Modal,
  FlatList,
  Pressable,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, addDays, isSameDay } from 'date-fns';
import { useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence, 
  withDelay,
  withSpring,
  Easing,
  FadeIn,
  FadeInDown
} from 'react-native-reanimated';

// Get screen width for responsive sizing
const { width } = Dimensions.get('window');

// Calculate card width based on screen size
const getCardWidth = () => {
  const cardPerRow = width < 360 ? 2 : 3;
  const totalMargin = 10 * (cardPerRow + 1);
  return (width - totalMargin) / cardPerRow;
};

// Mock data
const SPECIALTIES = [
  { id: '1', name: 'General Medicine', icon: 'medical' },
  { id: '2', name: 'Cardiology', icon: 'heart' },
  { id: '3', name: 'Pediatrics', icon: 'happy' },
  { id: '4', name: 'Orthopedics', icon: 'fitness' },
  { id: '5', name: 'Dermatology', icon: 'body' },
  { id: '6', name: 'Neurology', icon: 'pulse' },
  { id: '7', name: 'Ophthalmology', icon: 'eye' },
  { id: '8', name: 'ENT', icon: 'ear' },
];

const DOCTORS = [
  { id: '1', name: 'Dr. Tan Wei Ming', specialty: 'General Medicine', hospital: 'Singapore General Hospital', rating: 4.8, image: 'https://placehold.co/100?text=Doctor' },
  { id: '2', name: 'Dr. Sarah Wong', specialty: 'Cardiology', hospital: 'National Heart Centre', rating: 4.9, image: 'https://placehold.co/100?text=Doctor' },
  { id: '3', name: 'Dr. James Lee', specialty: 'Pediatrics', hospital: 'KK Women\'s and Children\'s Hospital', rating: 4.7, image: 'https://placehold.co/100?text=Doctor' },
  { id: '4', name: 'Dr. Priya Singh', specialty: 'Orthopedics', hospital: 'Changi General Hospital', rating: 4.6, image: 'https://placehold.co/100?text=Doctor' },
];

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'
];

export default function Appointments() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [successModal, setSuccessModal] = useState(false);
  
  // Animation variables
  const cardScale = useSharedValue(1);
  const fadeAnim = useSharedValue(0);
  
  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 500 });
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ scale: cardScale.value }],
    };
  });
  
  const handleSpecialtySelect = (specialty) => {
    cardScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    
    setSelectedSpecialty(specialty);
    setStep(2);
  };
  
  const handleDoctorSelect = (doctor) => {
    cardScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    
    setSelectedDoctor(doctor);
    setStep(3);
  };
  
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };
  
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };
  
  const handleBooking = () => {
    cardScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    
    setSuccessModal(true);
    
    // Reset state after 3 seconds
    setTimeout(() => {
      setSuccessModal(false);
      setStep(1);
      setSelectedSpecialty(null);
      setSelectedDoctor(null);
      setSelectedDate(new Date());
      setSelectedTime(null);
    }, 3000);
  };
  
  const renderDateItem = ({ item }) => {
    const date = addDays(new Date(), item);
    const isSelected = isSameDay(date, selectedDate);
    
    // Make weekends appear different
    const isWeekend = [0, 6].includes(date.getDay()); // 0 is Sunday, 6 is Saturday
    
    return (
      <TouchableOpacity
        style={[
          styles.dateItem,
          isSelected && styles.selectedDateItem,
          isWeekend && styles.weekendDateItem
        ]}
        onPress={() => handleDateSelect(date)}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.dayText, 
          isSelected && styles.selectedDayText,
          isWeekend && !isSelected && styles.weekendDayText
        ]}>
          {format(date, 'EEE')}
        </Text>
        <Text style={[
          styles.dateText, 
          isSelected && styles.selectedDateText,
          isWeekend && !isSelected && styles.weekendDateText
        ]}>
          {format(date, 'd')}
        </Text>
        {/* Show month for the first date of each month */}
        {date.getDate() === 1 && (
          <Text style={[
            styles.monthText, 
            isSelected && styles.selectedMonthText,
            isWeekend && !isSelected && styles.weekendMonthText
          ]}>
            {format(date, 'MMM')}
          </Text>
        )}
      </TouchableOpacity>
    );
  };
  
  const renderDays = () => {
    return (
      <FlatList
        data={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
        renderItem={renderDateItem}
        keyExtractor={(item) => item.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.dateList}
      />
    );
  };
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0077b6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {step === 1 ? 'Select Specialty' : 
           step === 2 ? 'Select Doctor' : 
           step === 3 ? 'Select Date & Time' : 'Book Appointment'}
        </Text>
        <View style={{ width: 24 }} />
      </View>
      
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View 
            style={[
              styles.progressFill,
              { width: `${(step / 3) * 100}%` }
            ]} 
          />
        </View>
        <View style={styles.stepIndicators}>
          <View style={[styles.stepDot, step >= 1 && styles.activeStepDot]}>
            <Text style={[styles.stepNumber, step >= 1 && styles.activeStepNumber]}>1</Text>
          </View>
          <View style={[styles.stepDot, step >= 2 && styles.activeStepDot]}>
            <Text style={[styles.stepNumber, step >= 2 && styles.activeStepNumber]}>2</Text>
          </View>
          <View style={[styles.stepDot, step >= 3 && styles.activeStepDot]}>
            <Text style={[styles.stepNumber, step >= 3 && styles.activeStepNumber]}>3</Text>
          </View>
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        {step === 1 && (
          <Animated.View entering={FadeInDown.duration(400)}>
            <Text style={styles.sectionTitle}>Select a Specialty</Text>
            <Text style={styles.sectionSubtitle}>Choose the medical specialty you need</Text>
            
            <View style={styles.specialtiesGrid}>
              {SPECIALTIES.map((specialty) => (
                <Animated.View 
                  key={specialty.id} 
                  entering={FadeIn.delay(parseInt(specialty.id) * 100)}
                >
                  <TouchableOpacity
                    style={styles.specialtyCard}
                    onPress={() => handleSpecialtySelect(specialty)}
                  >
                    <View style={styles.specialtyIconContainer}>
                      <Ionicons name={specialty.icon} size={28} color="#0077b6" />
                    </View>
                    <Text style={styles.specialtyName}>{specialty.name}</Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        )}
        
        {step === 2 && (
          <Animated.View entering={FadeInDown.duration(400)}>
            <View style={styles.selectedItemContainer}>
              <Text style={styles.selectedItemLabel}>Selected Specialty:</Text>
              <View style={styles.selectedItem}>
                <Ionicons name={selectedSpecialty.icon} size={20} color="#0077b6" />
                <Text style={styles.selectedItemText}>{selectedSpecialty.name}</Text>
              </View>
            </View>
            
            <Text style={styles.sectionTitle}>Select a Doctor</Text>
            <Text style={styles.sectionSubtitle}>Choose from our specialists</Text>
            
            {/* Filter the doctors based on the selected specialty */}
            {(() => {
              const filteredDoctors = DOCTORS.filter(doctor => doctor.specialty === selectedSpecialty.name);
              
              if (filteredDoctors.length === 0) {
                return (
                  <Animated.View 
                    entering={FadeInDown.duration(400)}
                    style={styles.noDoctorsContainer}
                  >
                    <Ionicons name="medical-outline" size={60} color="#cbd5e1" />
                    <Text style={styles.noDoctorsText}>No doctors available for this specialty at the moment</Text>
                    <TouchableOpacity 
                      style={styles.goBackButton}
                      onPress={() => setStep(1)}
                    >
                      <Text style={styles.goBackButtonText}>Select Another Specialty</Text>
                    </TouchableOpacity>
                  </Animated.View>
                );
              }
              
              return filteredDoctors.map((doctor, index) => (
                <Animated.View 
                  key={doctor.id}
                  entering={FadeInDown.delay(index * 200).duration(400)}
                  style={animatedStyle}
                >
                  <TouchableOpacity
                    style={styles.doctorCard}
                    onPress={() => handleDoctorSelect(doctor)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.doctorInfo}>
                      <View style={styles.doctorImageContainer}>
                        <Ionicons name="person-circle" size={60} color="#0077b6" />
                      </View>
                      <View style={styles.doctorDetails}>
                        <Text style={styles.doctorName}>{doctor.name}</Text>
                        <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
                        <Text style={styles.doctorHospital}>{doctor.hospital}</Text>
                        <View style={styles.ratingContainer}>
                          <Ionicons name="star" size={16} color="#fbbf24" />
                          <Text style={styles.ratingText}>{doctor.rating}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ));
            })()}
          </Animated.View>
        )}
        
        {step === 3 && (
          <Animated.View entering={FadeInDown.duration(400)}>
            <View style={styles.selectedItemContainer}>
              <Text style={styles.selectedItemLabel}>Selected Doctor:</Text>
              <View style={styles.selectedItem}>
                <Ionicons name="person" size={20} color="#0077b6" />
                <Text style={styles.selectedItemText}>{selectedDoctor.name}</Text>
              </View>
            </View>
            
            <Text style={styles.sectionTitle}>Select Date</Text>
            {renderDays()}
            
            <Text style={styles.sectionTitle}>Select Time</Text>
            <View style={styles.timeGrid}>
              {TIME_SLOTS.map((time, index) => {
                // Deterministically make some time slots unavailable based on index
                // This is more predictable than random for testing purposes
                const isAvailable = index % 3 !== 0; // Every third slot is unavailable
                
                return (
                  <Animated.View
                    key={time}
                    entering={FadeIn.delay(index * 100)}
                  >
                    <TouchableOpacity
                      style={[
                        styles.timeSlot,
                        selectedTime === time && styles.selectedTimeSlot,
                        !isAvailable && styles.unavailableTimeSlot
                      ]}
                      onPress={() => isAvailable && handleTimeSelect(time)}
                      activeOpacity={isAvailable ? 0.7 : 1}
                      disabled={!isAvailable}
                    >
                      <Text 
                        style={[
                          styles.timeText,
                          selectedTime === time && styles.selectedTimeText,
                          !isAvailable && styles.unavailableTimeText
                        ]}
                      >
                        {time}
                      </Text>
                      {!isAvailable && (
                        <Text style={styles.unavailableLabel}>Unavailable</Text>
                      )}
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>
            
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Appointment Summary</Text>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Specialty:</Text>
                <Text style={styles.summaryValue}>{selectedSpecialty.name}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Doctor:</Text>
                <Text style={styles.summaryValue}>{selectedDoctor.name}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Hospital:</Text>
                <Text style={styles.summaryValue}>{selectedDoctor.hospital}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Date:</Text>
                <Text style={styles.summaryValue}>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</Text>
              </View>
              {selectedTime && (
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Time:</Text>
                  <Text style={styles.summaryValue}>{selectedTime}</Text>
                </View>
              )}
            </View>
            
            <TouchableOpacity
              style={[
                styles.bookButton,
                (!selectedTime) && styles.disabledButton
              ]}
              onPress={handleBooking}
              disabled={!selectedTime}
              activeOpacity={0.8}
            >
              <Ionicons 
                name="checkmark-circle" 
                size={20} 
                color="#ffffff" 
                style={styles.bookButtonIcon}
              />
              <Text style={styles.bookButtonText}>Confirm Booking</Text>
              {!selectedTime && (
                <Text style={styles.bookButtonHelperText}>
                  Please select a time slot
                </Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
      
      {/* Success Modal */}
      <Modal
        visible={successModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <Animated.View 
            style={styles.modalContent}
            entering={FadeInDown.springify().damping(12)}
          >
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark-circle" size={60} color="#10b981" />
            </View>
            <Text style={styles.modalTitle}>Appointment Booked!</Text>
            <Text style={styles.modalMessage}>
              Your appointment has been successfully scheduled. You will receive a confirmation email shortly.
            </Text>
            
            <Animated.View 
              style={styles.appointmentConfirmationCard}
              entering={FadeInDown.delay(300).duration(400)}
            >
              <View style={styles.appointmentConfirmHeader}>
                <Ionicons name="calendar-outline" size={20} color="#ffffff" />
                <Text style={styles.appointmentConfirmTitle}>Appointment Details</Text>
              </View>
              
              <View style={styles.appointmentConfirmBody}>
                <View style={styles.appointmentConfirmItem}>
                  <Ionicons name="person-outline" size={16} color="#0077b6" />
                  <Text style={styles.appointmentConfirmLabel}>Doctor:</Text>
                  <Text style={styles.appointmentConfirmValue}>
                    {selectedDoctor?.name || ""}
                  </Text>
                </View>
                
                <View style={styles.appointmentConfirmItem}>
                  <Ionicons name="medical-outline" size={16} color="#0077b6" />
                  <Text style={styles.appointmentConfirmLabel}>Specialty:</Text>
                  <Text style={styles.appointmentConfirmValue}>
                    {selectedSpecialty?.name || ""}
                  </Text>
                </View>
                
                <View style={styles.appointmentConfirmItem}>
                  <Ionicons name="time-outline" size={16} color="#0077b6" />
                  <Text style={styles.appointmentConfirmLabel}>Date & Time:</Text>
                  <Text style={styles.appointmentConfirmValue}>
                    {selectedDate ? format(selectedDate, 'MMM d, yyyy') : ""} at {selectedTime || ""}
                  </Text>
                </View>
                
                <View style={styles.appointmentConfirmItem}>
                  <Ionicons name="location-outline" size={16} color="#0077b6" />
                  <Text style={styles.appointmentConfirmLabel}>Location:</Text>
                  <Text style={styles.appointmentConfirmValue}>
                    {selectedDoctor?.hospital || ""}
                  </Text>
                </View>
              </View>
            </Animated.View>
            
            <Animated.View
              entering={FadeInDown.delay(600).duration(400)}
            >
              <Text style={styles.referenceNumberText}>
                Reference #: {Math.random().toString(36).substring(2, 10).toUpperCase()}
              </Text>
            </Animated.View>
          </Animated.View>
        </View>
      </Modal>
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  progressContainer: {
    paddingHorizontal: 30,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    marginBottom: 10,
  },
  progressFill: {
    height: 4,
    backgroundColor: '#0077b6',
    borderRadius: 2,
  },
  stepIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  stepDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeStepDot: {
    backgroundColor: '#0077b6',
  },
  stepNumber: {
    color: '#94a3b8',
    fontWeight: 'bold',
  },
  activeStepNumber: {
    color: '#ffffff',
  },
  content: {
    padding: 20,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
    marginTop: 15,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
  },
  specialtiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  specialtyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: getCardWidth(),
    margin: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  specialtyIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f9ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  specialtyName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
    width: '100%',
  },
  selectedItemContainer: {
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  selectedItemLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 5,
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0077b6',
    marginLeft: 8,
  },
  doctorCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  doctorInfo: {
    flexDirection: 'row',
  },
  doctorImageContainer: {
    marginRight: 15,
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 3,
  },
  doctorHospital: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 5,
  },
  dateList: {
    marginBottom: 20,
  },
  dateItem: {
    width: 60,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  selectedDateItem: {
    backgroundColor: '#0077b6',
  },
  dayText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  selectedDayText: {
    color: '#ffffff',
  },
  selectedDateText: {
    color: '#ffffff',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  timeSlot: {
    width: '48%',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  selectedTimeSlot: {
    backgroundColor: '#0077b6',
  },
  timeText: {
    fontSize: 14,
    color: '#1e293b',
  },
  selectedTimeText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  summaryContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 15,
  },
  summaryItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  summaryLabel: {
    width: 80,
    fontSize: 14,
    color: '#64748b',
  },
  summaryValue: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
  },
  bookButton: {
    backgroundColor: '#0077b6',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookButtonIcon: {
    marginRight: 8,
  },
  bookButtonHelperText: {
    position: 'absolute',
    bottom: -25,
    color: '#64748b',
    fontSize: 14,
    fontStyle: 'italic',
  },
  disabledButton: {
    backgroundColor: '#94a3b8',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    width: '90%',
    maxWidth: 350,
  },
  successIconContainer: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  appointmentConfirmationCard: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginVertical: 15,
  },
  appointmentConfirmHeader: {
    backgroundColor: '#0077b6',
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  appointmentConfirmTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  appointmentConfirmBody: {
    padding: 15,
    backgroundColor: '#f8fafc',
  },
  appointmentConfirmItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  appointmentConfirmLabel: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 8,
    marginRight: 5,
    width: 65,
  },
  appointmentConfirmValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
    flex: 1,
  },
  referenceNumberText: {
    fontSize: 14,
    color: '#0077b6',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 5,
  },
  noDoctorsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  noDoctorsText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginVertical: 15,
  },
  goBackButton: {
    backgroundColor: '#0077b6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  goBackButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  weekendDateItem: {
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  weekendDayText: {
    color: '#0077b6',
  },
  weekendDateText: {
    color: '#0077b6',
  },
  weekendMonthText: {
    color: '#0077b6',
  },
  monthText: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  selectedMonthText: {
    color: '#ffffff',
  },
  unavailableTimeSlot: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  unavailableTimeText: {
    color: '#94a3b8',
  },
  unavailableLabel: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 4,
    textAlign: 'center',
  }
});