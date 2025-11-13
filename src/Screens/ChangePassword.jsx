import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react-native";
import axios from "axios";
import BASE_URL from "../Config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenWrapper from "../Constants/ScreenWrapper";

const ChangePassword = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Show/hide password states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateInputs = () => {
    if (!currentPassword.trim()) {
      Alert.alert("Validation Error", "Please enter your current password");
      return false;
    }

    if (!newPassword.trim()) {
      Alert.alert("Validation Error", "Please enter a new password");
      return false;
    }

    if (newPassword.length < 6) {
      Alert.alert(
        "Validation Error",
        "New password must be at least 6 characters long"
      );
      return false;
    }

    if (newPassword === currentPassword) {
      Alert.alert(
        "Validation Error",
        "New password must be different from current password"
      );
      return false;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match");
      return false;
    }

    return true;
  };

  const handleChangePassword = async () => {
    if (!validateInputs()) return;

    try {
      setLoading(true);

      const userId = await AsyncStorage.getItem("userID");
      if (!userId) {
        Alert.alert("Error", "Session expired. Please log in again.");
        navigation.replace("Login");
        return;
      }

      const response = await axios.put(
        `${BASE_URL}/api/auth/change-password/${userId}`,
        {
          currentPassword: currentPassword.trim(),
          newPassword: newPassword.trim(),
        },
        { timeout: 10000 }
      );

      if (response.status === 200) {
        Alert.alert(
          "Success",
          "Password changed successfully! Please log in again.",
          [
            {
              text: "OK",
              onPress: async () => {
                await AsyncStorage.multiRemove([
                  "userID",
                  "userToken",
                  "userData",
                ]);
                navigation.replace("Login");
              },
            },
          ]
        );
      }
    } catch (err) {
      console.error("Change password error:", err);

      let errorMessage = "Failed to change password. Please try again.";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.request) {
        errorMessage = "Network error. Please check your connection.";
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper noScrollView={true} style={styles.screenWrapper}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={moderateScale(24)} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Change Password</Text>
            <Text style={styles.headerSubtitle}>
              Update your account password
            </Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.formContainer}>
            {/* Current Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Current Password</Text>
              <View style={styles.passwordInputWrapper}>
                <Lock
                  size={moderateScale(20)}
                  color="#6b7280"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.passwordInput}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Enter current password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showCurrentPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  style={styles.eyeIcon}
                >
                  {showCurrentPassword ? (
                    <EyeOff size={moderateScale(20)} color="#6b7280" />
                  ) : (
                    <Eye size={moderateScale(20)} color="#6b7280" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* New Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>New Password</Text>
              <View style={styles.passwordInputWrapper}>
                <Lock
                  size={moderateScale(20)}
                  color="#6b7280"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.passwordInput}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showNewPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  style={styles.eyeIcon}
                >
                  {showNewPassword ? (
                    <EyeOff size={moderateScale(20)} color="#6b7280" />
                  ) : (
                    <Eye size={moderateScale(20)} color="#6b7280" />
                  )}
                </TouchableOpacity>
              </View>
              <Text style={styles.hint}>
                Password must be at least 6 characters
              </Text>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm New Password</Text>
              <View style={styles.passwordInputWrapper}>
                <Lock
                  size={moderateScale(20)}
                  color="#6b7280"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.passwordInput}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Re-enter new password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={moderateScale(20)} color="#6b7280" />
                  ) : (
                    <Eye size={moderateScale(20)} color="#6b7280" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Password Requirements */}
            <View style={styles.requirementsContainer}>
              <Text style={styles.requirementsTitle}>
                Password Requirements:
              </Text>
              <Text style={styles.requirement}>
                • At least 6 characters long
              </Text>
              <Text style={styles.requirement}>
                • Different from current password
              </Text>
              <Text style={styles.requirement}>• Must match confirmation</Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.disabledButton]}
              onPress={handleChangePassword}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Change Password</Text>
              )}
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
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
  header: {
    backgroundColor: "#22c55e",
    paddingVertical: verticalScale(20),
    paddingHorizontal: moderateScale(16),
    marginBottom: verticalScale(12),
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: moderateScale(12),
    padding: moderateScale(4),
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: moderateScale(14),
    color: "#fff",
    opacity: 0.9,
    marginTop: verticalScale(4),
  },
  scrollContent: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: verticalScale(24),
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(12),
    padding: moderateScale(20),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  inputContainer: {
    marginBottom: verticalScale(20),
  },
  label: {
    fontSize: moderateScale(14),
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: verticalScale(8),
  },
  passwordInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(12),
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  inputIcon: {
    marginRight: moderateScale(8),
  },
  passwordInput: {
    flex: 1,
    fontSize: moderateScale(15),
    color: "#1f2937",
    paddingVertical: verticalScale(12),
  },
  eyeIcon: {
    padding: moderateScale(4),
  },
  hint: {
    fontSize: moderateScale(12),
    color: "#6b7280",
    marginTop: verticalScale(6),
    marginLeft: moderateScale(4),
  },
  requirementsContainer: {
    backgroundColor: "#f0fdf4",
    borderRadius: moderateScale(8),
    padding: moderateScale(12),
    marginBottom: verticalScale(20),
    borderLeftWidth: 3,
    borderLeftColor: "#22c55e",
  },
  requirementsTitle: {
    fontSize: moderateScale(13),
    fontWeight: "600",
    color: "#166534",
    marginBottom: verticalScale(6),
  },
  requirement: {
    fontSize: moderateScale(12),
    color: "#15803d",
    marginBottom: verticalScale(3),
  },
  submitButton: {
    backgroundColor: "#22c55e",
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(10),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(12),
  },
  submitButtonText: {
    fontSize: moderateScale(16),
    fontWeight: "600",
    color: "#fff",
  },
  disabledButton: {
    opacity: 0.6,
  },
  cancelButton: {
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
});

export default ChangePassword;
