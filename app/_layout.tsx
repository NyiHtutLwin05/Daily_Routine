import React from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar, Platform } from 'react-native';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';
import { colors } from '../constants/colors';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded] = useFonts({
        Inter: require('../assets/fonts/SpaceMono-Regular.ttf'),
        Montserrat: require('../assets/fonts/SpaceMono-Regular.ttf'),
        Poppins: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <SafeAreaProvider>
            {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
            {Platform.OS !== 'web' && Platform.OS !== 'ios' && <StatusBar hidden />}
            <Stack 
                screenOptions={{ 
                    headerShown: false,
                    contentStyle: { backgroundColor: colors.background }
                }}
            >
                <Stack.Screen
                    name="(onboarding)"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="task/[id]"
                    options={{ 
                        headerShown: true,
                        headerTitle: "Task Details",
                        headerStyle: { backgroundColor: colors.background },
                        headerTintColor: colors.primary,
                        presentation: 'modal'
                    }}
                />
                <Stack.Screen
                    name="task/create"
                    options={{ 
                        headerShown: true,
                        headerTitle: "Create Task",
                        headerStyle: { backgroundColor: colors.background },
                        headerTintColor: colors.primary,
                        presentation: 'modal'
                    }}
                />
                <Stack.Screen
                    name="pomodoro"
                    options={{ 
                        headerShown: true,
                        headerTitle: "Pomodoro Timer",
                        headerStyle: { backgroundColor: colors.background },
                        headerTintColor: colors.primary,
                        presentation: 'modal'
                    }}
                />
                <Stack.Screen
                    name="+not-found"
                    options={{ headerShown: false }}
                />
            </Stack>
        </SafeAreaProvider>
    );
}