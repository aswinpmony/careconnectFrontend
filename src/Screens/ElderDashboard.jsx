import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import {
  Heart,
  Pill,
  Calendar,
  Phone,
  Check,
  Users,
  Plus,
  Menu,
  User,
  Bell,
  UserCheck,
  Settings,
  X,
  LogOut,
} from "lucide-react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import ScreenWrapper from "../Constants/ScreenWrapper";
import { CommonActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";

const ElderDashboard = ({ navigation }) => {
  const route = useRoute();
  const { userDetails } = route.params;
  const [currentScreen, setCurrentScreen] = useState("home");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [pendingRequests] = useState(3); // Mock pending requests count

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

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const navigateFromDrawer = (screenName, params = {}) => {
    closeDrawer();
    navigation.navigate(screenName, params);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userDetails");

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Login" }],
        })
      );
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  };

  const DrawerContent = () => (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <TouchableOpacity style={styles.closeButton} onPress={closeDrawer}>
          <X size={moderateScale(24)} color="#666" />
        </TouchableOpacity>
        <View style={styles.profileSection}>
          <View style={styles.profileAvatar}>
            <User size={moderateScale(40)} color="#22c55e" />
          </View>
          <Text style={styles.profileName}>{userDetails.fullName}</Text>
          <Text style={styles.profileRole}>{userDetails.role}</Text>
        </View>
      </View>

      <View style={styles.drawerMenu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateFromDrawer("MyProfile")}
        >
          <User size={moderateScale(24)} color="#666" />
          <Text style={styles.menuText}>My Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            navigateFromDrawer("PendingRequestsScreen", {
              userRole: "CareGiver",
            })
          }
        >
          <View style={styles.menuIconContainer}>
            <Bell size={moderateScale(24)} color="#666" />
            {pendingRequests > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{pendingRequests}</Text>
              </View>
            )}
          </View>
          <Text style={styles.menuText}>Pending Requests</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateFromDrawer("MyConnections")}
        >
          <UserCheck size={moderateScale(24)} color="#666" />
          <Text style={styles.menuText}>My Connections</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            navigateFromDrawer("UserSearchScreen", {
              userRole: "CareGiver",
            })
          }
        >
          <Users size={moderateScale(24)} color="#666" />
          <Text style={styles.menuText}>Find Caregivers</Text>
        </TouchableOpacity>

        <View style={styles.menuSeparator} />

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateFromDrawer("Settings")}
        >
          <Settings size={moderateScale(24)} color="#666" />
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <LogOut size={moderateScale(24)} color="#666" />
          <Text style={styles.menuText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const HomeScreen = () => (
    <ScreenWrapper>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.menuButton} onPress={toggleDrawer}>
            <Menu size={moderateScale(24)} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Welcome Back!</Text>
            <Text style={styles.headerSubtitle}>{userDetails.fullName}</Text>
            <Text style={styles.headerDate}>Wednesday, July 30, 2025</Text>
          </View>

          <TouchableOpacity
            style={styles.connectionButton}
            onPress={() =>
              navigation.navigate("UserSearchScreen", { userRole: "CareGiver" })
            }
          >
            <View style={styles.connectionIconContainer}>
              <Users size={moderateScale(20)} color="#22c55e" />
              <View style={styles.plusIcon}>
                <Plus size={moderateScale(12)} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
        </View>
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

  return (
    <View style={styles.screen}>
      {renderCurrentScreen()}

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={closeDrawer}
        >
          <View style={styles.drawer}>
            <DrawerContent />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
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
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  menuButton: {
    padding: moderateScale(8),
    marginRight: moderateScale(12),
  },
  headerContent: {
    flex: 1,
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
  connectionButton: {
    marginLeft: moderateScale(16),
  },
  connectionIconContainer: {
    backgroundColor: "#fff",
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  plusIcon: {
    position: "absolute",
    top: moderateScale(-2),
    right: moderateScale(-2),
    backgroundColor: "#22c55e",
    width: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(10),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },

  // Drawer Styles
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  drawer: {
    width: "80%",
    height: "100%",
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  drawerContainer: {
    flex: 1,
  },
  drawerHeader: {
    backgroundColor: "#22c55e",
    paddingTop: verticalScale(50),
    paddingBottom: verticalScale(30),
    paddingHorizontal: scale(20),
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: verticalScale(50),
    right: scale(20),
    zIndex: 1,
  },
  profileSection: {
    alignItems: "center",
    marginTop: verticalScale(10),
  },
  profileAvatar: {
    backgroundColor: "#fff",
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(12),
  },
  profileName: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    color: "#fff",
    marginBottom: verticalScale(4),
  },
  profileRole: {
    fontSize: moderateScale(16),
    color: "#fff",
    opacity: 0.9,
  },
  drawerMenu: {
    flex: 1,
    paddingTop: verticalScale(30),
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(20),
  },
  menuIconContainer: {
    position: "relative",
  },
  menuText: {
    fontSize: moderateScale(18),
    color: "#333",
    marginLeft: scale(16),
    fontWeight: "500",
  },
  badge: {
    position: "absolute",
    top: moderateScale(-8),
    right: moderateScale(-8),
    backgroundColor: "#ef4444",
    borderRadius: moderateScale(10),
    minWidth: moderateScale(20),
    height: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: moderateScale(12),
    fontWeight: "bold",
  },
  menuSeparator: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: verticalScale(16),
    marginHorizontal: scale(20),
  },

  // Existing styles remain the same
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
