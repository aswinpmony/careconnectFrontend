import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";

// Import screens
import IntroScreen from "./src/Screens/IntroScreen";
import SignUp from "./src/Screens/SignUp";
import Login from "./src/Screens/Login";
import ElderDashboard from "./src/Screens/ElderDashboard";
import LogMyHealth from "./src/Components/LogMyHealth";
import MedicationsReminder from "./src/Components/MedicationsReminder";
import Appointment from "./src/Components/Appointment";
import CallFamily from "./src/Components/CallFamily";
import { SafeAreaProvider } from "react-native-safe-area-context";
import CareGiverDashboard from "./src/Screens/CaregiverDashboard";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator initialRouteName="Intro">
          <Stack.Screen
            name="Intro"
            component={IntroScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ElderDashboard"
            component={ElderDashboard}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LogMyHealth"
            component={LogMyHealth}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MedicationsReminder"
            component={MedicationsReminder}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Appointment"
            component={Appointment}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CallFamily"
            component={CallFamily}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CaregiverDashboard"
            component={CareGiverDashboard}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
