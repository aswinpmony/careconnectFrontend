import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import BASE_URL from "../Config/api";
import ScreenWrapper from "../Constants/ScreenWrapper";

const ProfileScreen = ({ navigation }) => {
  // Initialize with empty object instead of null to prevent undefined errors
  const [userData, setUserData] = useState({});
  console.log("userData:", userData);
  const [healthLogs, setHealthLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasValidData, setHasValidData] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  // Add useEffect to monitor userData changes
  useEffect(() => {}, [userData, hasValidData]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      setHasValidData(false);
      setUserData({}); // Reset to empty object

      const storedUserId = await AsyncStorage.getItem("userID");

      if (
        !storedUserId ||
        storedUserId === "null" ||
        storedUserId === "undefined"
      ) {
        setError("Please log in again to view your profile.");
        return;
      }

      // Make API calls with timeout
      const timeout = 10000; // 10 seconds

      const userPromise = axios.get(
        `${BASE_URL}/api/auth/get-profile-data/${storedUserId}`,
        { timeout }
      );

      const healthPromise = axios.get(
        `${BASE_URL}/api/auth/get-health-logs/${storedUserId}`,
        { timeout }
      );

      const [userRes, healthRes] = await Promise.all([
        userPromise,
        healthPromise,
      ]);

      // Validate and set user data
      if (
        userRes.data &&
        userRes.data.userData &&
        typeof userRes.data.userData === "object"
      ) {
        const userData = userRes.data.userData;

        // Ensure all expected properties exist with defaults
        const safeUserData = {
          id: userData.id || "",
          fullName: userData.fullName || "Unknown User",
          email: userData.email || "No Email",
          phoneNumber: userData.phoneNumber || "N/A",
          gender: userData.gender || "N/A",
          dob: userData.dob || "N/A",
          address: userData.address || "N/A",
          role: userData.role || "User",
          emergencyContact: userData.emergencyContact || "N/A",
          healthIssues: userData.healthIssues || "None",
        };

        setUserData(safeUserData);
        setHasValidData(true);
      } else {
        console.error("Invalid user data structure:", userRes.data);
        setError("Invalid user data received from server");
        return;
      }

      // Handle health logs
      if (healthRes.data && Array.isArray(healthRes.data.healthLogs)) {
        setHealthLogs(healthRes.data.healthLogs);
      } else {
        setHealthLogs([]);
      }
    } catch (apiError) {
      console.error("=== API Error ===");
      console.error("Error type:", apiError.name);
      console.error("Error message:", apiError.message);

      setUserData({});
      setHasValidData(false);

      if (apiError.code === "ECONNABORTED") {
        setError("Request timeout. Please check your internet connection.");
      } else if (apiError.response) {
        console.error("Response error:", {
          status: apiError.response.status,
          data: apiError.response.data,
          headers: apiError.response.headers,
        });
        setError(
          `Server error (${apiError.response.status}): ${
            apiError.response.data?.message || "Unknown error"
          }`
        );
      } else if (apiError.request) {
        console.error("Network error - no response received");
        setError("Network error. Please check your internet connection.");
      } else {
        console.error("Request setup error:", apiError.message);
        setError("Failed to make request. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString || dateString === "N/A") return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  // Format health log details for display
  const formatHealthLogDetails = (log) => {
    if (!log || typeof log !== "object") return "No details available";

    const details = [];
    if (log.bloodPressure) details.push(`BP: ${log.bloodPressure}`);
    if (log.sugarLevel) details.push(`Sugar: ${log.sugarLevel}`);
    if (log.cholesterol) details.push(`Cholesterol: ${log.cholesterol}`);
    if (log.notes && log.notes.trim()) details.push(`Notes: ${log.notes}`);

    return details.length > 0 ? details.join(" | ") : "No details available";
  };

  // Loading state
  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#22c55e" />
          <Text style={styles.loadingText}>Loading Profile...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  // Error state
  if (error) {
    return (
      <ScreenWrapper>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchProfileData}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  // No valid data state
  if (!hasValidData || !userData || Object.keys(userData).length === 0) {
    return (
      <ScreenWrapper>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>No profile data available</Text>
          <Text style={styles.debugText}>
            Debug: hasValidData={hasValidData ? "true" : "false"}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchProfileData}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  // Main render with valid data
  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userData.fullName && userData.fullName.length > 0
                ? userData.fullName.charAt(0).toUpperCase()
                : "?"}
            </Text>
          </View>
          <Text style={styles.name}>{userData.fullName || "No Name"}</Text>
          <Text style={styles.email}>{userData.email || "No Email"}</Text>
          <Text style={styles.role}>{userData.role || "User"}</Text>
        </View>

        {/* User Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>User Information</Text>
          <Text style={styles.infoText}>
            Phone: {userData.phoneNumber || "N/A"}
          </Text>
          <Text style={styles.infoText}>
            Gender: {userData.gender || "N/A"}
          </Text>
          <Text style={styles.infoText}>
            Date of Birth: {userData.dob || "N/A"}
          </Text>
          <Text style={styles.infoText}>
            Address: {userData.address || "N/A"}
          </Text>
          <Text style={styles.infoText}>
            Emergency Contact: {userData.emergencyContact || "N/A"}
          </Text>
          <Text style={styles.infoText}>
            Health Issues: {userData.healthIssues || "None"}
          </Text>
        </View>

        {/* Health Log Section - Only for Elders */}
        {userData.role === "Elder" && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Health Log</Text>
            {!Array.isArray(healthLogs) || healthLogs.length === 0 ? (
              <Text style={styles.noLogs}>No health logs added yet</Text>
            ) : (
              healthLogs.map((log, index) => (
                <View key={log._id || `log-${index}`} style={styles.logItem}>
                  <Text style={styles.logDate}>{formatDate(log.date)}</Text>
                  <Text style={styles.logDetails}>
                    {formatHealthLogDetails(log)}
                  </Text>
                </View>
              ))
            )}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate("LogMyHealth")}
            >
              <Text style={styles.addButtonText}>+ Add Health Log</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: moderateScale(16),
    paddingBottom: verticalScale(30),
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: moderateScale(20),
  },
  loadingText: {
    marginTop: verticalScale(10),
    fontSize: moderateScale(16),
    color: "#666",
  },
  errorText: {
    fontSize: moderateScale(16),
    color: "#ef4444",
    marginBottom: verticalScale(16),
    textAlign: "center",
  },
  debugText: {
    fontSize: moderateScale(12),
    color: "#999",
    marginBottom: verticalScale(8),
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#22c55e",
    paddingHorizontal: moderateScale(20),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(6),
  },
  retryButtonText: {
    color: "#fff",
    fontSize: moderateScale(14),
    fontWeight: "600",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: verticalScale(20),
  },
  avatar: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
    backgroundColor: "#22c55e",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(8),
  },
  avatarText: {
    fontSize: moderateScale(32),
    color: "#fff",
    fontWeight: "bold",
  },
  name: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    color: "#1f2937",
  },
  email: {
    fontSize: moderateScale(14),
    color: "#6b7280",
    marginTop: verticalScale(4),
  },
  role: {
    fontSize: moderateScale(12),
    color: "#9ca3af",
    marginTop: verticalScale(2),
    textTransform: "capitalize",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(10),
    padding: moderateScale(14),
    marginBottom: verticalScale(16),
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  cardTitle: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    marginBottom: verticalScale(8),
    color: "#111827",
  },
  infoText: {
    fontSize: moderateScale(14),
    color: "#374151",
    marginBottom: verticalScale(4),
  },
  noLogs: {
    fontSize: moderateScale(14),
    color: "#6b7280",
    marginBottom: verticalScale(8),
  },
  logItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: verticalScale(6),
    marginBottom: verticalScale(4),
  },
  logDate: {
    fontSize: moderateScale(12),
    color: "#9ca3af",
    fontWeight: "500",
  },
  logDetails: {
    fontSize: moderateScale(14),
    color: "#374151",
    marginTop: verticalScale(2),
  },
  addButton: {
    marginTop: verticalScale(10),
    backgroundColor: "#22c55e",
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(6),
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: moderateScale(14),
    fontWeight: "600",
  },
});

export default ProfileScreen;
