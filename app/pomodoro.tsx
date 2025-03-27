import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { spacing } from '../constants/spacing';
import { usePomodoroStore } from '../store/pomodoroStore';
import PomodoroTimer from '../components/PomodoroTimer';

export default function PomodoroScreen() {
  const { 
    isActive,
    currentMode,
    completedPomodoros,
    stopSession
  } = usePomodoroStore();
  
  const handleStopSession = () => {
    stopSession();
  };
  
  const getModeTitle = () => {
    switch (currentMode) {
      case 'work':
        return "Focus Time";
      case 'shortBreak':
        return "Short Break";
      case 'longBreak':
        return "Long Break";
      default:
        return "Focus Time";
    }
  };
  
  const getModeDescription = () => {
    switch (currentMode) {
      case 'work':
        return "Stay focused and avoid distractions.";
      case 'shortBreak':
        return "Take a short break. Stretch or grab a drink.";
      case 'longBreak':
        return "Take a longer break. Rest your mind completely.";
      default:
        return "Stay focused and avoid distractions.";
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>{getModeTitle()}</Text>
        <Text style={styles.subtitle}>
          {isActive ? 'Session in progress' : 'Session paused'}
        </Text>
      </View>
      
      <View style={styles.content}>
        <PomodoroTimer />
        
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{getModeDescription()}</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Completed</Text>
            <Text style={styles.statValue}>{completedPomodoros}</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Current Mode</Text>
            <Text style={styles.statValue}>{getModeTitle()}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.stopButton}
          onPress={handleStopSession}
        >
          <Feather name="x" size={24} color={colors.danger} />
          <Text style={styles.stopButtonText}>End Session</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: fonts.sizes.xxl,
    fontWeight: fonts.weights.bold as any,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes.md,
    color: colors.textLight,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  descriptionContainer: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  description: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes.md,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '80%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes.sm,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontFamily: fonts.heading,
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold as any,
    color: colors.primary,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: colors.lightGray,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    backgroundColor: colors.white,
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.danger,
    paddingVertical: spacing.md,
  },
  stopButtonText: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.medium as any,
    color: colors.danger,
    marginLeft: spacing.sm,
  },
});