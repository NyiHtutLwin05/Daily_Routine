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
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { spacing } from '../../constants/spacing';
import { usePomodoroStore } from '../../store/pomodoroStore';
import PomodoroTimer from '../../components/PomodoroTimer';
import Slider from '@react-native-community/slider';

export default function FocusScreen() {
  const { 
    settings, 
    fetchSettings, 
    updateSettings 
  } = usePomodoroStore();
  
  useEffect(() => {
    fetchSettings();
  }, []);
  
  const handleWorkDurationChange = (value: number) => {
    updateSettings({ workDuration: Math.round(value) });
  };
  
  const handleShortBreakDurationChange = (value: number) => {
    updateSettings({ shortBreakDuration: Math.round(value) });
  };
  
  const handleLongBreakDurationChange = (value: number) => {
    updateSettings({ longBreakDuration: Math.round(value) });
  };
  
  const handleSessionsChange = (value: number) => {
    updateSettings({ sessionsBeforeLongBreak: Math.round(value) });
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Focus Timer</Text>
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.timerSection}>
          <PomodoroTimer />
        </View>
        
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Timer Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Feather name="clock" size={18} color={colors.primary} />
              <Text style={styles.settingLabel}>Focus Time</Text>
            </View>
            <View style={styles.settingControl}>
              <Slider
                style={styles.slider}
                minimumValue={5}
                maximumValue={60}
                step={5}
                value={settings.workDuration}
                onValueChange={handleWorkDurationChange}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.lightGray}
                thumbTintColor={colors.primary}
              />
              <Text style={styles.settingValue}>{settings.workDuration} min</Text>
            </View>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Feather name="coffee" size={18} color={colors.info} />
              <Text style={styles.settingLabel}>Short Break</Text>
            </View>
            <View style={styles.settingControl}>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={15}
                step={1}
                value={settings.shortBreakDuration}
                onValueChange={handleShortBreakDurationChange}
                minimumTrackTintColor={colors.info}
                maximumTrackTintColor={colors.lightGray}
                thumbTintColor={colors.info}
              />
              <Text style={styles.settingValue}>{settings.shortBreakDuration} min</Text>
            </View>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Feather name="battery-charging" size={18} color={colors.success} />
              <Text style={styles.settingLabel}>Long Break</Text>
            </View>
            <View style={styles.settingControl}>
              <Slider
                style={styles.slider}
                minimumValue={5}
                maximumValue={30}
                step={5}
                value={settings.longBreakDuration}
                onValueChange={handleLongBreakDurationChange}
                minimumTrackTintColor={colors.success}
                maximumTrackTintColor={colors.lightGray}
                thumbTintColor={colors.success}
              />
              <Text style={styles.settingValue}>{settings.longBreakDuration} min</Text>
            </View>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Feather name="repeat" size={18} color={colors.secondary} />
              <Text style={styles.settingLabel}>Sessions before long break</Text>
            </View>
            <View style={styles.settingControl}>
              <Slider
                style={styles.slider}
                minimumValue={2}
                maximumValue={6}
                step={1}
                value={settings.sessionsBeforeLongBreak}
                onValueChange={handleSessionsChange}
                minimumTrackTintColor={colors.secondary}
                maximumTrackTintColor={colors.lightGray}
                thumbTintColor={colors.secondary}
              />
              <Text style={styles.settingValue}>{settings.sessionsBeforeLongBreak}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Focus Tips</Text>
          
          <View style={styles.tipCard}>
            <View style={styles.tipIconContainer}>
              <Feather name="zap" size={24} color={colors.white} />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>The Pomodoro Technique</Text>
              <Text style={styles.tipText}>
                Work for 25 minutes, then take a 5-minute break. After 4 cycles, take a longer 15-30 minute break.
              </Text>
            </View>
          </View>
          
          <View style={styles.tipCard}>
            <View style={[styles.tipIconContainer, { backgroundColor: colors.secondary }]}>
              <Feather name="smartphone" size={24} color={colors.white} />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Eliminate Distractions</Text>
              <Text style={styles.tipText}>
                Put your phone on silent mode and close unnecessary apps and browser tabs.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
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
  content: {
    flex: 1,
  },
  timerSection: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  settingsSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.semiBold as any,
    color: colors.text,
    marginBottom: spacing.md,
  },
  settingItem: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  settingLabel: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.medium as any,
    color: colors.text,
    marginLeft: spacing.xs,
  },
  settingControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
    height: 40,
  },
  settingValue: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.semiBold as any,
    color: colors.text,
    width: 60,
    textAlign: 'right',
  },
  tipsSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tipIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.semiBold as any,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  tipText: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes.sm,
    color: colors.textLight,
    lineHeight: 20,
  },
});