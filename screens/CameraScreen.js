import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Speech from 'expo-speech';
import axios from 'axios';

// Backend API URL - Vercel deployment
const BACKEND_URL = 'https://aiaccessibilityfinalbackend.vercel.app';

export default function CameraScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const cameraRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (permission?.granted) {
      setTimeout(() => {
        speak('Camera ready. Tap any button to ask a question about what the camera sees.');
      }, 500);
    } else if (permission && !permission.granted && !permission.canAskAgain) {
      // Permission denied, can't ask again
    }
  }, [permission]);

  const setupCamera = async () => {
    if (!permission?.granted) {
      await requestPermission();
    }
  };

  const speak = (text) => {
    Speech.speak(text, { rate: 0.9 });
  };

  const addMessage = (role, text) => {
    setMessages(prev => [...prev, { role, text, id: Date.now() }]);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const askQuestion = async (question) => {
    if (isProcessing || !cameraRef.current) return;
    
    setIsProcessing(true);
    setCurrentQuestion(question);
    addMessage('user', question);
    speak('Taking photo');
    
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: true,
        skipProcessing: false,
      });

      speak('Analyzing');

      const response = await axios.post(
        `${BACKEND_URL}/api/analyze`,
        { image: photo.base64, question: question },
        { timeout: 20000 }
      );

      if (response.data.success) {
        const answer = response.data.answer;
        addMessage('assistant', answer);
        speak(answer);
      } else {
        throw new Error('Analysis failed');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMsg = error.message.includes('timeout')
        ? 'Request timed out. Please try again.'
        : 'Something went wrong. Please try again.';
      
      addMessage('assistant', errorMsg);
      speak(errorMsg);
    } finally {
      setIsProcessing(false);
      setCurrentQuestion('');
    }
  };

  if (!permission) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Camera access required</Text>
        <TouchableOpacity style={styles.retryButton} onPress={setupCamera}>
          <Text style={styles.retryButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Camera */}
      <CameraView 
        style={styles.camera} 
        ref={cameraRef}
        facing="back"
      />
      
      {/* Overlay */}
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => {
              speak('Going back');
              navigation.goBack();
            }}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Camera Assistant</Text>
        </View>

        {/* Status */}
        {isProcessing && (
          <View style={styles.statusBox}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.statusText}>
              {currentQuestion ? `Processing...` : 'Processing...'}
            </Text>
          </View>
        )}

        {/* Conversation */}
        <ScrollView 
          ref={scrollRef}
          style={styles.conversationContainer}
          contentContainerStyle={styles.conversationContent}
        >
          {messages.slice(-6).map(msg => (
            <View 
              key={msg.id} 
              style={[
                styles.message, 
                msg.role === 'user' ? styles.userMsg : styles.aiMsg
              ]}
            >
              <Text style={styles.msgRole}>
                {msg.role === 'user' ? '👤' : '🤖'}
              </Text>
              <Text style={styles.msgText}>{msg.text}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.btn1]}
            onPress={() => askQuestion('What is this object? Describe it in detail.')}
            disabled={isProcessing}
          >
            <Text style={styles.btnEmoji}>👁️</Text>
            <Text style={styles.btnText}>What is this?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionBtn, styles.btn2]}
            onPress={() => askQuestion('Read all text visible in this image clearly and completely.')}
            disabled={isProcessing}
          >
            <Text style={styles.btnEmoji}>📄</Text>
            <Text style={styles.btnText}>Read Text</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionBtn, styles.btn3]}
            onPress={() => askQuestion('Is this money? What is the denomination and currency?')}
            disabled={isProcessing}
          >
            <Text style={styles.btnEmoji}>💰</Text>
            <Text style={styles.btnText}>Check Money</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionBtn, styles.btn4]}
            onPress={() => askQuestion('Read this medicine label. Tell me the name, dosage, expiry date, and if it is safe to use.')}
            disabled={isProcessing}
          >
            <Text style={styles.btnEmoji}>💊</Text>
            <Text style={styles.btnText}>Check Medicine</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionBtn, styles.btn5]}
            onPress={() => askQuestion('What colors do you see? Describe the colors and patterns.')}
            disabled={isProcessing}
          >
            <Text style={styles.btnEmoji}>🎨</Text>
            <Text style={styles.btnText}>Describe Colors</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 19,
    fontWeight: 'bold',
    marginRight: 90,
  },
  statusBox: {
    alignSelf: 'center',
    backgroundColor: 'rgba(6, 182, 212, 0.95)',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 10,
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  conversationContainer: {
    flex: 1,
    marginTop: 15,
  },
  conversationContent: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  message: {
    marginBottom: 12,
    padding: 14,
    borderRadius: 14,
    maxWidth: '85%',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  userMsg: {
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    alignSelf: 'flex-end',
  },
  aiMsg: {
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
    alignSelf: 'flex-start',
  },
  msgRole: {
    fontSize: 20,
    marginRight: 10,
  },
  msgText: {
    color: '#fff',
    fontSize: 15,
    flex: 1,
    lineHeight: 21,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 25,
    paddingTop: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 17,
    borderRadius: 14,
    marginBottom: 10,
  },
  btn1: { backgroundColor: '#10b981' },
  btn2: { backgroundColor: '#3b82f6' },
  btn3: { backgroundColor: '#f59e0b' },
  btn4: { backgroundColor: '#ef4444' },
  btn5: { backgroundColor: '#8b5cf6' },
  btnEmoji: {
    fontSize: 26,
    marginRight: 14,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: 16,
    marginTop: 15,
  },
  errorText: {
    color: '#f87171',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
