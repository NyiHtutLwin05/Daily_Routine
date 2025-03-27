import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { spacing } from '../../constants/spacing';
import { useTaskStore } from '../../store/taskStore';
import { formatDate, formatTimeFromString } from '../../utils/dateUtils';
import Button from '../../components/Button';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getTaskById, deleteTask, toggleTaskCompletion } = useTaskStore();
  const [task, setTask] = useState(getTaskById(id as string));
  
  useEffect(() => {
    if (!task) {
      Alert.alert("Error", "Task not found");
      router.back();
    }
  }, [task]);
  
  const handleDelete = () => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteTask(id as string);
            router.back();
          }
        }
      ]
    );
  };
  
  const handleToggleComplete = async () => {
    await toggleTaskCompletion(id as string);
    setTask(getTaskById(id as string));
  };
  
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
  
  const getPriorityLabel = (priority: string): string => {
    switch (priority) {
      case 'high': return 'High Priority';
      case 'medium': return 'Medium Priority';
      case 'low': return 'Low Priority';
      default: return 'No Priority';
    }
  };
  
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return colors.danger;
      case 'medium': return colors.warning;
      case 'low': return colors.info;
      default: return colors.textLight;
    }
  };
  
  if (!task) return null;
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="dark" />
      
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{task.title}</Text>
            <View style={[
              styles.categoryBadge,
              { backgroundColor: getCategoryColor(task.category) }
            ]}>
              <Text style={styles.categoryText}>{task.category}</Text>
            </View>
          </View>
          
          {task.description && (
            <Text style={styles.description}>{task.description}</Text>
          )}
        </View>
        
        <View style={styles.detailsSection}>
          <View style={styles.detailItem}>
            <View style={styles.detailIconContainer}>
              <Feather name="calendar" size={20} color={colors.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{formatDate(task.date)}</Text>
            </View>
          </View>
          
          {task.startTime && (
            <View style={styles.detailItem}>
              <View style={styles.detailIconContainer}>
                <Feather name="clock" size={20} color={colors.primary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Time</Text>
                <Text style={styles.detailValue}>
                  {formatTimeFromString(task.startTime)}
                  {task.endTime && ` - ${formatTimeFromString(task.endTime)}`}
                </Text>
              </View>
            </View>
          )}
          
          <View style={styles.detailItem}>
            <View style={styles.detailIconContainer}>
              <Feather name="flag" size={20} color={getPriorityColor(task.priority)} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Priority</Text>
              <Text 
                style={[
                  styles.detailValue,
                  { color: getPriorityColor(task.priority) }
                ]}
              >
                {getPriorityLabel(task.priority)}
              </Text>
            </View>
          </View>
          
          {task.recurrence !== 'none' && (
            <View style={styles.detailItem}>
              <View style={styles.detailIconContainer}>
                <Feather name="repeat" size={20} color={colors.primary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Repeats</Text>
                <Text style={styles.detailValue}>{task.recurrence}</Text>
              </View>
            </View>
          )}
          
          {task.streak && task.streak > 0 && (
            <View style={styles.detailItem}>
              <View style={styles.detailIconContainer}>
                <Feather name="zap" size={20} color={colors.warning} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Streak</Text>
                <Text style={styles.detailValue}>{task.streak} days</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title={task.completed ? "Mark as Incomplete" : "Mark as Complete"}
          onPress={handleToggleComplete}
          variant={task.completed ? "outline" : "primary"}
          icon={
            task.completed 
              ? <Feather name="x" size={18} color={colors.primary} />
              : <Feather name="check" size={18} color={colors.white} />
          }
          style={styles.completeButton}
        />
        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Feather name="trash-2" size={24} color={colors.danger} />
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
  content: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: fonts.sizes.xxl,
    fontWeight: fonts.weights.bold as any,
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
  },
  categoryText: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.medium as any,
    color: colors.white,
  },
  description: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes.md,
    color: colors.textLight,
    lineHeight: 24,
  },
  detailsSection: {
    padding: spacing.lg,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailContent: {
    flex: 1,
    justifyContent: 'center',
  },
  detailLabel: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes.sm,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  detailValue: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.semiBold as any,
    color: colors.text,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    backgroundColor: colors.white,
  },
  completeButton: {
    flex: 1,
    marginRight: spacing.md,
  },
  deleteButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.danger,
  },
});