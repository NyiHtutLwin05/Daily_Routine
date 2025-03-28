import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { colors } from "../../constants/colors";
import { fonts } from "../../constants/fonts";
import { spacing } from "../../constants/spacing";
import { useHabitStore } from "../../store/habitStore";
import HabitCard from "../../components/HabitCard";
import EmptyState from "../../components/EmptyState";
import { getToday } from "../../utils/dateUtils";

export default function HabitsScreen() {
  const { habits, fetchHabits, addHabit, logHabitCompletion } = useHabitStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchHabits();
    setRefreshing(false);
  };

  const handleAddHabit = () => {
    Alert.prompt(
      "Add New Habit",
      "What habit would you like to track?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Add",
          onPress: (name) => {
            if (name && name.trim()) {
              addHabit({
                name: name.trim(),
                category: "personal",
                frequency: 7, // Default to daily
              });
            }
          },
        },
      ],
      "plain-text"
    );
  };

  const handleToggleHabit = (id: string, completed: boolean) => {
    logHabitCompletion(id, getToday(), completed);
    console.log("yes");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.title}>My Habits</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddHabit}>
          <Feather name="plus" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

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
        {habits.length === 0 ? (
          <EmptyState
            title="No Habits Yet"
            message="Start tracking your habits to build consistency and achieve your goals."
            icon="repeat"
            actionLabel="Add Habit"
            onAction={handleAddHabit}
          />
        ) : (
          <View style={styles.habitsList}>
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggleComplete={handleToggleHabit}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={handleAddHabit}>
          <Feather name="plus" size={20} color={colors.white} />
          <Text style={styles.footerButtonText}>Add New Habit</Text>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: fonts.sizes.xxl,
    fontWeight: fonts.weights.bold as any,
    color: colors.text,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
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
  habitsList: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
  },
  footerButtonText: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.medium as any,
    color: colors.white,
    marginLeft: spacing.xs,
  },
});
