import React, { useEffect, useRef } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay, 
  Easing,
  interpolate,
  Extrapolate,
  useAnimatedScrollHandler,
  withSpring
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { BarChart, LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');
const screenWidth = width - 40;

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// Mock data - replace with actual data from your API/database
const healthData = {
  bloodPressure: [
    { date: '1/3', systolic: 120, diastolic: 80 },
    { date: '2/3', systolic: 122, diastolic: 82 },
    { date: '3/3', systolic: 118, diastolic: 79 },
    { date: '4/3', systolic: 121, diastolic: 81 },
    { date: '5/3', systolic: 119, diastolic: 78 },
    { date: '6/3', systolic: 117, diastolic: 76 },
  ],
  bloodGlucose: [
    { date: '1/3', value: 110 },
    { date: '2/3', value: 126 },
    { date: '3/3', value: 118 },
    { date: '4/3', value: 105 },
    { date: '5/3', value: 132 },
    { date: '6/3', value: 121 },
  ],
  steps: [
    { date: '1/3', value: 8200 },
    { date: '2/3', value: 7500 },
    { date: '3/3', value: 9100 },
    { date: '4/3', value: 8600 },
    { date: '5/3', value: 10200 },
    { date: '6/3', value: 7800 },
  ],
  sleep: [
    { date: '1/3', value: 7.2 },
    { date: '2/3', value: 6.8 },
    { date: '3/3', value: 7.5 },
    { date: '4/3', value: 8.1 },
    { date: '5/3', value: 7.0 },
    { date: '6/3', value: 7.3 },
  ],
  medications: [
    { name: 'Lisinopril', adherence: 92 },
    { name: 'Metformin', adherence: 87 },
    { name: 'Vitamin D', adherence: 75 },
  ]
};

// Chart configuration
const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(0, 119, 182, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  decimalPlaces: 0,
  propsForLabels: {
    fontSize: 10,
  },
  labelOffset: 15,
  horizontalLabelRotation: 0,
  paddingLeft: 15,
  margin: {
    left: 10,
    right: 10,
  }
};

export default function ReportsScreen() {
  const router = useRouter();
  const scrollY = useSharedValue(0);
  const scrollRef = useRef(null);
  
  // Multiple animated values for staggered animations
  const fadeAnim = useSharedValue(0);
  const headerSlideAnim = useSharedValue(30);
  const summarySlideAnim = useSharedValue(50);
  const bloodPressureSlideAnim = useSharedValue(70);
  const weightSlideAnim = useSharedValue(90);
  const medicationSlideAnim = useSharedValue(110);
  const reportsSlideAnim = useSharedValue(130);
  
  // Scale animations for cards on interaction
  const cardScale = useSharedValue(1);
  
  useEffect(() => {
    // Main content fade in
    fadeAnim.value = withTiming(1, { duration: 800 });
    
    // Staggered slide-up animations
    headerSlideAnim.value = withTiming(0, { 
      duration: 700, 
      easing: Easing.out(Easing.quad) 
    });
    
    summarySlideAnim.value = withDelay(
      100, 
      withTiming(0, { 
        duration: 700, 
        easing: Easing.out(Easing.quad) 
      })
    );
    
    bloodPressureSlideAnim.value = withDelay(
      200, 
      withTiming(0, { 
        duration: 700, 
        easing: Easing.out(Easing.quad) 
      })
    );
    
    weightSlideAnim.value = withDelay(
      300, 
      withTiming(0, { 
        duration: 700, 
        easing: Easing.out(Easing.quad) 
      })
    );
    
    medicationSlideAnim.value = withDelay(
      400, 
      withTiming(0, { 
        duration: 700, 
        easing: Easing.out(Easing.quad) 
      })
    );
    
    reportsSlideAnim.value = withDelay(
      500, 
      withTiming(0, { 
        duration: 700, 
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
  
  // Animated styles for sections - removed the scroll-based translation for fixed header
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [
        { translateY: headerSlideAnim.value }
      ],
    };
  });
  
  const summaryAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ translateY: summarySlideAnim.value }],
    };
  });
  
  const bloodPressureAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ translateY: bloodPressureSlideAnim.value }],
    };
  });
  
  const weightAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ translateY: weightSlideAnim.value }],
    };
  });
  
  const medicationAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ translateY: medicationSlideAnim.value }],
    };
  });
  
  const reportsAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ translateY: reportsSlideAnim.value }],
    };
  });
  
  // Card press animation
  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: cardScale.value }]
    };
  });

  const pressCard = () => {
    cardScale.value = withSpring(0.95, { damping: 10 });
    setTimeout(() => {
      cardScale.value = withSpring(1);
    }, 150);
  };

  const navigateTo = (screen) => {
    pressCard();
    setTimeout(() => {
      router.push(screen);
    }, 150);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#f0f9ff', '#ffffff']}
        style={styles.background}
      />
      
      {/* Fixed Header - Now using a non-animated View for stability */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={28} color="#0077b6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Health Reports</Text>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => navigateTo('/settings')}
        >
          <Ionicons name="settings-outline" size={24} color="#0077b6" />
        </TouchableOpacity>
      </View>
      
      {/* Main Content */}
      <Animated.ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        ref={scrollRef}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Health Summary Section */}
        <Animated.View style={[styles.sectionContainer, summaryAnimatedStyle]}>
          <Text style={styles.sectionTitle}>Health Summary</Text>
          
          <View style={styles.summaryGrid}>
            <AnimatedTouchableOpacity 
              style={[styles.summaryCard, cardAnimatedStyle]}
              onPressIn={pressCard}
              activeOpacity={0.8}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#e74c3c' }]}>
                <Ionicons name="heart" size={24} color="#ffffff" />
              </View>
              <Text style={styles.summaryValue}>120/80</Text>
              <Text style={styles.summaryLabel}>Blood Pressure</Text>
            </AnimatedTouchableOpacity>
            
            <AnimatedTouchableOpacity 
              style={[styles.summaryCard, cardAnimatedStyle]}
              onPressIn={pressCard}
              activeOpacity={0.8}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#f59e0b' }]}>
                <Ionicons name="water" size={24} color="#ffffff" />
              </View>
              <Text style={styles.summaryValue}>121 mg/dL</Text>
              <Text style={styles.summaryLabel}>Blood Glucose</Text>
            </AnimatedTouchableOpacity>
            
            <AnimatedTouchableOpacity 
              style={[styles.summaryCard, cardAnimatedStyle]}
              onPressIn={pressCard}
              activeOpacity={0.8}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#2ecc71' }]}>
                <Ionicons name="footsteps" size={24} color="#ffffff" />
              </View>
              <Text style={styles.summaryValue}>8,233</Text>
              <Text style={styles.summaryLabel}>Avg. Steps</Text>
            </AnimatedTouchableOpacity>
            
            <AnimatedTouchableOpacity 
              style={[styles.summaryCard, cardAnimatedStyle]}
              onPressIn={pressCard}
              activeOpacity={0.8}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#9b59b6' }]}>
                <Ionicons name="moon" size={24} color="#ffffff" />
              </View>
              <Text style={styles.summaryValue}>7.3 hrs</Text>
              <Text style={styles.summaryLabel}>Avg. Sleep</Text>
            </AnimatedTouchableOpacity>
          </View>
        </Animated.View>
        
        {/* Blood Glucose Chart Section */}
        <Animated.View style={[styles.sectionContainer, weightAnimatedStyle]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Blood Glucose</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <AnimatedTouchableOpacity 
            style={[styles.chartCard, cardAnimatedStyle]}
            onPressIn={pressCard}
            activeOpacity={0.8}
          >
            <Text style={styles.chartSubtitle}>Last 7 Days</Text>
            <LineChart
              data={{
                labels: healthData.bloodGlucose.map(item => item.date),
                datasets: [
                  {
                    data: healthData.bloodGlucose.map(item => item.value),
                    color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`,
                    strokeWidth: 2
                  }
                ]
              }}
              width={screenWidth - 50}
              height={220}
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`,
                formatYLabel: (value) => Math.round(value).toString(),
              }}
              bezier
              style={styles.chart}
              yAxisSuffix=" mg/dL"
              yAxisInterval={1}
              withInnerLines={true}
              fromZero={false}
              yAxisWidth={60}
            />
            
            <View style={styles.glucoseRanges}>
              <View style={styles.rangeIndicator}>
                <View style={[styles.rangeLine, { backgroundColor: '#22c55e' }]} />
                <Text style={styles.rangeText}>Normal: 70-99 mg/dL</Text>
              </View>
              <View style={styles.rangeIndicator}>
                <View style={[styles.rangeLine, { backgroundColor: '#f59e0b' }]} />
                <Text style={styles.rangeText}>Pre-Diabetes: 100-125 mg/dL</Text>
              </View>
              <View style={styles.rangeIndicator}>
                <View style={[styles.rangeLine, { backgroundColor: '#ef4444' }]} />
                <Text style={styles.rangeText}>Diabetes: 126+ mg/dL</Text>
              </View>
            </View>
            
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Average</Text>
                <Text style={styles.statValue}>118 mg/dL</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Highest</Text>
                <Text style={styles.statValue}>132 mg/dL</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Status</Text>
                <Text style={[styles.statValue, { color: '#f59e0b' }]}>Pre-Diabetic</Text>
              </View>
            </View>
          </AnimatedTouchableOpacity>
        </Animated.View>
        
        {/* Blood Pressure Chart Section */}
        <Animated.View style={[styles.sectionContainer, bloodPressureAnimatedStyle]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Blood Pressure</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <AnimatedTouchableOpacity 
            style={[styles.chartCard, cardAnimatedStyle]}
            onPressIn={pressCard}
            activeOpacity={0.8}
          >
            <Text style={styles.chartSubtitle}>Last 7 Days</Text>
            <LineChart
              data={{
                labels: healthData.bloodPressure.map(item => item.date),
                datasets: [
                  {
                    data: healthData.bloodPressure.map(item => item.systolic),
                    color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
                    strokeWidth: 2
                  },
                  {
                    data: healthData.bloodPressure.map(item => item.diastolic),
                    color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
                    strokeWidth: 2
                  }
                ],
                legend: ['Systolic', 'Diastolic']
              }}
              width={screenWidth - 30}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
            
            <View style={styles.chartInfoRow}>
              <View style={styles.chartInfo}>
                <View style={[styles.infoIndicator, { backgroundColor: '#e74c3c' }]} />
                <Text style={styles.infoText}>Systolic</Text>
              </View>
              
              <View style={styles.chartInfo}>
                <View style={[styles.infoIndicator, { backgroundColor: '#3498db' }]} />
                <Text style={styles.infoText}>Diastolic</Text>
              </View>
            </View>
          </AnimatedTouchableOpacity>
        </Animated.View>
        
        {/* Medication Adherence Section */}
        <Animated.View style={[styles.sectionContainer, medicationAnimatedStyle]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Medication Adherence</Text>
            <TouchableOpacity onPress={() => navigateTo('/medication')}>
              <Text style={styles.seeAllText}>Manage</Text>
            </TouchableOpacity>
          </View>
          
          <AnimatedTouchableOpacity 
            style={[styles.chartCard, cardAnimatedStyle]}
            onPressIn={pressCard}
            activeOpacity={0.8}
          >
            <Text style={styles.chartSubtitle}>Current Month</Text>
            <BarChart
              data={{
                labels: healthData.medications.map(item => item.name),
                datasets: [
                  {
                    data: healthData.medications.map(item => item.adherence),
                    // Higher contrast, darker blue color for better visibility
                    color: (opacity = 1) => `rgba(0, 84, 147, ${opacity})`
                  }
                ]
              }}
              width={screenWidth}
              height={220}
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(0, 84, 147, ${opacity})`,
                // Increase text size for better readability
                propsForLabels: {
                  fontSize: 12,
                  fontWeight: 'bold',
                },
                // Use darker colors for the grid lines
                strokeWidth: 2,
                decimalPlaces: 0, // Remove decimal places for cleaner numbers
              }}
              style={styles.chart}
              yAxisSuffix="%"
              // Make bars thicker for better visibility
              barPercentage={0.7}
              // Increase width of Y-axis display
              yAxisWidth={50}
            />
            
            <View style={styles.adherenceInfo}>
              <Text style={styles.adherenceText}>
                <Text style={styles.adherenceBold}>Overall adherence: </Text>
                <Text style={styles.adherenceValue}>84.7%</Text>
              </Text>
              <TouchableOpacity style={styles.reminderButton}>
                <Ionicons name="notifications-outline" size={16} color="#0077b6" />
                <Text style={styles.reminderText}>Set Reminders</Text>
              </TouchableOpacity>
            </View>
          </AnimatedTouchableOpacity>
        </Animated.View>
        
        {/* Detailed Reports Section */}
        <Animated.View style={[styles.sectionContainer, reportsAnimatedStyle]}>
          <Text style={styles.sectionTitle}>Health Reports</Text>
          
          <AnimatedTouchableOpacity 
            style={[styles.reportCard, cardAnimatedStyle]}
            onPressIn={pressCard}
            activeOpacity={0.8}
          >
            <Ionicons name="document-text" size={24} color="#0077b6" />
            <View style={styles.reportInfo}>
              <Text style={styles.reportTitle}>Monthly Health Summary</Text>
              <Text style={styles.reportDate}>March 2025</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </AnimatedTouchableOpacity>
          
          <AnimatedTouchableOpacity 
            style={[styles.reportCard, cardAnimatedStyle]}
            onPressIn={pressCard}
            activeOpacity={0.8}
          >
            <Ionicons name="document-text" size={24} color="#0077b6" />
            <View style={styles.reportInfo}>
              <Text style={styles.reportTitle}>Blood Work Results</Text>
              <Text style={styles.reportDate}>February 15, 2025</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </AnimatedTouchableOpacity>
          
          <AnimatedTouchableOpacity 
            style={[styles.reportCard, cardAnimatedStyle]}
            onPressIn={pressCard}
            activeOpacity={0.8}
          >
            <Ionicons name="document-text" size={24} color="#0077b6" />
            <View style={styles.reportInfo}>
              <Text style={styles.reportTitle}>Annual Physical Report</Text>
              <Text style={styles.reportDate}>January 10, 2025</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </AnimatedTouchableOpacity>
          
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All Reports</Text>
          </TouchableOpacity>
        </Animated.View>
        
        {/* Spacer for bottom padding */}
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
    paddingTop: 60, // Increased to match profile.tsx
    paddingBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Semi-transparent background
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, // Slightly increased shadow
    shadowRadius: 8, // Increased shadow radius
    elevation: 4, // Increased elevation
    zIndex: 10,
    position: 'absolute', // Make the header fixed
    top: 0,
    left: 0,
    right: 0,
    borderBottomWidth: 1, // Add a subtle border
    borderBottomColor: '#f1f5f9', // Light border color
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  settingsButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: 120, // Increased padding to ensure content starts well below the fixed header
    paddingHorizontal: 20,
  },
  sectionContainer: {
    marginBottom: 20,
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
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    width: (width - 50) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0077b6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 10,
  },
  chart: {
    marginVertical: 10,
    borderRadius: 8,
  },
  chartInfoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  chartInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  infoIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#64748b',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  positiveChange: {
    color: '#22c55e',
  },
  glucoseRanges: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  rangeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rangeLine: {
    width: 16,
    height: 4,
    borderRadius: 2,
    marginRight: 8,
  },
  rangeText: {
    fontSize: 14,
    color: '#64748b',
  },
  adherenceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  adherenceText: {
    fontSize: 14,
    color: '#64748b',
  },
  adherenceBold: {
    fontWeight: 'bold',
    color: '#1e293b',
  },
  adherenceValue: {
    color: '#22c55e',
    fontWeight: 'bold',
  },
  reminderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e2f2ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  reminderText: {
    color: '#0077b6',
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 5,
  },
  reportCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  reportInfo: {
    flex: 1,
    marginLeft: 12,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  reportDate: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  viewAllButton: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  viewAllText: {
    color: '#64748b',
    fontWeight: '600',
    fontSize: 14,
  },
  footer: {
    height: 30,
  },
});