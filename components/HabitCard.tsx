import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Animated
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Habit } from '../types/habit';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { spacing } from '../constants/spacing';
import { getToday } from '../utils/dateUtils';

interface HabitCardProps {
  habit: Habit;
  onToggleComplete: (id: string, completed: boolean) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onToggleComplete }) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;
  
  const today = getToday();
  const todayLog = habit.logs.find(log => log.date === today);
  const isCompleted = todayLog?.completed || false;
  
  const handleToggleComplete = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    onToggleComplete(habit.id, !isCompleted);
  };
  
  const getStreakColor = (streak: number): string => {
    if (streak >= 30) return colors.success;
    if (streak >= 14) return colors.warning;
    if (streak >= 7) return colors.info;
    return colors.textLight;
  };
  
  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ scale: scaleValue }] }
      ]}
    >
      <View style={styles.topRow}>
        <Text style={styles.name}>{habit.name}</Text>
        <TouchableOpacity 
          style={[
            styles.checkbox,
            isCompleted && styles.checkboxCompleted
          ]}
          onPress={handleToggleComplete}
        >
          {isCompleted && (
            <Feather name="check" size={16} color={colors.white} />
          )}
        </TouchableOpacity>
      </View>
      
      {habit.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {habit.description}
        </Text>
      ) : null}
      
      <View style={styles.bottomRow}>
        <View style={styles.streakContainer}>
          <Feather name="zap" size={16} color={getStreakColor(habit.currentStreak)} />
          <Text style={[
            styles.streakText,
            { color: getStreakColor(habit.currentStreak) }
          ]}>
            {habit.currentStreak} day streak
          </Text>
        </View>
        
        <View style={styles.frequencyContainer}>
          <Text style={styles.frequencyText}>
            {habit.frequency}x per week
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.taskItemShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.taskItemBorder,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  name: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.semiBold as any,
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  description: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes.sm,
    color: colors.textLight,
    marginBottom: spacing.sm,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.medium as any,
    marginLeft: 4,
  },
  frequencyContainer: {
    backgroundColor: colors.lightGray,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  frequencyText: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes.xs,
    color: colors.text,
  },
});

export default HabitCard;