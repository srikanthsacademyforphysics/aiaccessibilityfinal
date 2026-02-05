import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import * as Speech from 'expo-speech';

export default function HomeScreen({ navigation }) {
  useEffect(() => {
    setTimeout(() => {
      Speech.speak(
        'Welcome to AI Accessibility Assistant. ' +
        'Choose Camera Assistant to identify objects, money, and medicine. ' +
        'Or choose Object Finder to search for specific items.',
        { rate: 0.9 }
      );
    }, 800);
  }, []);

  const navigateTo = (screen, message) => {
    Speech.speak(message, { rate: 0.9 });
    setTimeout(() => navigation.navigate(screen), 600);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.emoji}>👁️</Text>
        <Text style={styles.title}>AI Accessibility</Text>
        <Text style={styles.subtitle}>Assistant for Visually Impaired</Text>
      </View>

      {/* Main Options */}
      <View style={styles.optionsContainer}>
        {/* Camera Assistant Card */}
        <TouchableOpacity
          style={[styles.card, styles.cameraCard, styles.cardSpacing]}
          onPress={() => navigateTo('Camera', 'Opening Camera Assistant')}
          activeOpacity={0.85}
        >
          <Text style={styles.cardEmoji}>📸</Text>
          <Text style={styles.cardTitle}>Camera Assistant</Text>
          <Text style={styles.cardDesc}>
            Identify money, medicine, read text, and describe objects
          </Text>
        </TouchableOpacity>

        {/* Object Finder Card */}
        <TouchableOpacity
          style={[styles.card, styles.finderCard]}
          onPress={() => navigateTo('ObjectFinder', 'Opening Object Finder')}
          activeOpacity={0.85}
        >
          <Text style={styles.cardEmoji}>🔍</Text>
          <Text style={styles.cardTitle}>Object Finder</Text>
          <Text style={styles.cardDesc}>
            Find specific items like phone, keys, wallet, or remote
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer Info */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, styles.footerSpacing]}>💡 Tap any card to get started</Text>
        <Text style={[styles.footerText, styles.footerSpacing]}>🔊 All responses are spoken aloud</Text>
        <Text style={styles.footerText}>♿ Screen reader compatible</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  emoji: {
    fontSize: 70,
    marginBottom: 15,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 17,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 24,
  },
  optionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  card: {
    flex: 1,
    borderRadius: 24,
    padding: 35,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  cameraCard: {
    backgroundColor: '#3b82f6',
  },
  finderCard: {
    backgroundColor: '#10b981',
  },
  cardEmoji: {
    fontSize: 70,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 16,
    color: '#e0e7ff',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  cardSpacing: {
    marginBottom: 20,
  },
  footer: {
    paddingHorizontal: 30,
    paddingBottom: 35,
  },
  footerText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  footerSpacing: {
    marginBottom: 10,
  },
});
