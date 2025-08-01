import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Heart, Mail, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import axios from "axios";
import BASE_URL from "../Config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenWrapper from "../Constants/ScreenWrapper";

const Login = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: formData.email,
        password: formData.password,
      });

      await AsyncStorage.setItem("userID", response.data.user.id);

      // ✅ Direct navigation without Alert

      const userRole = response.data.user.role;

      if (userRole === "Elder") {
        navigation.navigate("ElderDashboard");
      } else {
        navigation.navigate("CaregiverDashboard");
      }
    } catch (error) {
      let errorMessage = "Login failed. Please try again.";

      if (error.response) {
        errorMessage =
          error.response.data.message ||
          error.response.data.error ||
          "Invalid email or password";
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }

      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Intro")}
        >
          <ArrowLeft size={scale(24)} color="#374151" />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Heart color="white" size={scale(28)} />
          </View>
          <Text style={styles.title}>Welcome Back</Text>
        </View>

        <Text style={styles.subtitle}>Sign in to continue caring</Text>
      </View>

      {/* Login Form */}
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Sign In</Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <View
            style={[styles.inputWrapper, errors.email && styles.inputError]}
          >
            <Mail size={scale(20)} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Email Address"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(value) => handleInputChange("email", value)}
              editable={!loading}
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <View
            style={[styles.inputWrapper, errors.password && styles.inputError]}
          >
            <Lock size={scale(20)} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              value={formData.password}
              onChangeText={(value) => handleInputChange("password", value)}
              editable={!loading}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              {showPassword ? (
                <EyeOff size={scale(20)} color="#6B7280" />
              ) : (
                <Eye size={scale(20)} color="#6B7280" />
              )}
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
        </View>

        {/* Forgot Password Link */}
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <View style={styles.buttonSection}>
        <TouchableOpacity
          style={[styles.loginButton, loading && styles.disabledButton]}
          onPress={handleLogin}
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator
              size="small"
              color="white"
              style={{ marginRight: scale(12) }}
            />
          ) : (
            <Heart
              color="white"
              size={scale(24)}
              style={{ marginRight: scale(12) }}
            />
          )}
          <Text style={styles.loginButtonText}>
            {loading ? "Signing In..." : "Sign In"}
          </Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View style={styles.signupPrompt}>
          <Text style={styles.signupPromptText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Help Section */}
      <View style={styles.helpSection}>
        <Text style={styles.helpTitle}>Need Help?</Text>
        <Text style={styles.helpText}>
          If you're having trouble signing in, contact our support team or try
          resetting your password.
        </Text>
      </View>
    </ScreenWrapper>
  );
};

export default Login;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F0F9FF",
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#F0F9FF",
  },
  header: {
    paddingTop: verticalScale(50),
    paddingBottom: verticalScale(32),
    paddingHorizontal: scale(20),
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: verticalScale(50),
    left: scale(24),
    padding: scale(8),
    zIndex: 1,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: verticalScale(12),
  },
  logo: {
    backgroundColor: "#3B82F6",
    padding: scale(12),
    borderRadius: 999,
    marginBottom: verticalScale(12),
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: moderateScale(28),
    fontWeight: "bold",
    color: "#1F2937",
  },
  subtitle: {
    fontSize: moderateScale(16),
    color: "#6B7280",
    textAlign: "center",
  },
  formSection: {
    paddingHorizontal: scale(24),
    marginBottom: verticalScale(32),
  },
  sectionTitle: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: verticalScale(24),
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: verticalScale(20),
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: scale(12),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  inputError: {
    borderColor: "#EF4444",
    borderWidth: 2,
  },
  inputIcon: {
    marginRight: scale(12),
  },
  textInput: {
    flex: 1,
    fontSize: moderateScale(16),
    color: "#1F2937",
  },
  eyeIcon: {
    padding: scale(4),
  },
  errorText: {
    color: "#EF4444",
    fontSize: moderateScale(12),
    marginTop: verticalScale(4),
    marginLeft: scale(16),
  },
  forgotPassword: {
    alignItems: "flex-end",
    marginTop: verticalScale(8),
  },
  forgotPasswordText: {
    color: "#3B82F6",
    fontSize: moderateScale(14),
    fontWeight: "500",
  },
  buttonSection: {
    paddingHorizontal: scale(24),
    marginBottom: verticalScale(32),
  },
  loginButton: {
    flexDirection: "row",
    backgroundColor: "#10B981",
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(24),
    borderRadius: scale(16),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(20),
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: "#9CA3AF",
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: moderateScale(18),
  },
  signupPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupPromptText: {
    fontSize: moderateScale(14),
    color: "#6B7280",
  },
  signupLink: {
    fontSize: moderateScale(14),
    color: "#3B82F6",
    fontWeight: "600",
  },
  helpSection: {
    paddingHorizontal: scale(24),
    paddingBottom: verticalScale(32),
    alignItems: "center",
  },
  helpTitle: {
    fontSize: moderateScale(16),
    fontWeight: "600",
    color: "#374151",
    marginBottom: verticalScale(8),
  },
  helpText: {
    fontSize: moderateScale(13),
    color: "#6B7280",
    textAlign: "center",
    lineHeight: moderateScale(18),
  },
});
