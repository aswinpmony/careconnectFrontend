import React, { useState } from "react";
import axios from "axios";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import {
  Heart,
  User,
  Mail,
  Lock,
  Phone,
  ArrowLeft,
  UserCheck,
  MapPin,
  Calendar,
  Users,
  ChevronDown,
  X,
} from "lucide-react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import BASE_URL from "../Config/api";
import ScreenWrapper from "../Constants/ScreenWrapper";

const SignUp = ({ navigation }) => {
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    dateOfBirth: "",
    location: "",
    emergencyContact: "",
  });

  const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
    setShowGenderModal(false);
  };

  const formatDate = (text) => {
    // Auto-format date as DD/MM/YYYY
    const cleaned = text.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{0,2})(\d{0,2})(\d{0,4})$/);
    if (match) {
      let formatted = match[1];
      if (match[2]) formatted += "/" + match[2];
      if (match[3]) formatted += "/" + match[3];
      return formatted;
    }
    return text;
  };

  const handleDateChange = (text) => {
    const formatted = formatDate(text);
    handleInputChange("dateOfBirth", formatted);
  };

  const validateForm = () => {
    if (!selectedRole) {
      Alert.alert("Role Required", "Please select your role to continue");
      return false;
    }

    if (!formData.fullName.trim()) {
      Alert.alert("Missing Information", "Please enter your full name");
      return false;
    }

    if (!formData.email.trim()) {
      Alert.alert("Missing Information", "Please enter your email address");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address");
      return false;
    }

    if (!formData.password) {
      Alert.alert("Missing Information", "Please enter a password");
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert(
        "Weak Password",
        "Password must be at least 6 characters long"
      );
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match");
      return false;
    }

    if (!selectedGender) {
      Alert.alert("Missing Information", "Please select your gender");
      return false;
    }

    if (!formData.dateOfBirth.trim()) {
      Alert.alert("Missing Information", "Please enter your date of birth");
      return false;
    }

    if (!formData.phoneNumber.trim()) {
      Alert.alert("Missing Information", "Please enter your phone number");
      return false;
    }

    if (!formData.location.trim()) {
      Alert.alert("Missing Information", "Please enter your location");
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    const userData = {
      ...formData,
      role: selectedRole,
      gender: selectedGender,
    };

    try {
      const res = await axios.post(`${BASE_URL}/api/auth/register`, userData);
      if (res.status === 201 || res.data.success) {
        Alert.alert("Success", "Account created successfully", [
          {
            text: "OK",
            onPress: () => {
              if (selectedRole === "Elder") {
                console.log("Navigate to Elder Dashboard");
              } else {
                console.log("Navigate to CareGiver Setup");
              }
            },
          },
        ]);
      } else {
        Alert.alert("Error", "Something went wrong. Try again.");
      }
    } catch (error) {
      console.error("Signup Error:", error.message);
      Alert.alert("Error", error.response?.data?.message || "Signup failed");
    }
  };

  const GenderModal = () => (
    <Modal
      visible={showGenderModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowGenderModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Gender</Text>
            <TouchableOpacity
              onPress={() => setShowGenderModal(false)}
              style={styles.modalCloseButton}
            >
              <X size={scale(24)} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {genderOptions.map((gender, index) => (
            <TouchableOpacity
              key={index}
              style={styles.modalOption}
              onPress={() => handleGenderSelect(gender)}
            >
              <Text style={styles.modalOptionText}>{gender}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
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
          <Text style={styles.title}>Join CareConnect</Text>
        </View>

        <Text style={styles.subtitle}>Create your account to start caring</Text>
      </View>

      {/* Role Selection */}
      <View style={styles.roleSection}>
        <Text style={styles.sectionTitle}>I am a:</Text>

        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[
              styles.roleCard,
              selectedRole === "Elder" && styles.selectedRoleCard,
            ]}
            onPress={() => handleRoleSelection("Elder")}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.roleIcon,
                selectedRole === "Elder" && styles.selectedRoleIcon,
              ]}
            >
              <Text style={styles.roleEmoji}>👴</Text>
            </View>
            <Text
              style={[
                styles.roleTitle,
                selectedRole === "Elder" && styles.selectedRoleTitle,
              ]}
            >
              Elder
            </Text>
            <Text
              style={[
                styles.roleDescription,
                selectedRole === "Elder" && styles.selectedRoleDescription,
              ]}
            >
              Parent or elderly person who needs care monitoring
            </Text>
            {selectedRole === "Elder" && (
              <View style={styles.selectedIndicator}>
                <UserCheck size={scale(16)} color="white" />
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleCard,
              selectedRole === "CareGiver" && styles.selectedRoleCard,
            ]}
            onPress={() => handleRoleSelection("CareGiver")}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.roleIcon,
                selectedRole === "CareGiver" && styles.selectedRoleIcon,
              ]}
            >
              <Text style={styles.roleEmoji}>👩</Text>
            </View>
            <Text
              style={[
                styles.roleTitle,
                selectedRole === "CareGiver" && styles.selectedRoleTitle,
              ]}
            >
              CareGiver
            </Text>
            <Text
              style={[
                styles.roleDescription,
                selectedRole === "CareGiver" && styles.selectedRoleDescription,
              ]}
            >
              Son, daughter, or relative monitoring parent's health
            </Text>
            {selectedRole === "CareGiver" && (
              <View style={styles.selectedIndicator}>
                <UserCheck size={scale(16)} color="white" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Form Section */}
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Personal Information</Text>

        {/* Full Name */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <User size={scale(20)} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Full Name *"
              placeholderTextColor="#9CA3AF"
              value={formData.fullName}
              onChangeText={(value) => handleInputChange("fullName", value)}
            />
          </View>
        </View>

        {/* Email */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Mail size={scale(20)} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Email Address *"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(value) => handleInputChange("email", value)}
            />
          </View>
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Lock size={scale(20)} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Password *"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={formData.password}
              onChangeText={(value) => handleInputChange("password", value)}
            />
          </View>
        </View>

        {/* Confirm Password */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Lock size={scale(20)} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Confirm Password *"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={formData.confirmPassword}
              onChangeText={(value) =>
                handleInputChange("confirmPassword", value)
              }
            />
          </View>
        </View>

        {/* Gender Dropdown */}
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.inputWrapper}
            onPress={() => setShowGenderModal(true)}
          >
            <User size={scale(20)} color="#6B7280" style={styles.inputIcon} />
            <Text
              style={[
                styles.textInput,
                !selectedGender && styles.placeholderText,
              ]}
            >
              {selectedGender || "Select Gender *"}
            </Text>
            <ChevronDown size={scale(20)} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Date of Birth */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Calendar
              size={scale(20)}
              color="#6B7280"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Date of Birth (DD/MM/YYYY) *"
              placeholderTextColor="#9CA3AF"
              value={formData.dateOfBirth}
              onChangeText={handleDateChange}
              keyboardType="numeric"
              maxLength={10}
            />
          </View>
        </View>

        {/* Phone Number */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Phone size={scale(20)} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Phone Number *"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              value={formData.phoneNumber}
              onChangeText={(value) => handleInputChange("phoneNumber", value)}
            />
          </View>
        </View>

        {/* Location */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <MapPin size={scale(20)} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Location (City/Place) *"
              placeholderTextColor="#9CA3AF"
              value={formData.location}
              onChangeText={(value) => handleInputChange("location", value)}
            />
          </View>
        </View>

        {/* Emergency Contact */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Phone size={scale(20)} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Emergency Contact (Optional)"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              value={formData.emergencyContact}
              onChangeText={(value) =>
                handleInputChange("emergencyContact", value)
              }
            />
          </View>
        </View>

        {/* Health Issues - Only for Elder role */}
        {selectedRole === "Elder" && (
          <View style={styles.inputContainer}>
            <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
              <Heart
                size={scale(20)}
                color="#6B7280"
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Known Health Issues (e.g., BP, Sugar, Heart condition)"
                placeholderTextColor="#9CA3AF"
                multiline={true}
                numberOfLines={3}
                textAlignVertical="top"
                value={formData.healthIssues}
                onChangeText={(value) =>
                  handleInputChange("healthIssues", value)
                }
              />
            </View>
          </View>
        )}
      </View>

      {/* Role-specific Information */}
      {selectedRole && (
        <View style={styles.roleInfoSection}>
          <View style={styles.roleInfoCard}>
            <Text style={styles.roleInfoTitle}>
              {selectedRole === "Elder" ? "As an Elder:" : "As a CareGiver:"}
            </Text>
            <Text style={styles.roleInfoText}>
              {selectedRole === "Elder"
                ? "• Share your health data with family members\n• Receive medication reminders and health tips\n• Get emergency assistance when needed\n• Connect with your CareGivers easily"
                : "• Monitor your parent's vital signs and health data\n• Receive real-time health alerts and updates\n• Schedule medication reminders for your loved ones\n• Connect with healthcare providers when needed"}
            </Text>
          </View>
        </View>
      )}

      {/* Sign Up Button */}
      <View style={styles.buttonSection}>
        <TouchableOpacity
          style={[styles.signUpButton, !selectedRole && styles.disabledButton]}
          onPress={handleSignUp}
          activeOpacity={0.8}
          disabled={!selectedRole}
        >
          <Users
            color="white"
            size={scale(24)}
            style={{ marginRight: scale(12) }}
          />
          <Text style={styles.signUpButtonText}>Create Account</Text>
        </TouchableOpacity>

        <View style={styles.loginPrompt}>
          <Text style={styles.loginPromptText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>

      <GenderModal />
    </ScreenWrapper>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F9FF",
  },
  header: {
    paddingTop: verticalScale(50),
    paddingBottom: verticalScale(20),
    paddingHorizontal: scale(24),
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
    marginBottom: verticalScale(8),
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
    fontSize: moderateScale(26),
    fontWeight: "bold",
    color: "#1F2937",
  },
  subtitle: {
    fontSize: moderateScale(15),
    color: "#6B7280",
    textAlign: "center",
  },
  roleSection: {
    paddingHorizontal: scale(24),
    marginBottom: verticalScale(24),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: verticalScale(12),
  },
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  roleCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: scale(14),
    padding: scale(16),
    marginHorizontal: scale(4),
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedRoleCard: {
    borderColor: "#3B82F6",
    backgroundColor: "#EFF6FF",
  },
  roleIcon: {
    width: scale(50),
    height: scale(50),
    backgroundColor: "#F3F4F6",
    borderRadius: scale(25),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(10),
  },
  selectedRoleIcon: {
    backgroundColor: "#DBEAFE",
  },
  roleEmoji: {
    fontSize: moderateScale(20),
  },
  roleTitle: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: verticalScale(6),
  },
  selectedRoleTitle: {
    color: "#1D4ED8",
  },
  roleDescription: {
    fontSize: moderateScale(11),
    color: "#6B7280",
    textAlign: "center",
    lineHeight: moderateScale(16),
  },
  selectedRoleDescription: {
    color: "#3730A3",
  },
  selectedIndicator: {
    position: "absolute",
    top: scale(-6),
    right: scale(-6),
    backgroundColor: "#10B981",
    borderRadius: scale(12),
    padding: scale(6),
  },
  formSection: {
    paddingHorizontal: scale(24),
    marginBottom: verticalScale(20),
  },
  inputContainer: {
    marginBottom: verticalScale(14),
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: scale(12),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  textAreaWrapper: {
    alignItems: "flex-start",
    paddingVertical: verticalScale(12),
  },
  inputIcon: {
    marginRight: scale(12),
  },
  textInput: {
    flex: 1,
    fontSize: moderateScale(15),
    color: "#1F2937",
  },
  textArea: {
    minHeight: verticalScale(60),
    textAlignVertical: "top",
  },
  placeholderText: {
    color: "#9CA3AF",
  },
  roleInfoSection: {
    paddingHorizontal: scale(24),
    marginBottom: verticalScale(20),
  },
  roleInfoCard: {
    backgroundColor: "rgba(59, 130, 246, 0.08)",
    borderRadius: scale(12),
    padding: scale(16),
    borderLeftWidth: 4,
    borderLeftColor: "#3B82F6",
  },
  roleInfoTitle: {
    fontSize: moderateScale(15),
    fontWeight: "bold",
    color: "#1E40AF",
    marginBottom: verticalScale(8),
  },
  roleInfoText: {
    fontSize: moderateScale(13),
    color: "#1E3A8A",
    lineHeight: moderateScale(18),
  },
  buttonSection: {
    paddingHorizontal: scale(24),
    paddingBottom: verticalScale(30),
  },
  signUpButton: {
    flexDirection: "row",
    backgroundColor: "#10B981",
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(24),
    borderRadius: scale(14),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(16),
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
  signUpButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: moderateScale(16),
  },
  loginPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginPromptText: {
    fontSize: moderateScale(14),
    color: "#6B7280",
  },
  loginLink: {
    fontSize: moderateScale(14),
    color: "#3B82F6",
    fontWeight: "600",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: scale(16),
    padding: scale(20),
    width: "85%",
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(16),
    paddingBottom: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#1F2937",
  },
  modalCloseButton: {
    padding: scale(4),
  },
  modalOption: {
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalOptionText: {
    fontSize: moderateScale(16),
    color: "#374151",
  },
});
