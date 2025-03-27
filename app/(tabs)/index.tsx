import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { spacing } from '../../constants/spacing';
import { useTaskStore } from '../../store/taskStore';
import { getToday, getWeekDates, formatDate } from '../../utils/dateUtils';
import TaskItem from '../../components/TaskItem';
import DateSelector from '../../components/DateSelector';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/Button';

export default function TodayScreen() {
  const router = useRouter();
  const { tasks, fetchTasks, toggleTaskCompletion } = useTaskStore();
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [refreshing, setRefreshing] = useState(false);
  const [weekDates, setWeekDates] = useState<string[]>(getWeekDates());
  
  useEffect(() => {
    fetchTasks();
  }, []);
  
  const filteredTasks = tasks.filter(task => task.date === selectedDate);
  
  const completedTasks = filteredTasks.filter(task => task.completed);
  const pendingTasks = filteredTasks.filter(task => !task.completed);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };
  
  const handleAddTask = () => {
    router.push('/task/create');
  };
  
  const handleToggleComplete = (id: string) => {
    toggleTaskCompletion(id);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>My Day</Text>
          <Text style={styles.date}>{formatDate(selectedDate)}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddTask}
        >
          <Feather name="plus" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>
      
      <DateSelector 
        dates={weekDates}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {filteredTasks.length === 0 ? (
          <EmptyState
            title="No Tasks Yet"
            message="Add your first task to start planning your day."
            icon="calendar"
            actionLabel="Add Task"
            onAction={handleAddTask}
          />
        ) : (
          <>
            {pendingTasks.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Pending Tasks</Text>
                {pendingTasks.map(task => (
                  <TaskItem 
                    key={task.id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                  />
                ))}
              </View>
            )}
            
            {completedTasks.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Completed</Text>
                {completedTasks.map(task => (
                  <TaskItem 
                    key={task.id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                  />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
      
      <View style={styles.footer}>
        <Button 
          title="Add New Task"
          onPress={handleAddTask}
          icon={<Feather name="plus" size={18} color={colors.white} />}
        />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  greeting: {
    fontFamily: fonts.heading,
    fontSize: fonts.sizes.xxl,
    fontWeight: fonts.weights.bold as any,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  date: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes.md,
    color: colors.textLight,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.semiBold as any,
    color: colors.text,
    marginBottom: spacing.md,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
});