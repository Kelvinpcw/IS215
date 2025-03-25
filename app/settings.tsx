import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Switch,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function Settings() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: () => {
            // Logout logic would go here
            router.replace('/');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0077b6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.content}>
        {/* Account Section */}
        <Animated.View 
          style={styles.section}
          entering={FadeInDown.duration(400).delay(100)}
        >
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="person-outline" size={24} color="#0077b6" />
              <Text style={styles.menuItemText}>Personal Information</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="lock-closed-outline" size={24} color="#0077b6" />
              <Text style={styles.menuItemText}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="shield-checkmark-outline" size={24} color="#0077b6" />
              <Text style={styles.menuItemText}>Privacy & Security</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>
        </Animated.View>
        
        {/* Preferences Section */}
        <Animated.View 
          style={styles.section}
          entering={FadeInDown.duration(400).delay(200)}
        >
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="notifications-outline" size={24} color="#0077b6" />
              <Text style={styles.menuItemText}>Notifications</Text>
            </View>
            <Switch 
              value={true}
              trackColor={{ false: '#e2e8f0', true: '#bae6fd' }}
              thumbColor={true ? '#0077b6' : '#f1f5f9'}
              ios_backgroundColor="#e2e8f0"
            />
          </View>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="globe-outline" size={24} color="#0077b6" />
              <Text style={styles.menuItemText}>Language</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuItemRightText}>English</Text>
              <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
            </View>
          </TouchableOpacity>
          
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="moon-outline" size={24} color="#0077b6" />
              <Text style={styles.menuItemText}>Dark Mode</Text>
            </View>
            <Switch 
              value={false}
              trackColor={{ false: '#e2e8f0', true: '#bae6fd' }}
              thumbColor={false ? '#0077b6' : '#f1f5f9'}
              ios_backgroundColor="#e2e8f0"
            />
          </View>
        </Animated.View>
        
        {/* Health Assistant Section */}
        <Animated.View 
          style={styles.section}
          entering={FadeInDown.duration(400).delay(300)}
        >
          <Text style={styles.sectionTitle}>Health Assistant</Text>
          
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="save-outline" size={24} color="#0077b6" />
              <Text style={styles.menuItemText}>Save Chat History</Text>
            </View>
            <Switch 
              value={true}
              trackColor={{ false: '#e2e8f0', true: '#bae6fd' }}
              thumbColor={true ? '#0077b6' : '#f1f5f9'}
              ios_backgroundColor="#e2e8f0"
            />
          </View>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="chatbubble-ellipses-outline" size={24} color="#0077b6" />
              <Text style={styles.menuItemText}>Chat Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>
        </Animated.View>
        
        {/* Support Section */}
        <Animated.View 
          style={styles.section}
          entering={FadeInDown.duration(400).delay(400)}
        >
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="help-circle-outline" size={24} color="#0077b6" />
              <Text style={styles.menuItemText}>Help Center</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="document-text-outline" size={24} color="#0077b6" />
              <Text style={styles.menuItemText}>Terms & Conditions</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="information-circle-outline" size={24} color="#0077b6" />
              <Text style={styles.menuItemText}>About</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>
        </Animated.View>
        
        {/* Logout Button */}
        <Animated.View entering={FadeInDown.duration(400).delay(500)}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>SingHealth v1.0.0</Text>
        </View>
        
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
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    padding: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#1e293b',
    marginLeft: 15,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemRightText: {
    fontSize: 16,
    color: '#64748b',
    marginRight: 5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
    marginLeft: 10,
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  versionText: {
    fontSize: 14,
    color: '#94a3b8',
  },
  footer: {
    height: 40,
  },
});