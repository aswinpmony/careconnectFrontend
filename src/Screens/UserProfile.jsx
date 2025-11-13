import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import BASE_URL from "../Config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import ScreenWrapper from "../Constants/ScreenWrapper";

const UserProfile = ({ route }) => {
  const { user } = route.params;
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    const getUserId = async () => {
      const id = await AsyncStorage.getItem("userID");
      if (id) setLoggedInUserId(id);
    };

    getUserId();
  }, []);
  const handleSendRequest = async () => {
    if (!loggedInUserId) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/auth/send-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromUserId: loggedInUserId,
          toUserId: user._id,
        }),
      });

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        const errorText = await response.text();

        Alert.alert("Error", errorText || "Something went wrong");
        return;
      }

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();

        setRequestSent(true); // ✅ update state
        Alert.alert("Success", "Connection request sent!");
      } else {
        const text = await response.text();
        console.warn("Non-JSON response received:", text);
      }
    } catch (error) {
      console.error("Error sending request:", error);
      Alert.alert("Error", "Failed to send request");
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.card}>
        <View style={styles.avatarContainer}>
          <View style={styles.placeholderAvatar}>
            <Text style={styles.avatarText}>
              {user.fullName?.charAt(0)?.toUpperCase() || "?"}
            </Text>
          </View>
        </View>

        <Text style={styles.name}>{user.fullName || "No Name"}</Text>

        <View style={styles.detailsContainer}>
          <DetailItem label="Email" value={user.email} />
          <DetailItem label="Phone" value={user.phoneNumber} />
          <DetailItem label="Role" value={user.role} />
          {/* Add more fields as needed */}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, requestSent && { backgroundColor: "#FF3B30" }]}
        onPress={handleSendRequest}
        disabled={requestSent} // Optional: prevent re-click
      >
        <Text style={styles.buttonText}>
          {requestSent ? "Request Sent" : "Send Request"}
        </Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

const DetailItem = ({ label, value }) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value || "N/A"}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f0f4f8",
    alignItems: "center",
    flexGrow: 1,
  },
  card: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 30,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    resizeMode: "cover",
  },
  placeholderAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#a0aec0",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 40,
    color: "#fff",
    fontWeight: "bold",
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2d3748",
    marginBottom: 15,
  },
  detailsContainer: {
    width: "100%",
  },
  detailItem: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: "#718096",
  },
  detailValue: {
    fontSize: 16,
    color: "#2d3748",
    fontWeight: "500",
    marginTop: 2,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default UserProfile;
