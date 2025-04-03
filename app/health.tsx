import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
  Alert,
  Animated as RNAnimated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  FadeInUp,
  SlideInRight,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import axios from 'axios';

// Define message types
const MESSAGE_TYPES = {
  USER: 'user',
  BOT: 'bot',
  OPTION: 'option'
};

// Define assessment outcome options
const ASSESSMENT_OUTCOMES = {
  SELF_MANAGE: 'self-manage',
  GP_VISIT: 'gp-visit',
  EMERGENCY: 'emergency'
};

// User profile information (fixed for this example)
const USER_PROFILE = {
  age: 72,
  gender: 'Female',
  allergies: [
    'Penicillin (causes rash and swelling)',
    'Peanuts (causes difficulty breathing)',
    'Aspirin (causes stomach bleeding and dizziness)'
  ],
  medicalHistory: [
    'Type 2 diabetes diagnosed 10 years ago, managed with insulin',
    'Hypertension for 15 years, controlled with medication',
    'Mild stroke 3 years ago, undergoing regular check-ups',
    'Mild kidney disease diagnosed last year, monitored closely'
  ]
};

// Initial welcome message
const welcomeMessage = {
  id: 'welcome',
  text: 'Hello! I\'m your SingHealth assistant. I can provide a preliminary assessment of your symptoms. Your profile information has been loaded. How can I help you today?',
  type: MESSAGE_TYPES.BOT,
  timestamp: new Date()
};

export default function Health() {
  const router = useRouter();
  const [messages, setMessages] = useState([welcomeMessage]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [assessmentOutcome, setAssessmentOutcome] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  
  // Voice input state
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingTimer = useRef(null);
  
  // Animation refs and values
  const scrollViewRef = useRef(null);
  const inputHeight = useSharedValue(50);
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  const micScale = useSharedValue(1);
  
  useEffect(() => {
    RNAnimated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [messages]);
  
  // Timer for recording animation
  useEffect(() => {
    if (isRecording) {
      recordingTimer.current = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
        setRecordingTime(0);
      }
    }
    
    return () => {
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
      }
    };
  }, [isRecording]);

  const handleInputChange = (text) => {
    setInputText(text);
  };

  // Format user profile for the API request
  const formatUserProfile = () => {
    return `**Age:** ${USER_PROFILE.age} years old
**Gender:** ${USER_PROFILE.gender}
**Allergies:**
${USER_PROFILE.allergies.map(allergy => `* ${allergy}`).join('\n')}
**Medical History:**
${USER_PROFILE.medicalHistory.map(history => `* ${history}`).join('\n')}`;
  };

  const sendMessage = async () => {
    if (inputText.trim() === '') return;
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      type: MESSAGE_TYPES.USER,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    Keyboard.dismiss();
    setIsLoading(true);
    
    try {
      // Here you would integrate with ChatGPT API
      await simulateChatGptResponse(userMessage.text);
    } catch (error) {
      console.error('Error in chat:', error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          text: 'Sorry, I encountered an error. Please try again later.',
          type: MESSAGE_TYPES.BOT,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // This function simulates the integration with ChatGPT API
  const simulateChatGptResponse = async (userInput) => {
    const apiKey = 'YOUR_CHAT_GPT_API_KEY'; // Replace with your actual API key
    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    // Combine user profile with their input
    const profileInfo = formatUserProfile();
    const combinedInput = `${profileInfo}\n\nSymptoms described by patient: ${userInput}`;

    try {
      const response = await axios.post(
        apiUrl,
        {
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: `
              You are a knowledgeable health information assistant trained to provide evidence-based health information and general guidance. While you can offer educational content about health conditions and wellness practices, you:
                1. Aim to provide accurate and helpful information/basic diagnosis, you are not a licensed medical professional.
                2. Will always recommend consulting qualified healthcare providers for specific medical concerns
                3. Will consider provided details like age, gender, symptoms, medical history, and allergies when discussing health topics
                4. Will acknowledge limitations and uncertainties in medical knowledge
                5. Will prioritize patient safety by emphasizing when immediate medical attention might be necessary
                6. Will provide balanced information about treatment options without recommending specific medications or dosages
                7. Will use clear, accessible language and avoid unnecessary medical jargon
                8. Will provide contextual information about prevention, risk factors, and general health maintenance
                9. Will cite reputable health organizations when appropriate
              ` },
            { role: 'user', content: combinedInput },
          ],
          max_tokens: 1000,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const chatGptResponse = response.data.choices[0].message.content;

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: chatGptResponse,
          type: MESSAGE_TYPES.BOT,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error('Error calling ChatGPT API:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: 'Sorry, I encountered an error while processing your request. Please try again later.',
          type: MESSAGE_TYPES.BOT,
          timestamp: new Date(),
        },
      ]);
    }
  };

  // Toggle between voice and keyboard input modes
  const toggleInputMode = () => {
    setIsVoiceMode(!isVoiceMode);
    if (isRecording) {
      stopRecording();
    }
  };
  
  // Toggle profile information display
  const toggleProfileDisplay = () => {
    setShowProfile(!showProfile);
  };
  
  // Start voice recording (mock)
  const startRecording = () => {
    setIsRecording(true);
    // Visual feedback animation
    micScale.value = withSequence(
      withTiming(1.2, { duration: 300 }),
      withTiming(1, { duration: 300 })
    );
  };
  
  // Stop voice recording and process input (mock)
  const stopRecording = () => {
    setIsRecording(false);
    
    // Mock sending a voice transcription after recording stops
    if (recordingTime > 0) {
      setTimeout(() => {
        const mockTranscription = "I accidentally missed my insulin dose last night. What should I do now?";
        setInputText(mockTranscription);
        
        // Auto-send after a short delay
        setTimeout(() => {
          const userMessage = {
            id: Date.now().toString(),
            text: mockTranscription,
            type: MESSAGE_TYPES.USER,
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, userMessage]);
          setInputText('');
          setIsLoading(true);
          
          // Process the transcription with the chat API
          simulateChatGptResponse(mockTranscription).finally(() => {
            setIsLoading(false);
          });
        }, 500);
      }, 1000);
    }
  };

  const handleOptionSelect = (option) => {
    switch (option) {
      case 'book':
        router.push('/appointments');
        break;
      case 'restart':
        resetAssessment();
        break;
      default:
        break;
    }
  };
  
  const resetAssessment = () => {
    setMessages([welcomeMessage]);
    setAssessmentCompleted(false);
    setAssessmentOutcome(null);
  };
  
  const renderAssessmentOutcome = () => {
    if (!assessmentOutcome) return null;
    
    let title, description, icon, color;
    
    switch (assessmentOutcome) {
      case ASSESSMENT_OUTCOMES.SELF_MANAGE:
        title = "Self-management Recommended";
        description = "Based on your symptoms, you can manage this condition at home with rest and over-the-counter remedies if needed.";
        icon = "home-outline";
        color = "#10b981"; // green
        break;
      case ASSESSMENT_OUTCOMES.GP_VISIT:
        title = "GP Visit Recommended";
        description = "Your symptoms suggest you should visit a general practitioner within the next 1-2 days.";
        icon = "medical-outline";
        color = "#f59e0b"; // amber
        break;
      case ASSESSMENT_OUTCOMES.EMERGENCY:
        title = "Emergency Care Needed";
        description = "Your symptoms require immediate medical attention. Please go to the emergency department or call 995.";
        icon = "alert-circle-outline";
        color = "#ef4444"; // red
        break;
      default:
        return null;
    }
    
    return (
      <Animated.View 
        style={styles.outcomeContainer}
        entering={FadeInUp.duration(400)}
      >
        <View style={[styles.outcomeIconContainer, { backgroundColor: color }]}>
          <Ionicons name={icon} size={28} color="white" />
        </View>
        <Text style={styles.outcomeTitle}>{title}</Text>
        <Text style={styles.outcomeDescription}>{description}</Text>
        
        <View style={styles.outcomeActions}>
          {assessmentOutcome === ASSESSMENT_OUTCOMES.GP_VISIT && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleOptionSelect('book')}
            >
              <Text style={styles.actionButtonText}>Book Appointment</Text>
            </TouchableOpacity>
          )}
          
          {assessmentOutcome === ASSESSMENT_OUTCOMES.EMERGENCY && (
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: '#ef4444' }]}
              onPress={() => {
                Alert.alert(
                  "Emergency Contact",
                  "Call 995 for emergency services?",
                  [
                    { text: "Cancel", style: "cancel" },
                    { text: "Call", onPress: () => console.log("Would dial 995 here") }
                  ]
                );
              }}
            >
              <Text style={styles.actionButtonText}>Call 995</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1' }]}
            onPress={() => handleOptionSelect('restart')}
          >
            <Text style={[styles.actionButtonText, { color: '#1e293b' }]}>Start New Assessment</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  // Render user profile information card
  const renderProfileInfo = () => {
    if (!showProfile) return null;
    
    return (
      <Animated.View 
        style={styles.profileCard}
        entering={FadeInUp.duration(300)}
        exiting={FadeOut.duration(200)}
      >
        <View style={styles.profileHeader}>
          <Text style={styles.profileTitle}>Your Health Profile</Text>
          <TouchableOpacity onPress={toggleProfileDisplay}>
            <Ionicons name="close" size={22} color="#64748b" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.profileSection}>
          <Text style={styles.profileSectionTitle}>Age</Text>
          <Text style={styles.profileText}>{USER_PROFILE.age} years old</Text>
        </View>
        
        <View style={styles.profileSection}>
          <Text style={styles.profileSectionTitle}>Gender</Text>
          <Text style={styles.profileText}>{USER_PROFILE.gender}</Text>
        </View>
        
        <View style={styles.profileSection}>
          <Text style={styles.profileSectionTitle}>Allergies</Text>
          {USER_PROFILE.allergies.map((allergy, index) => (
            <Text key={`allergy-${index}`} style={styles.profileListItem}>• {allergy}</Text>
          ))}
        </View>
        
        <View style={styles.profileSection}>
          <Text style={styles.profileSectionTitle}>Medical History</Text>
          {USER_PROFILE.medicalHistory.map((history, index) => (
            <Text key={`history-${index}`} style={styles.profileListItem}>• {history}</Text>
          ))}
        </View>
        
        <Text style={styles.profileNote}>
          This information is included automatically with each of your symptom descriptions.
        </Text>
      </Animated.View>
    );
  };

  const renderMessage = (message, index) => {
    if (message.type === MESSAGE_TYPES.OPTION) {
      return (
        <Animated.View 
          key={message.id}
          style={styles.optionsContainer}
          entering={SlideInRight.delay(200).duration(400)}
        >
          {renderAssessmentOutcome()}
        </Animated.View>
      );
    }
    
    const isUser = message.type === MESSAGE_TYPES.USER;
    
    return (
      <Animated.View 
        key={message.id}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.botMessageContainer
        ]}
        entering={SlideInRight.duration(300)}
      >
        <View style={[
          styles.messageBubble,
          isUser ? styles.userMessageBubble : styles.botMessageBubble
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.botMessageText
          ]}>
            {message.text}
          </Text>
        </View>
      </Animated.View>
    );
  };

  // Animated style for the microphone
  const micAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: micScale.value }],
    };
  });

  // Format recording time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <RNAnimated.View style={[styles.header, { opacity: fadeAnim }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0077b6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Health Assistant</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.profileButton} 
            onPress={toggleProfileDisplay}
          >
            <Ionicons name="person-circle-outline" size={24} color="#0077b6" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.resetButton} 
            onPress={resetAssessment}
          >
            <Ionicons name="refresh" size={24} color="#0077b6" />
          </TouchableOpacity>
        </View>
      </RNAnimated.View>
      
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.content}>
          {renderProfileInfo()}
          
          <ScrollView 
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map(renderMessage)}
            
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#0077b6" />
                <Text style={styles.loadingText}>Thinking...</Text>
              </View>
            )}
          </ScrollView>
          
          {/* Voice recording indicator */}
          {isVoiceMode && isRecording && (
            <Animated.View 
              style={styles.recordingIndicator}
              entering={FadeIn.duration(300)}
              exiting={FadeOut.duration(300)}
            >
              <View style={styles.recordingDot} />
              <Text style={styles.recordingText}>Recording... {formatTime(recordingTime)}</Text>
              <Text style={styles.recordingHint}>Tap microphone when finished</Text>
            </Animated.View>
          )}
          
          {/* Input Area */}
          <Animated.View style={styles.inputContainer}>
            {/* Switch between keyboard and voice input */}
            <TouchableOpacity 
              style={styles.inputModeToggle}
              onPress={toggleInputMode}
              accessibilityLabel={isVoiceMode ? "Switch to keyboard input" : "Switch to voice input"}
              accessibilityHint={isVoiceMode ? "Double tap to use keyboard typing" : "Double tap to use voice recording"}
            >
              <Ionicons 
                name={isVoiceMode ? "keyboard-outline" : "mic-outline"} 
                size={22} 
                color="#0077b6" 
              />
            </TouchableOpacity>
            
            {!isVoiceMode ? (
              /* Keyboard input mode */
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Describe your symptoms here..."
                  value={inputText}
                  onChangeText={handleInputChange}
                  multiline={false}
                  accessibilityLabel="Input field for symptoms"
                />
                <TouchableOpacity 
                  style={[
                    styles.sendButton,
                    !inputText.trim() && styles.disabledSendButton
                  ]}
                  onPress={sendMessage}
                  disabled={!inputText.trim() || isLoading}
                  accessibilityLabel="Send message"
                >
                  <Ionicons name="send" size={20} color="white" />
                </TouchableOpacity>
              </>
            ) : (
              /* Voice input mode */
              <TouchableOpacity 
                style={[
                  styles.voiceButton,
                  isRecording && styles.voiceButtonRecording
                ]}
                onPress={isRecording ? stopRecording : startRecording}
                accessibilityLabel={isRecording ? "Stop recording" : "Start recording"}
                accessibilityHint={isRecording ? "Double tap to stop recording voice input" : "Double tap to start recording voice input"}
              >
                <Animated.View style={micAnimatedStyle}>
                  <Ionicons 
                    name={isRecording ? "stop" : "mic"} 
                    size={24} 
                    color="white" 
                  />
                </Animated.View>
                <Text style={styles.voiceButtonText}>
                  {isRecording ? "Tap to stop" : "Tap to speak"}
                </Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
      
      {/* Accessibility instructions panel */}
      <TouchableOpacity 
        style={styles.accessibilityHint}
        onPress={() => Alert.alert(
          "Input Options", 
          "You can switch between keyboard typing and voice input by tapping the icon on the left of the input area. Tap the profile icon to view your health information.",
          [{ text: "Got it" }]
        )}
        accessibilityLabel="Input options help"
      >
        <Ionicons name="help-circle-outline" size={18} color="#64748b" />
        <Text style={styles.accessibilityHintText}>Input options</Text>
      </TouchableOpacity>
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileButton: {
    marginRight: 16,
  },
  resetButton: {
    
  },
  content: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  profileCard: {
    backgroundColor: '#ffffff',
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  profileSection: {
    marginBottom: 12,
  },
  profileSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0077b6',
    marginBottom: 4,
  },
  profileText: {
    fontSize: 14,
    color: '#1e293b',
  },
  profileListItem: {
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 2,
    paddingLeft: 4,
  },
  profileNote: {
    fontSize: 12,
    color: '#64748b',
    fontStyle: 'italic',
    marginTop: 8,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingTop: 20,
    paddingBottom: 10,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '85%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userMessageBubble: {
    backgroundColor: '#0077b6',
  },
  botMessageBubble: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#ffffff',
  },
  botMessageText: {
    color: '#1e293b',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    alignItems: 'center',
    height: 70,
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingRight: 40,
    fontSize: 16,
    height: 46,
    marginLeft: 8,
  },
  sendButton: {
    position: 'absolute',
    right: 22,
    bottom: 21,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0077b6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledSendButton: {
    backgroundColor: '#94a3b8',
  },
  inputModeToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  voiceButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#0077b6',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    height: 48,
  },
  voiceButtonRecording: {
    backgroundColor: '#ef4444',
  },
  voiceButtonText: {
    color: 'white',
    marginLeft: 10,
    fontWeight: '500',
    fontSize: 16,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ef4444',
    marginRight: 8,
  },
  recordingText: {
    color: '#ef4444',
    fontWeight: '500',
    fontSize: 14,
  },
  recordingHint: {
    color: '#64748b',
    fontSize: 12,
    marginLeft: 'auto',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#64748b',
  },
  accessibilityHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
  },
  accessibilityHintText: {
    color: '#64748b',
    fontSize: 12,
    marginLeft: 4,
  },
  optionsContainer: {
    marginBottom: 20,
    marginTop: 10,
    width: '100%',
  },
  outcomeContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    alignItems: 'center',
  },
  outcomeIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  outcomeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
    textAlign: 'center',
  },
  outcomeDescription: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  outcomeActions: {
    width: '100%',
  },
  actionButton: {
    backgroundColor: '#0077b6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});