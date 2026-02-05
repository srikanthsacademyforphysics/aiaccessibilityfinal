import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as Speech from 'expo-speech';
import axios from 'axios';

// Backend API URL - Vercel deployment
const BACKEND_URL = 'https://aiaccessibilityfinalbackend.vercel.app';

export default function ObjectFinderScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [objectToFind, setObjectToFind] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentGuidance, setCurrentGuidance] = useState('');
  
  const cameraRef = useRef(null);
  const searchIntervalRef = useRef(null);

  useEffect(() => {
    setupCamera();
    return () => {
      if (searchIntervalRef.current) {
        clearInterval(searchIntervalRef.current);
      }
    };
  }, []);

  const setupCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
    
    if (status === 'granted') {
      setTimeout(() => {
        speak('Object Finder ready. Enter what you want to find and tap Start Search.');
      }, 500);
    }
  };

  const speak = (text) => {
    Speech.speak(text, { rate: 0.9 });
  };

  const addResult = (text) => {
    setSearchResults(prev => [...prev, { text, id: Date.now() }]);
  };

  const startSearch = () => {
    if (!objectToFind.trim()) {
      Alert.alert('Enter Object', 'Please type what you want to find');
      return;
    }

    setIsSearching(true);
    setSearchResults([]);
    setCurrentGuidance('');
    speak(`Searching for ${objectToFind}. Keep camera moving slowly.`);
    addResult(`🔍 Searching for: ${objectToFind}`);

    // Start scanning every 2 seconds
    searchIntervalRef.current = setInterval(() => {
      scanForObject();
    }, 2000);
  };

  const stopSearch = () => {
    if (searchIntervalRef.current) {
      clearInterval(searchIntervalRef.current);
      searchIntervalRef.current = null;
    }
    setIsSearching(false);
    setCurrentGuidance('');
    speak('Search stopped');
    addResult('⏹️ Search stopped');
  };

  const scanForObject = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        base64: true,
      });

      const response = await axios.post(
        `${BACKEND_URL}/api/find-object`,
        {
          image: photo.base64,
          objectName: objectToFind,
        },
        { timeout: 10000 }
      );

      if (response.data.success) {
        const { found, guidance } = response.data;
        
        setCurrentGuidance(guidance);
        addResult(guidance);
        speak(guidance);

        if (found) {
          // Object found! Stop searching
          stopSearch();
          speak('Found it! Say Stop when you have it.');
        }
      }

    } catch (error) {
      console.error('Scan error:', error);
      // Don't stop on error, just continue scanning
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
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
      <Camera 
        style={styles.camera} 
        ref={cameraRef}
        type={Camera.Constants.Type.back}
      />
      
      {/* Overlay */}
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => {
              stopSearch();
              speak('Going back');
              navigation.goBack();
            }}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Object Finder</Text>
        </View>

        {/* Search Status */}
        {isSearching && (
          <View style={styles.searchingBadge}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.searchingText}>
              Searching for {objectToFind}...
            </Text>
          </View>
        )}

        {/* Current Guidance */}
        {currentGuidance && isSearching && (
          <View style={styles.guidanceBox}>
            <Text style={styles.guidanceIcon}>🎯</Text>
            <Text style={styles.guidanceText}>{currentGuidance}</Text>
          </View>
        )}

        {/* Search Results */}
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Search Log:</Text>
          <ScrollView style={styles.resultsList}>
            {searchResults.slice(-8).reverse().map(result => (
              <View key={result.id} style={styles.resultItem}>
                <Text style={styles.resultText}>{result.text}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Search Controls */}
        <View style={styles.controlsContainer}>
          {!isSearching ? (
            <>
              <Text style={styles.inputLabel}>What are you looking for?</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., phone, keys, wallet, remote..."
                placeholderTextColor="#64748b"
                value={objectToFind}
                onChangeText={setObjectToFind}
                editable={!isSearching}
              />
              
              <TouchableOpacity 
                style={styles.startButton}
                onPress={startSearch}
              >
                <Text style={styles.startButtonText}>🔍 Start Search</Text>
              </TouchableOpacity>

              <View style={styles.quickSearches}>
                <Text style={styles.quickSearchLabel}>Quick searches:</Text>
                <View style={styles.quickSearchButtons}>
                  <TouchableOpacity 
                    style={styles.quickBtn}
                    onPress={() => {
                      setObjectToFind('phone');
                      setTimeout(startSearch, 500);
                    }}
                  >
                    <Text style={styles.quickBtnText}>📱 Phone</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.quickBtn}
                    onPress={() => {
                      setObjectToFind('keys');
                      setTimeout(startSearch, 500);
                    }}
                  >
                    <Text style={styles.quickBtnText}>🔑 Keys</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.quickBtn}
                    onPress={() => {
                      setObjectToFind('remote');
                      setTimeout(startSearch, 500);
                    }}
                  >
                    <Text style={styles.quickBtnText}>📺 Remote</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ) : (
            <TouchableOpacity 
              style={styles.stopButton}
              onPress={stopSearch}
            >
              <Text style={styles.stopButtonText}>⏹️ Stop Search</Text>
            </TouchableOpacity>
          )}
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
  searchingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.95)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 10,
  },
  searchingText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  guidanceBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.95)',
    marginHorizontal: 20,
    marginTop: 15,
    padding: 20,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  guidanceIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  guidanceText: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  resultsContainer: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  resultsTitle: {
    color: '#06b6d4',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultsList: {
    flex: 1,
  },
  resultItem: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  resultText: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 18,
  },
  controlsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  inputLabel: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    fontSize: 16,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 15,
  },
  startButton: {
    backgroundColor: '#10b981',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  stopButton: {
    backgroundColor: '#ef4444',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  stopButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quickSearches: {
    marginTop: 5,
  },
  quickSearchLabel: {
    color: '#64748b',
    fontSize: 12,
    marginBottom: 10,
  },
  quickSearchButtons: {
    flexDirection: 'row',
  },
  quickBtn: {
    flex: 1,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    marginRight: 8,
  },
  quickBtnText: {
    color: '#60a5fa',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '600',
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
    backgroundColor: '#10b981',
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
