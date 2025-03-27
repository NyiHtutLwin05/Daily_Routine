import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Animated,
  Easing
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { spacing } from '../constants/spacing';
import { formatTimeForDisplay } from '../utils/dateUtils';
import { usePomodoroStore } from '../store/pomodoroStore';

const PomodoroTimer: React.FC = () => {
  const { 
    timeRemaining, 
    isActive, 
    currentMode,
    completedPomodoros,
    settings,
    startSession,
    pauseSession,
    resumeSession,
    resetTimer,
    tick
  } = usePomodoroStore();
  
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, tick]);
  
  useEffect(() => {
    // Animate on mode change
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.in(Easing.ease),
      }),
    ]).start();
    
    // Rotate animation
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start(() => {
      rotateAnim.setValue(0);
    });
  }, [currentMode]);
  
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  const getModeColor = () => {
    switch (currentMode) {
      case 'work':
        return colors.primary;
      case 'shortBreak':
        return colors.info;
      case 'longBreak':
        return colors.success;
      default:
        return colors.primary;
    }
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
  
  const getProgressPercentage = () => {
    let totalTime;
    
    switch (currentMode) {
      case 'work':
        totalTime = settings.workDuration * 60;
        break;
      case 'shortBreak':
        totalTime = settings.shortBreakDuration * 60;
        break;
      case 'longBreak':
        totalTime = settings.longBreakDuration * 60;
        break;
      default:
        totalTime = settings.workDuration * 60;
    }
    
    return (timeRemaining / totalTime) * 100;
  };
  
  const handleStartPause = () => {
    if (!isActive) {
      if (timeRemaining === settings.workDuration * 60 && currentMode === 'work') {
        startSession();
      } else {
        resumeSession();
      }
    } else {
      pauseSession();
    }
  };
  
  const handleReset = () => {
    resetTimer();
  };
  
  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.timerContainer,
          { 
            borderColor: getModeColor(),
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <Animated.View style={[
          styles.progressOverlay,
          { 
            backgroundColor: getModeColor(),
            opacity: 0.1,
            height: `${100 - getProgressPercentage()}%`
          }
        ]} />
        
        <View style={styles.timerContent}>
          <Text style={styles.modeTitle}>{getModeTitle()}</Text>
          <Text style={styles.timeDisplay}>
            {formatTimeForDisplay(timeRemaining)}
          </Text>
          
          <View style={styles.controlsContainer}>
            <TouchableOpacity 
              style={[styles.controlButton, styles.resetButton]}
              onPress={handleReset}
            >
              <Feather name="refresh-cw" size={20} color={colors.textLight} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.controlButton, 
                styles.mainButton,
                { backgroundColor: getModeColor() }
              ]}
              onPress={handleStartPause}
            >
              <Feather 
                name={isActive ? "pause" : "play"} 
                size={24} 
                color={colors.white} 
              />
            </TouchableOpacity>
            
            <View style={styles.spacer} />
          </View>
        </View>
      </Animated.View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Completed</Text>
          <Text style={styles.statValue}>{completedPomodoros}</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Session Goal</Text>
          <Text style={styles.statValue}>{settings.sessionsBeforeLongBreak}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  timerContainer: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
  },
  timerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  modeTitle: {
    fontFamily: fonts.heading,
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.semiBold as any,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  timeDisplay: {
    fontFamily: fonts.heading,
    fontSize: 48,
    fontWeight: fonts.weights.bold as any,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginHorizontal: spacing.md,
  },
  resetButton: {
    backgroundColor: colors.lightGray,
  },
  spacer: {
    width: 50,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  statLabel: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes.sm,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontFamily: fonts.heading,
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold as any,
    color: colors.text,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: colors.lightGray,
  },
});

export default PomodoroTimer;