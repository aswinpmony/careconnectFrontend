import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  AlertCircle,
  Save,
  LogOut,
  Lock,
  Edit3,
} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenWrapper from "../Constants/ScreenWrapper";
import apiClient from "../Config/apiClient";


const Settings = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userId, setUserId] = useState(null);

  // User data states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [healthIssues, setHealthIssues] = useState("");
  const [role, setRole] = useState("");

  // Original data for cancel functionality
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    fetchUserData();
  }, []);
  const fetchUserData = async () => {
    try {
      setLoading(true);

      const userIdFromStorage = await AsyncStorage.getItem("userID");

      if (!userIdFromStorage) {
        Alert.alert("Error", "Session expired. Please log in again.");
        navigation.replace("Login");
        return;
      }

      setUserId(userIdFromStorage);

      const response = await apiClient.get(
        `/api/auth/get-profile-data/${userIdFromStorage}`,
        { timeout: 10000 }
      );

      const userData = response.data.userData;

      // Set all fields
      setFullName(userData.fullName || "");
      setEmail(userData.email || "");
      setPhoneNumber(userData.phoneNumber || "");
      setLocation(userData.address || "");
      setDateOfBirth(userData.dob || "");
      setGender(userData.gender || "");
      setEmergencyContact(userData.emergencyContact || "");
      setHealthIssues(userData.healthIssues || "");
      setRole(userData.role || "");

      // Store original data
      setOriginalData({
        fullName: userData.fullName || "",
        phoneNumber: userData.phoneNumber || "",
        location: userData.address || "",
        emergencyContact: userData.emergencyContact || "",
        healthIssues: userData.healthIssues || "",
      });
    } catch (err) {
      console.error("Error fetching user data:", err);
      Alert.alert("Error", "Failed to load profile data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validation
    if (!fullName.trim()) {
      Alert.alert("Validation Error", "Full name is required");
      return;
    }

    if (!phoneNumber.trim() || phoneNumber.length < 10) {
      Alert.alert("Validation Error", "Please enter a valid phone number");
      return;
    }

    try {
      setSaving(true);

      const updateData = {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        location: location.trim(),
        emergencyContact: emergencyContact.trim(),
        healthIssues: healthIssues.trim(),
      };

      const response = await apiClient.put(
        `/api/auth/update-profile/${userId}`,
        updateData,
        { timeout: 10000 }
      );

      if (response.status === 200) {
        // Update original data
        setOriginalData(updateData);
        setEditMode(false);
        Alert.alert("Success", "Profile updated successfully!");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      let errorMessage = "Failed to update profile. Please try again.";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.request) {
        errorMessage = "Network error. Please check your connection.";
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Restore original data
    setFullName(originalData.fullName);
    setPhoneNumber(originalData.phoneNumber);
    setLocation(originalData.location);
    setEmergencyContact(originalData.emergencyContact);
    setHealthIssues(originalData.healthIssues);
    setEditMode(false);
  };

  const handleChangePassword = () => {
    navigation.navigate("ChangePassword");
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.multiRemove(["userID", "userToken", "userData"]);
            navigation.replace("Login");
          } catch (err) {
            console.error("Logout error:", err);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <ScreenWrapper noScrollView={true}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#22c55e" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper noScrollView={true} style={styles.screenWrapper}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Manage your account</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Profile Information</Text>
              {!editMode && (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setEditMode(true)}
                >
                  <Edit3 size={moderateScale(18)} color="#22c55e" />
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Full Name */}
            <View style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <User size={moderateScale(20)} color="#6b7280" />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={[styles.input, !editMode && styles.inputDisabled]}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter your full name"
                  editable={editMode}
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            {/* Email (Non-editable) */}
            <View style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <Mail size={moderateScale(20)} color="#6b7280" />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={[styles.input, styles.inputDisabled]}
                  value={email}
                  editable={false}
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            {/* Phone Number */}
            <View style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <Phone size={moderateScale(20)} color="#6b7280" />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={[styles.input, !editMode && styles.inputDisabled]}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                  editable={editMode}
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            {/* Location */}
            <View style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <MapPin size={moderateScale(20)} color="#6b7280" />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Location</Text>
                <TextInput
                  style={[styles.input, !editMode && styles.inputDisabled]}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Enter your location"
                  editable={editMode}
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            {/* Date of Birth (Non-editable) */}
            <View style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <Calendar size={moderateScale(20)} color="#6b7280" />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Date of Birth</Text>
                <TextInput
                  style={[styles.input, styles.inputDisabled]}
                  value={dateOfBirth}
                  editable={false}
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            {/* Gender (Non-editable) */}
            <View style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <User size={moderateScale(20)} color="#6b7280" />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Gender</Text>
                <TextInput
                  style={[styles.input, styles.inputDisabled]}
                  value={gender}
                  editable={false}
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            {/* Role (Non-editable) */}
            <View style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <User size={moderateScale(20)} color="#6b7280" />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Role</Text>
                <TextInput
                  style={[styles.input, styles.inputDisabled]}
                  value={role}
                  editable={false}
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            {/* Emergency Contact */}
            <View style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <AlertCircle size={moderateScale(20)} color="#6b7280" />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Emergency Contact</Text>
                <TextInput
                  style={[styles.input, !editMode && styles.inputDisabled]}
                  value={emergencyContact}
                  onChangeText={setEmergencyContact}
                  placeholder="Enter emergency contact"
                  keyboardType="phone-pad"
                  editable={editMode}
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            {/* Health Issues */}
            <View style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <Heart size={moderateScale(20)} color="#6b7280" />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Health Issues</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    !editMode && styles.inputDisabled,
                  ]}
                  value={healthIssues}
                  onChangeText={setHealthIssues}
                  placeholder="Enter any health issues"
                  multiline
                  numberOfLines={3}
                  editable={editMode}
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          {editMode ? (
            <View style={styles.editActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
                disabled={saving}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveButton, saving && styles.disabledButton]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Save size={moderateScale(18)} color="#fff" />
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account Actions</Text>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleChangePassword}
              >
                <Lock size={moderateScale(20)} color="#3b82f6" />
                <Text style={styles.actionButtonText}>Change Password</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.logoutButton]}
                onPress={handleLogout}
              >
                <LogOut size={moderateScale(20)} color="#ef4444" />
                <Text style={[styles.actionButtonText, styles.logoutText]}>
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    paddingHorizontal: 0,
  },
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: verticalScale(12),
    fontSize: moderateScale(16),
    color: "#666",
  },
  header: {
    backgroundColor: "#22c55e",
    paddingVertical: verticalScale(20),
    paddingHorizontal: moderateScale(16),
    marginBottom: verticalScale(12),
  },
  headerTitle: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: moderateScale(16),
    color: "#fff",
    opacity: 0.9,
    marginTop: verticalScale(4),
  },
  scrollContent: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: verticalScale(24),
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    marginBottom: verticalScale(16),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(16),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: "600",
    color: "#1f2937",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(6),
    backgroundColor: "#f0fdf4",
    borderRadius: moderateScale(8),
  },
  editButtonText: {
    fontSize: moderateScale(14),
    color: "#22c55e",
    fontWeight: "600",
    marginLeft: moderateScale(4),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: verticalScale(16),
    backgroundColor: "#f9fafb",
    borderRadius: moderateScale(10),
    padding: moderateScale(12),
  },
  inputIconContainer: {
    marginRight: moderateScale(12),
    marginTop: verticalScale(8),
  },
  inputWrapper: {
    flex: 1,
  },
  inputLabel: {
    fontSize: moderateScale(12),
    color: "#6b7280",
    marginBottom: verticalScale(4),
    fontWeight: "500",
  },
  input: {
    fontSize: moderateScale(15),
    color: "#1f2937",
    padding: 0,
  },
  inputDisabled: {
    color: "#9ca3af",
  },
  textArea: {
    minHeight: verticalScale(60),
    textAlignVertical: "top",
  },
  editActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: moderateScale(12),
    marginTop: verticalScale(8),
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(10),
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: moderateScale(16),
    fontWeight: "600",
    color: "#6b7280",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#22c55e",
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(10),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: moderateScale(8),
  },
  saveButtonText: {
    fontSize: moderateScale(16),
    fontWeight: "600",
    color: "#fff",
  },
  disabledButton: {
    opacity: 0.6,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(14),
    paddingHorizontal: moderateScale(16),
    backgroundColor: "#f9fafb",
    borderRadius: moderateScale(10),
    marginBottom: verticalScale(12),
  },
  actionButtonText: {
    fontSize: moderateScale(16),
    color: "#1f2937",
    marginLeft: moderateScale(12),
    fontWeight: "500",
  },
  logoutButton: {
    backgroundColor: "#fef2f2",
    marginBottom: 0,
  },
  logoutText: {
    color: "#ef4444",
  },
});

export default Settings;
