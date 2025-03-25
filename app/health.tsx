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
} from 'react-native-reanimated';

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

// Initial welcome message
const welcomeMessage = {
  id: 'welcome',
  text: 'Hello! I\'m your SingHealth assistant. I can provide a preliminary assessment of your symptoms. How can I help you today?',
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
  
  // Animation refs and values
  const scrollViewRef = useRef(null);
  const inputHeight = useSharedValue(50);
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  
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

  const handleInputChange = (text) => {
    setInputText(text);
    // Animate input height based on content
    const numLines = text.split('\n').length;
    const newHeight = Math.min(50 + numLines * 20, 120);
    inputHeight.value = withTiming(newHeight, { duration: 100 });
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
  // Replace this with actual API call in production
  const simulateChatGptResponse = async (userInput) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simple keyword matching for demo purposes
    const lowerInput = userInput.toLowerCase();
    let response;
    
    if (!assessmentCompleted) {
      if (lowerInput.includes('fever') || lowerInput.includes('temperature')) {
        response = "I see you're experiencing fever. How high is your temperature? Do you have any other symptoms like cough, sore throat, or body aches?";
      } else if (lowerInput.includes('headache') || lowerInput.includes('pain')) {
        response = "I understand you're having headaches or pain. How long have you been experiencing this? Is it severe or does it come and go?";
      } else if (lowerInput.includes('chest') || lowerInput.includes('heart') || lowerInput.includes('breathing')) {
        // High severity symptoms trigger emergency assessment
        setAssessmentCompleted(true);
        setAssessmentOutcome(ASSESSMENT_OUTCOMES.EMERGENCY);
        response = "Based on your description of chest pain or breathing difficulties, this could be serious. I recommend seeking emergency medical attention immediately.";
      } else if (lowerInput.includes('rash') || lowerInput.includes('skin')) {
        // Medium severity symptoms suggest GP visit
        setAssessmentCompleted(true);
        setAssessmentOutcome(ASSESSMENT_OUTCOMES.GP_VISIT);
        response = "Based on your description of skin symptoms, I recommend seeing a general practitioner for proper diagnosis and treatment.";
      } else if (lowerInput.includes('cold') || lowerInput.includes('flu') || lowerInput.includes('cough')) {
        // Low severity symptoms suggest self-management
        setAssessmentCompleted(true);
        setAssessmentOutcome(ASSESSMENT_OUTCOMES.SELF_MANAGE);
        response = "Based on your symptoms, this sounds like a common cold or mild flu. Rest, stay hydrated, and take over-the-counter medications for symptom relief if needed.";
      } else {
        response = "Thank you for sharing that. Could you please tell me more about your symptoms? When did they start and how severe are they?";
      }
    } else {
      // Assessment already completed
      response = "Is there anything else I can help you with regarding your health concern?";
    }
    
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        text: response,
        type: MESSAGE_TYPES.BOT,
        timestamp: new Date()
      }
    ]);
    
    // If assessment just completed, add options
    if (assessmentCompleted && messages.every(msg => msg.type !== MESSAGE_TYPES.OPTION)) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const optionsMessage = {
        id: 'options-' + Date.now().toString(),
        type: MESSAGE_TYPES.OPTION,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, optionsMessage]);
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

  // Animated style for the input container
  const inputContainerStyle = useAnimatedStyle(() => {
    return {
      height: inputHeight.value,
    };
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <RNAnimated.View style={[styles.header, { opacity: fadeAnim }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0077b6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Health Assistant</Text>
        <TouchableOpacity onPress={resetAssessment}>
          <Ionicons name="refresh" size={24} color="#0077b6" />
        </TouchableOpacity>
      </RNAnimated.View>
      
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.content}>
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
          
          <Animated.View style={[styles.inputContainer, inputContainerStyle]}>
            <TextInput
              style={styles.input}
              placeholder="Type your symptoms here..."
              value={inputText}
              onChangeText={handleInputChange}
              multiline
            />
            <TouchableOpacity 
              style={[
                styles.sendButton,
                !inputText.trim() && styles.disabledSendButton
              ]}
              onPress={sendMessage}
              disabled={!inputText.trim() || isLoading}
            >
              <Ionicons name="send" size={20} color="white" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
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
    flex: 1,
    backgroundColor: '#f8fafc',
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
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingRight: 40,
    fontSize: 16,
    maxHeight: 120,
  },
  sendButton: {
    position: 'absolute',
    right: 22,
    bottom: 18,
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