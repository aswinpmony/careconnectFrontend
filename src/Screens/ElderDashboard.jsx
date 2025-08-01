import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  Heart,
  Pill,
  Calendar,
  Phone,
  Mic,
  Check,
  Plus,
} from "lucide-react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import ScreenWrapper from "../Constants/ScreenWrapper";

const ElderDashboard = ({ navigation }) => {
  const [currentScreen, setCurrentScreen] = useState("home");

  const emergencyCall = () => {
    Alert.alert(
      "Emergency",
      "Are you sure you want to call all family members and emergency contacts?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: () =>
            Alert.alert(
              "Calling",
              "Emergency call initiated. Calling all contacts..."
            ),
        },
      ]
    );
  };

  const logHealth = (type, value) => {
    if (!value || value.trim() === "") {
      Alert.alert("Error", "Please enter a value before logging.");
      return;
    }
    Alert.alert(
      "Success",
      `Your ${type} has been recorded and shared with your family.`
    );
    setHealthInputs({
      systolic: "",
      diastolic: "",
      bloodSugar: "",
      weight: "",
    });
  };

  const HomeScreen = () => (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome Back!</Text>
        <Text style={styles.headerSubtitle}>Mom</Text>
        <Text style={styles.headerDate}>Wednesday, July 30, 2025</Text>
      </View>

      <TouchableOpacity style={styles.emergencyButton} onPress={emergencyCall}>
        <Phone size={moderateScale(30)} color="#fff" />
        <Text style={styles.emergencyText}>EMERGENCY</Text>
        <Text style={styles.emergencySubText}>Tap to call family</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.safeButton}>
        <Check
          size={moderateScale(24)}
          color="#fff"
          style={{ marginRight: moderateScale(10) }}
        />
        <Text style={styles.safeButtonText}>I'm Safe Today</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cardGreen}
        onPress={() => navigation.navigate("LogMyHealth")}
      >
        <Heart
          size={moderateScale(40)}
          color="#16a34a"
          style={styles.cardIcon}
        />
        <Text style={styles.cardTitle}>Log My Health</Text>
        <Text style={styles.cardSubText}>Blood pressure, sugar, weight</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cardBlue}
        onPress={() => navigation.navigate("MedicationsReminder")}
      >
        <Pill
          size={moderateScale(40)}
          color="#3b82f6"
          style={styles.cardIcon}
        />
        <Text style={styles.cardTitle}>My Medications</Text>
        <Text style={styles.cardSubText}>Today's schedule & reminders</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cardOrange}
        onPress={() => navigation.navigate("Appointment")}
      >
        <Calendar
          size={moderateScale(40)}
          color="#f97316"
          style={styles.cardIcon}
        />
        <Text style={styles.cardTitle}>Appointments</Text>
        <Text style={styles.cardSubText}>Upcoming doctor visits</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cardPurple}
        onPress={() => navigation.navigate("CallFamily")}
      >
        <Phone
          size={moderateScale(40)}
          color="#8b5cf6"
          style={styles.cardIcon}
        />
        <Text style={styles.cardTitle}>Call Family</Text>
        <Text style={styles.cardSubText}>Video call with children</Text>
      </TouchableOpacity>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>Today's Summary</Text>
        <Text style={styles.summaryText}>✅ Morning medication taken</Text>
        <Text style={styles.summaryText}>⏰ 2 medications remaining</Text>
        <Text style={styles.summaryText}>❤️ Last health check: Yesterday</Text>
      </View>
    </ScreenWrapper>
  );

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "health":
        return <Text style={styles.placeholderText}>Health Screen Here</Text>;
      case "medications":
        return (
          <Text style={styles.placeholderText}>Medications Screen Here</Text>
        );
      case "appointments":
        return (
          <Text style={styles.placeholderText}>Appointments Screen Here</Text>
        );
      case "family":
        return <Text style={styles.placeholderText}>Family Screen Here</Text>;
      default:
        return <HomeScreen />;
    }
  };

  return <View style={styles.screen}>{renderCurrentScreen()}</View>;
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: scale(16),
  },
  header: {
    backgroundColor: "#22c55e",
    padding: verticalScale(24),
    borderBottomLeftRadius: moderateScale(30),
    borderBottomRightRadius: moderateScale(30),
    marginBottom: verticalScale(24),
  },
  headerTitle: {
    fontSize: moderateScale(20),
    color: "#fff",
    fontWeight: "600",
  },
  headerSubtitle: {
    fontSize: moderateScale(32),
    fontWeight: "bold",
    color: "#fff",
    marginTop: verticalScale(8),
  },
  headerDate: {
    fontSize: moderateScale(16),
    color: "#fff",
    opacity: 0.9,
    marginTop: verticalScale(4),
  },
  emergencyButton: {
    backgroundColor: "#ef4444",
    padding: verticalScale(24),
    borderRadius: moderateScale(20),
    alignItems: "center",
    marginBottom: verticalScale(16),
  },
  emergencyText: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    color: "#fff",
  },
  emergencySubText: {
    fontSize: moderateScale(14),
    color: "#fff",
    marginTop: verticalScale(4),
  },
  safeButton: {
    backgroundColor: "#22c55e",
    padding: verticalScale(16),
    borderRadius: moderateScale(12),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(16),
  },
  safeButtonText: {
    fontSize: moderateScale(18),
    color: "#fff",
    fontWeight: "600",
  },
  cardGreen: {
    backgroundColor: "#dcfce7",
    padding: verticalScale(24),
    borderRadius: moderateScale(20),
    marginBottom: verticalScale(16),
  },
  cardBlue: {
    backgroundColor: "#dbeafe",
    padding: verticalScale(24),
    borderRadius: moderateScale(20),
    marginBottom: verticalScale(16),
  },
  cardOrange: {
    backgroundColor: "#ffedd5",
    padding: verticalScale(24),
    borderRadius: moderateScale(20),
    marginBottom: verticalScale(16),
  },
  cardPurple: {
    backgroundColor: "#ede9fe",
    padding: verticalScale(24),
    borderRadius: moderateScale(20),
    marginBottom: verticalScale(16),
  },
  cardIcon: {
    alignSelf: "center",
    marginBottom: verticalScale(12),
  },
  cardTitle: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    textAlign: "center",
    color: "#1f2937",
  },
  cardSubText: {
    fontSize: moderateScale(14),
    textAlign: "center",
    color: "#6b7280",
    marginTop: verticalScale(4),
  },
  summaryBox: {
    backgroundColor: "#fff",
    padding: verticalScale(24),
    borderRadius: moderateScale(20),
    marginTop: verticalScale(24),
    elevation: 2,
  },
  summaryTitle: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: verticalScale(12),
  },
  summaryText: {
    fontSize: moderateScale(16),
    color: "#374151",
    marginBottom: verticalScale(4),
  },
  placeholderText: {
    fontSize: moderateScale(20),
    textAlign: "center",
    marginTop: verticalScale(40),
    color: "#9ca3af",
  },
});

export default ElderDashboard;
