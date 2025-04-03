import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Modal, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function MedicationScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeDays, setActiveDays] = useState({
    sun: true, mon: true, tue: true, wed: true, thu: true, fri: true, sat: true
  });
  
  // Demo medication data
  const medications = [
    {
      id: '1',
      name: 'Amlodipine',
      dosage: '5mg',
      schedule: 'Once daily',
      time: '8:00 AM',
      instructions: 'Take with water',
      remaining: 10,
      isActive: true
    },
    {
      id: '2',
      name: 'Metformin',
      dosage: '1000mg',
      schedule: 'Twice daily',
      time: '7:30 AM, 7:30 PM',
      instructions: 'Take with meals',
      remaining: 18,
      isActive: true
    },
    {
      id: '3',
      name: 'Insulin Glargine',
      dosage: '10 units',
      schedule: 'Once daily',
      time: '9:00 PM',
      instructions: 'Inject subcutaneously',
      remaining: 12,
      isActive: true
    },
    {
      id: '4',
      name: 'Losartan',
      dosage: '50mg',
      schedule: 'Once daily',
      time: '8:30 AM',
      instructions: 'Take with or without food',
      remaining: 9,
      isActive: true
    }
  ];

  // Function to toggle medication active status
  const toggleMedicationStatus = (id) => {
    // In a real app, this would update state or call an API
    console.log(`Toggling status for medication ${id}`);
  };

  // Function to toggle days in the add medication modal
  const toggleDay = (day) => {
    setActiveDays({
      ...activeDays,
      [day]: !activeDays[day]
    });
  };

  // Filter medications based on search text
  const filteredMedications = medications.filter(
    med => med.name.toLowerCase().includes(searchText.toLowerCase())
  );
  
  // Group medications by active status
  const activeMedications = filteredMedications.filter(med => med.isActive);
  const inactiveMedications = filteredMedications.filter(med => !med.isActive);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#0077b6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Medications</Text>
        <View style={{ width: 24 }} /> {/* Empty view for alignment */}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search medications..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Today's Medications Section */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Today's Medications</Text>
          
          {activeMedications.length > 0 ? (
            activeMedications.map(med => (
              <View key={med.id} style={styles.medicationCard}>
                <View style={styles.medicationHeader}>
                  <View style={styles.medNameContainer}>
                    <Text style={styles.medicationName}>{`${med.name} ${med.dosage}`}</Text>
                    <Text style={styles.medicationSchedule}>{med.schedule}</Text>
                  </View>
                  <Switch
                    trackColor={{ false: "#e2e8f0", true: "#bae6fd" }}
                    thumbColor={med.isActive ? "#0077b6" : "#f4f3f4"}
                    ios_backgroundColor="#e2e8f0"
                    onValueChange={() => toggleMedicationStatus(med.id)}
                    value={med.isActive}
                  />
                </View>
                
                <View style={styles.medicationDetails}>
                  <View style={styles.detailItem}>
                    <Ionicons name="time-outline" size={20} color="#64748b" />
                    <Text style={styles.detailText}>{med.time}</Text>
                  </View>
                  
                  <View style={styles.detailItem}>
                    <Ionicons name="information-circle-outline" size={20} color="#64748b" />
                    <Text style={styles.detailText}>{med.instructions}</Text>
                  </View>
                  
                  <View style={styles.detailItem}>
                    <Ionicons name="medical-outline" size={20} color="#64748b" />
                    <Text style={styles.detailText}>{med.remaining} remaining</Text>
                  </View>
                </View>
                
                <View style={styles.medicationActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="create-outline" size={18} color="#0077b6" />
                    <Text style={styles.actionText}>Edit</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="notifications-outline" size={18} color="#0077b6" />
                    <Text style={styles.actionText}>Remind</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>Mark as Taken</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="medical-outline" size={48} color="#cbd5e1" />
              <Text style={styles.emptyStateText}>No active medications</Text>
            </View>
          )}
        </View>

        {/* Inactive Medications Section */}
        {inactiveMedications.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Inactive Medications</Text>
            
            {inactiveMedications.map(med => (
              <View key={med.id} style={[styles.medicationCard, styles.inactiveCard]}>
                <View style={styles.medicationHeader}>
                  <View style={styles.medNameContainer}>
                    <Text style={styles.inactiveMedicationName}>{med.name} {med.dosage}</Text>
                    <Text style={styles.medicationSchedule}>{med.schedule}</Text>
                  </View>
                  <Switch
                    trackColor={{ false: "#e2e8f0", true: "#bae6fd" }}
                    thumbColor={med.isActive ? "#0077b6" : "#f4f3f4"}
                    ios_backgroundColor="#e2e8f0"
                    onValueChange={() => toggleMedicationStatus(med.id)}
                    value={med.isActive}
                  />
                </View>
                
                <View style={styles.medicationDetails}>
                  <View style={styles.detailItem}>
                    <Ionicons name="time-outline" size={20} color="#94a3b8" />
                    <Text style={[styles.detailText, styles.inactiveText]}>{med.time}</Text>
                  </View>
                  
                  <View style={styles.detailItem}>
                    <Ionicons name="information-circle-outline" size={20} color="#94a3b8" />
                    <Text style={[styles.detailText, styles.inactiveText]}>{med.instructions}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Add Medication Button */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Ionicons name="add-circle-outline" size={24} color="#ffffff" />
          <Text style={styles.addButtonText}>Add New Medication</Text>
        </TouchableOpacity>
        
        {/* Footer Space */}
        <View style={styles.footer} />
      </ScrollView>

      {/* Add Medication Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Medication</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollView}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Medication Name</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter medication name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Dosage</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g., 10mg, 500mg"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Schedule</Text>
                <View style={styles.scheduleContainer}>
                  <TouchableOpacity 
                    style={[styles.scheduleButton, { backgroundColor: '#e2f2ff' }]}
                  >
                    <Text style={[styles.scheduleButtonText, { color: '#0077b6' }]}>Once daily</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.scheduleButton}>
                    <Text style={styles.scheduleButtonText}>Twice daily</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.scheduleButton}>
                    <Text style={styles.scheduleButtonText}>As needed</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Time</Text>
                <TouchableOpacity style={styles.timeButton}>
                  <Ionicons name="time-outline" size={20} color="#0077b6" />
                  <Text style={styles.timeButtonText}>8:00 AM</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Days</Text>
                <View style={styles.daysContainer}>
                  {['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map((day) => (
                    <TouchableOpacity 
                      key={day}
                      style={[
                        styles.dayButton,
                        activeDays[day] && styles.activeDayButton
                      ]}
                      onPress={() => toggleDay(day)}
                    >
                      <Text 
                        style={[
                          styles.dayButtonText,
                          activeDays[day] && styles.activeDayText
                        ]}
                      >
                        {day.charAt(0).toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Instructions</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Special instructions (e.g., Take with food)"
                  multiline={true}
                  numberOfLines={4}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Quantity Remaining</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Number of pills/doses"
                  keyboardType="numeric"
                />
              </View>

              <TouchableOpacity 
                style={styles.saveButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.saveButtonText}>Save Medication</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
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
    paddingBottom: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: '#1e293b',
  },
  scrollView: {
    flex: 1,
  },
  sectionContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 15,
  },
  medicationCard: {
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
  inactiveCard: {
    opacity: 0.8,
  },
  medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  medNameContainer: {
    flex: 1,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  inactiveMedicationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#64748b',
  },
  medicationSchedule: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  medicationDetails: {
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  detailText: {
    fontSize: 14,
    color: '#1e293b',
    marginLeft: 10,
  },
  inactiveText: {
    color: '#94a3b8',
  },
  medicationActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  actionText: {
    fontSize: 14,
    color: '#0077b6',
    marginLeft: 5,
  },
  primaryButton: {
    backgroundColor: '#0077b6',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#ffffff',
    borderRadius: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 10,
  },
  addButton: {
    backgroundColor: '#0077b6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 8,
  },
  footer: {
    height: 40,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  modalScrollView: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  scheduleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  scheduleButton: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  scheduleButtonText: {
    fontSize: 14,
    color: '#64748b',
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
  },
  timeButtonText: {
    fontSize: 16,
    color: '#0077b6',
    marginLeft: 10,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDayButton: {
    backgroundColor: '#0077b6',
    borderColor: '#0077b6',
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  activeDayText: {
    color: '#ffffff',
  },
  saveButton: {
    backgroundColor: '#0077b6',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginVertical: 15,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});