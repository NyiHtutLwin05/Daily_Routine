import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Animated
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Task } from '../types/task';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { spacing } from '../constants/spacing';
import { formatTimeFromString } from '../utils/dateUtils';
import { useRouter } from 'expo-router';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete }) => {
  const router = useRouter();
  const scaleValue = React.useRef(new Animated.Value(1)).current;
  
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'work': return '#4A90E2';
      case 'personal': return '#F5A623';
      case 'health': return '#7ED321';
      case 'learning': return '#BD10E0';
      case 'social': return '#50E3C2';
      default: return '#B8B8B8';
    }
  };
  
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Feather name="flag" size={16} color={colors.danger} />;
      case 'medium':
        return <Feather name="flag" size={16} color={colors.warning} />;
      case 'low':
        return <Feather name="flag" size={16} color={colors.info} />;
      default:
        return null;
    }
  };
  
  const handlePress = () => {
    router.push(`/task/${task.id}`);
  };
  
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
    
    onToggleComplete(task.id);
  };
  
  return (
    <Animated.View style={[
      styles.container, 
      { transform: [{ scale: scaleValue }] }
    ]}>
      <TouchableOpacity 
        style={styles.checkboxContainer}
        onPress={handleToggleComplete}
      >
        <View style={[
          styles.checkbox,
          task.completed && styles.checkboxCompleted
        ]}>
          {task.completed && (
            <Feather name="check" size={14} color={colors.white} />
          )}
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.contentContainer}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.taskInfo}>
          <Text 
            style={[
              styles.title, 
              task.completed && styles.titleCompleted
            ]}
            numberOfLines={1}
          >
            {task.title}
          </Text>
          
          {task.description ? (
            <Text 
              style={styles.description}
              numberOfLines={1}
            >
              {task.description}
            </Text>
          ) : null}
          
          <View style={styles.metaContainer}>
            {task.startTime && (
              <View style={styles.timeContainer}>
                <Feather name="clock" size={12} color={colors.textLight} />
                <Text style={styles.timeText}>
                  {formatTimeFromString(task.startTime)}
                  {task.endTime && ` - ${formatTimeFromString(task.endTime)}`}
                </Text>
              </View>
            )}
            
            <View style={[
              styles.categoryBadge, 
              { backgroundColor: getCategoryColor(task.category) }
            ]}>
              <Text style={styles.categoryText}>
                {task.category}
              </Text>
            </View>
            
            {task.recurrence !== 'none' && (
              <View style={styles.recurrenceContainer}>
                <Feather name="repeat" size={12} color={colors.textLight} />
                <Text style={styles.recurrenceText}>
                  {task.recurrence}
                </Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.rightContainer}>
          {getPriorityIcon(task.priority)}
          <Feather name="chevron-right" size={18} color={colors.textLight} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    marginBottom: spacing.md,
    padding: spacing.md,
    shadowColor: colors.taskItemShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.taskItemBorder,
  },
  checkboxContainer: {
    marginRight: spacing.md,
    justifyContent: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  title: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.semiBold as any,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textLight,
  },
  description: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes.sm,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  timeText: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes.xs,
    color: colors.textLight,
    marginLeft: 4,
  },
  categoryBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  categoryText: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes.xs,
    color: colors.white,
    fontWeight: fonts.weights.medium as any,
  },
  recurrenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recurrenceText: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes.xs,
    color: colors.textLight,
    marginLeft: 4,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});

export default TaskItem;