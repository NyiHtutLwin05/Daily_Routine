import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { spacing } from '../constants/spacing';
import { getDayName, getDayNumber, isToday } from '../utils/dateUtils';

interface DateSelectorProps {
  dates: string[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ 
  dates, 
  selectedDate, 
  onSelectDate 
}) => {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {dates.map((date) => {
          const selected = date === selectedDate;
          const today = isToday(date);
          
          return (
            <TouchableOpacity
              key={date}
              style={[
                styles.dateItem,
                selected && styles.selectedDateItem,
                today && styles.todayDateItem
              ]}
              onPress={() => onSelectDate(date)}
            >
              <Text 
                style={[
                  styles.dayName,
                  selected && styles.selectedText
                ]}
              >
                {getDayName(date)}
              </Text>
              <Text 
                style={[
                  styles.dayNumber,
                  selected && styles.selectedText
                ]}
              >
                {getDayNumber(date)}
              </Text>
              {today && <View style={styles.todayIndicator} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
  },
  dateItem: {
    width: 60,
    height: 80,
    borderRadius: 12,
    backgroundColor: colors.white,
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedDateItem: {
    backgroundColor: colors.primary,
  },
  todayDateItem: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
  dayName: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes.xs,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  dayNumber: {
    fontFamily: fonts.heading,
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold as any,
    color: colors.text,
  },
  selectedText: {
    color: colors.white,
  },
  todayIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    position: 'absolute',
    bottom: 8,
  },
});

export default DateSelector;