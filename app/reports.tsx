// Please install 
// npm install react-native-svg
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Svg, { Line, Text as SvgText } from 'react-native-svg';

const { width, height } = Dimensions.get('window');  // Get the screen width and height

export default function SettingsScreen() {
  // Sample data for blood sugar levels over time (in mg/dL)
  const bloodSugarData = [
    { time: '8:00 AM', level: 90 },
    { time: '10:00 AM', level: 110 },
    { time: '12:00 PM', level: 140 },
    { time: '2:00 PM', level: 160 },
    { time: '4:00 PM', level: 180 },
    { time: '6:00 PM', level: 130 },
    { time: '8:00 PM', level: 100 },
  ];

  // High and Low thresholds for blood sugar levels (in mg/dL)
  const highThreshold = 150;
  const lowThreshold = 100;

  // Filter states
  const [showHigh, setShowHigh] = useState(true);
  const [showLow, setShowLow] = useState(true);
  const [showNormal, setShowNormal] = useState(true);

  // Filter data based on the selected options
  const filteredData = bloodSugarData.filter((data) => {
    if (showHigh && data.level > highThreshold) return true;
    if (showLow && data.level < lowThreshold) return true;
    if (showNormal && data.level >= lowThreshold && data.level <= highThreshold) return true;
    return false;
  });

  // Prepare the SVG path for blood sugar data visualization
  const pathData = filteredData
    .map((data, index) => `${index === 0 ? 'M' : 'L'} ${index * (width / filteredData.length)} ${height - data.level - 50}`)
    .join(' ');

  // Function to get health status based on blood sugar level
  const getHealthStatus = (level) => {
    if (level > highThreshold) {
      return 'High';
    } else if (level < lowThreshold) {
      return 'Low';
    } else {
      return 'Normal';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Blood Sugar Levels</Text>

      {/* Health Status Title */}
      <Text style={styles.statusTitle}>Health Status</Text>
      <View style={styles.statusContainer}>
        {bloodSugarData.map((data, index) => (
          <Text key={index} style={styles.statusText}>
            {data.time}: {data.level} mg/dL - {getHealthStatus(data.level)}
          </Text>
        ))}
      </View>

      {/* Filters for data */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, showHigh && styles.activeButton]}
          onPress={() => setShowHigh(!showHigh)}
        >
          <Text style={styles.filterText}>Show High</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, showLow && styles.activeButton]}
          onPress={() => setShowLow(!showLow)}
        >
          <Text style={styles.filterText}>Show Low</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, showNormal && styles.activeButton]}
          onPress={() => setShowNormal(!showNormal)}
        >
          <Text style={styles.filterText}>Show Normal</Text>
        </TouchableOpacity>
      </View>

      {/* SVG chart to visualize the blood sugar levels */}
      <ScrollView horizontal>
        <Svg width={width} height={250}>
          <Line
            x1="0"
            y1="50"
            x2={width}
            y2="50"
            stroke="gray"
            strokeWidth="1"
          />
          <Line
            x1="0"
            y1={height - 50}
            x2={width}
            y2={height - 50}
            stroke="gray"
            strokeWidth="1"
          />
          <Line
            x1="0"
            y1={height - 150}
            x2={width}
            y2={height - 150}
            stroke="blue"
            strokeWidth="1"
            strokeDasharray="5,5"
          />
          <Line
            x1="0"
            y1={height - 100}
            x2={width}
            y2={height - 100}
            stroke="red"
            strokeWidth="1"
            strokeDasharray="5,5"
          />
          
          {/* Blood sugar levels visualization */}
          <Line
            d={pathData}
            fill="none"
            stroke="black"
            strokeWidth="2"
          />

          {/* High threshold line */}
          <Line
            x1="0"
            y1={height - 150}
            x2={width}
            y2={height - 150}
            stroke="red"
            strokeWidth="1"
            strokeDasharray="5,5"
          />
          {/* Low threshold line */}
          <Line
            x1="0"
            y1={height - 100}
            x2={width}
            y2={height - 100}
            stroke="blue"
            strokeWidth="1"
            strokeDasharray="5,5"
          />

          {/* X-Axis Text */}
          {filteredData.map((data, index) => (
            <SvgText
              key={index}
              x={index * (width / filteredData.length) + 10}
              y={height - 30}
              fontSize="12"
              fontWeight="bold"
            >
              {data.time}
            </SvgText>
          ))}

          {/* Y-Axis Text */}
          <SvgText x="10" y={50} fontSize="14" fontWeight="bold">
            180
          </SvgText>
          <SvgText x="10" y={height - 100} fontSize="14" fontWeight="bold">
            100
          </SvgText>
        </Svg>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  statusContainer: {
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    marginVertical: 5,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  filterButton: {
    padding: 10,
    margin: 5,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: '#4CAF50',
  },
  filterText: {
    fontSize: 14,
    color: 'white',
  },
});
