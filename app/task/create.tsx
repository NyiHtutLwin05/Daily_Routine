import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { spacing } from '../../constants/spacing';
import { useTaskStore } from '../../store/taskStore';
import { TaskCategory, TaskPriority, RecurrenceType } from '../../types/task';
import Button from '../../components/Button';
import { getToday } from '../../utils/dateUtils';

export default function CreateTaskScreen() {
  const router = useRouter();
  const { addTask } = useTaskStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [category, setCategory] = useState<TaskCategory>('personal');
  const [recurrence, setRecurrence] = useState<RecurrenceType>('none');
  
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };
  
  const handleStartTimeChange = (event: any, selectedTime?: Date) => {
    setShowStartTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setStartTime(selectedTime);
    }
  };
  
  const handleEndTimeChange = (event: any, selectedTime?: Date) => {
    setShowEndTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setEndTime(selectedTime);
    }
  };
  
  const formatTimeForDisplay = (time: Date | null): string => {
    if (!time) return 'Select time';
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatTimeForStorage = (time: Date | null): string | undefined => {
    if (!time) return undefined;
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  
  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    }
    
    try {
      const newTask = await addTask({
        title: title.trim(),
        description: description.trim() || undefined,
        completed: false,
        date: date.toISOString().split('T')[0],
        startTime: formatTimeForStorage(startTime),
        endTime: formatTimeForStorage(endTime),
        priority,
        category,
        recurrence,
      });
      
      router.back();
    } catch (error) {
      alert('Failed to create task. Please try again.');
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="dark" />
      
      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter task title"
            placeholderTextColor={colors.textLight}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description (optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter task description"
            placeholderTextColor={colors.textLight}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity 
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.datePickerText}>
              {date.toLocaleDateString()}
            </Text>
            <Feather name="calendar" size={20} color={colors.primary} />
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>
        
        <View style={styles.timeContainer}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: spacing.md }]}>
            <Text style={styles.label}>Start Time (optional)</Text>
            <TouchableOpacity 
              style={styles.datePickerButton}
              onPress={() => setShowStartTimePicker(true)}
            >
              <Text style={styles.datePickerText}>
                {startTime ? formatTimeForDisplay(startTime) : 'Select time'}
              </Text>
              <Feather name="clock" size={20} color={colors.primary} />
            </TouchableOpacity>
            
            {showStartTimePicker && (
              <DateTimePicker
                value={startTime || new Date()}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleStartTimeChange}
              />
            )}
          </View>
          
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>End Time (optional)</Text>
            <TouchableOpacity 
              style={styles.datePickerButton}
              onPress={() => setShowEndTimePicker(true)}
            >
              <Text style={styles.datePickerText}>
                {endTime ? formatTimeForDisplay(endTime) : 'Select time'}
              </Text>
              <Feather name="clock" size={20} color={colors.primary} />
            </TouchableOpacity>
            
            {showEndTimePicker && (
              <DateTimePicker
                value={endTime || new Date()}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleEndTimeChange}
              />
            )}
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity 
              style={[
                styles.optionButton,
                priority === 'low' && styles.selectedOption,
                { borderColor: colors.info }
              ]}
              onPress={() => setPriority('low')}
            >
              <Feather 
                name="flag" 
                size={16} 
                color={priority === 'low' ? colors.white : colors.info} 
              />
              <Text 
                style={[
                  styles.optionText,
                  priority === 'low' && styles.selectedOptionText
                ]}
              >
                Low
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.optionButton,
                priority === 'medium' && styles.selectedOption,
                { borderColor: colors.warning }
              ]}
              onPress={() => setPriority('medium')}
            >
              <Feather 
                name="flag" 
                size={16} 
                color={priority === 'medium' ? colors.white : colors.warning} 
              />
              <Text 
                style={[
                  styles.optionText,
                  priority === 'medium' && styles.selectedOptionText
                ]}
              >
                Medium
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.optionButton,
                priority === 'high' && styles.selectedOption,
                { borderColor: colors.danger }
              ]}
              onPress={() => setPriority('high')}
            >
              <Feather 
                name="flag" 
                size={16} 
                color={priority === 'high' ? colors.white : colors.danger} 
              />
              <Text 
                style={[
                  styles.optionText,
                  priority === 'high' && styles.selectedOptionText
                ]}
              >
                High
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScrollContent}
            >
              <TouchableOpacity 
                style={[
                  styles.categoryButton,
                  category === 'work' && styles.selectedCategoryButton,
                  { backgroundColor: category === 'work' ? '#4A90E2' : colors.white }
                ]}
                onPress={() => setCategory('work')}
              >
                <Feather 
                  name="briefcase" 
                  size={16} 
                  color={category === 'work' ? colors.white : '#4A90E2'} 
                />
                <Text 
                  style={[
                    styles.categoryText,
                    category === 'work' && styles.selectedCategoryText
                  ]}
                >
                  Work
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.categoryButton,
                  category === 'personal' && styles.selectedCategoryButton,
                  { backgroundColor: category === 'personal' ? '#F5A623' : colors.white }
                ]}
                onPress={() => setCategory('personal')}
              >
                <Feather 
                  name="user" 
                  size={16} 
                  color={category === 'personal' ? colors.white : '#F5A623'} 
                />
                <Text 
                  style={[
                    styles.categoryText,
                    category === 'personal' && styles.selectedCategoryText
                  ]}
                >
                  Personal
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.categoryButton,
                  category === 'health' && styles.selectedCategoryButton,
                  { backgroundColor: category === 'health' ? '#7ED321' : colors.white }
                ]}
                onPress={() => setCategory('health')}
              >
                <Feather 
                  name="heart" 
                  size={16} 
                  color={category === 'health' ? colors.white : '#7ED321'} 
                />
                <Text 
                  style={[
                    styles.categoryText,
                    category === 'health' && styles.selectedCategoryText
                  ]}
                >
                  Health
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.categoryButton,
                  category === 'learning' && styles.selectedCategoryButton,
                  { backgroundColor: category === 'learning' ? '#BD10E0' : colors.white }
                ]}
                onPress={() => setCategory('learning')}
              >
                <Feather 
                  name="book" 
                  size={16} 
                  color={category === 'learning' ? colors.white : '#BD10E0'} 
                />
                <Text 
                  style={[
                    styles.categoryText,
                    category === 'learning' && styles.selectedCategoryText
                  ]}
                >
                  Learning
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.categoryButton,
                  category === 'social' && styles.selectedCategoryButton,
                  { backgroundColor: category === 'social' ? '#50E3C2' : colors.white }
                ]}
                onPress={() => setCategory('social')}
              >
                <Feather 
                  name="users" 
                  size={16} 
                  color={category === 'social' ? colors.white : '#50E3C2'} 
                />
                <Text 
                  style={[
                    styles.categoryText,
                    category === 'social' && styles.selectedCategoryText
                  ]}
                >
                  Social
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Repeat</Text>
          <View style={styles.recurrenceContainer}>
            <TouchableOpacity 
              style={[
                styles.recurrenceButton,
                recurrence === 'none' && styles.selectedRecurrenceButton
              ]}
              onPress={() => setRecurrence('none')}
            >
              <Text 
                style={[
                  styles.recurrenceText,
                  recurrence === 'none' && styles.selectedRecurrenceText
                ]}
              >
                None
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.recurrenceButton,
                recurrence === 'daily' && styles.selectedRecurrenceButton
              ]}
              onPress={() => setRecurrence('daily')}
            >
              <Text 
                style={[
                  styles.recurrenceText,
                  recurrence === 'daily' && styles.selectedRecurrenceText
                ]}
              >
                Daily
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.recurrenceButton,
                recurrence === 'weekdays' && styles.selectedRecurrenceButton
              ]}
              onPress={() => setRecurrence('weekdays')}
            >
              <Text 
                style={[
                  styles.recurrenceText,
                  recurrence === 'weekdays' && styles.selectedRecurrenceText
                ]}
              >
                Weekdays
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.recurrenceButton,
                recurrence === 'weekly' && styles.selectedRecurrenceButton
              ]}
              onPress={() => setRecurrence('weekly')}
            >
              <Text 
                style={[
                  styles.recurrenceText,
                  recurrence === 'weekly' && styles.selectedRecurrenceText
                ]}
              >
                Weekly
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title="Save Task"
          onPress={handleSave}
          variant="primary"
          size="large"
          style={styles.saveButton}
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
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.medium as any,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  input: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes.md,
    color: colors.text,
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.lightGray,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.lightGray,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  datePickerText: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes.md,
    color: colors.text,
  },
  timeContainer: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  selectedOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes.sm,
    color: colors.text,
    marginLeft: spacing.xs,
  },
  selectedOptionText: {
    color: colors.white,
  },
  categoryContainer: {
    marginBottom: spacing.sm,
  },
  categoryScrollContent: {
    paddingRight: spacing.lg,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.lightGray,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
  },
  selectedCategoryButton: {
    borderColor: 'transparent',
  },
  categoryText: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes.sm,
    color: colors.text,
    marginLeft: spacing.xs,
  },
  selectedCategoryText: {
    color: colors.white,
  },
  recurrenceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  recurrenceButton: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.lightGray,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  selectedRecurrenceButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  recurrenceText: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes.sm,
    color: colors.text,
  },
  selectedRecurrenceText: {
    color: colors.white,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    backgroundColor: colors.white,
  },
  saveButton: {
    width: '100%',
  },
});