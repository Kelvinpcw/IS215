// _layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Platform, StyleSheet } from 'react-native';

export default function AppLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#0077b6',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: 'Appointment',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="health"
        options={{
          title: 'Health Assistant',
          tabBarLabel: ({ focused }) => (
            <View style={{ height: 0 }}></View>
          ),
          tabBarIcon: ({ focused }) => (
            <View style={styles.healthButtonContainer}>
              <View style={styles.healthButton}>
                <Ionicons name="medkit" size={24} color="#ffffff" />
              </View>
              <View style={styles.labelContainer}>
                <Ionicons name="medkit" size={0} />
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="medication"
        options={{
          title: 'Medicine',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="medical" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      {/* Hide these screens from tab bar but keep them accessible via routes */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
          href: null, // This makes the tab not directly accessible from tab bar
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reports',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text" size={size} color={color} />
          ),
          href: null, // This makes the tab not directly accessible from tab bar
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  healthButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -36, // Reduced from -42 to -36
  },
  healthButton: {
    backgroundColor: '#0077b6',
    width: 50, // Reduced from 56
    height: 50, // Reduced from 56
    borderRadius: 25, // Adjusted for new size
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  labelContainer: {
    marginTop: 4,
  }
});