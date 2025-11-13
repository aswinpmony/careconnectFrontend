import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { Phone, Video, MessageCircle, UserMinus } from "lucide-react-native";
import axios from "axios";
import BASE_URL from "../Config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenWrapper from "../Constants/ScreenWrapper";

const MyConnections = ({ navigation }) => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [error, setError] = useState(null);
  const [removingConnection, setRemovingConnection] = useState(null);

  useEffect(() => {
    getLoggedinUserId();
  }, []);

  const getLoggedinUserId = async () => {
    try {
      const userData = await AsyncStorage.getItem("userID");

      if (userData) {
        setLoggedInUserId(userData);
        fetchConnections(userData);
      } else {
        setError("User ID not found. Please log in again.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Error getting logged in user", err);
      setError("Failed to load user data");
      setLoading(false);
    }
  };

  const fetchConnections = async (userId) => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${BASE_URL}/api/auth/linked-users/${userId}`,
        { timeout: 10000 }
      );
      setConnections(response.data || []);
    } catch (err) {
      console.error("Error fetching connections", err);
      if (err.response) {
        setError(
          `Server error: ${err.response.data?.message || "Unknown error"}`
        );
      } else if (err.request) {
        setError("Network error. Please check your connection.");
      } else {
        setError("Failed to load connections. Please try again.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    if (loggedInUserId) {
      setRefreshing(true);
      fetchConnections(loggedInUserId);
    }
  };

  const handleRemoveConnection = (connectionId, fullName) => {
    Alert.alert(
      "Remove Connection",
      `Are you sure you want to remove ${fullName} from your connections?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeConnection(connectionId, fullName),
        },
      ]
    );
  };
  const removeConnection = async (connectionId, fullName) => {
    try {
      setRemovingConnection(connectionId);

      const userData = await AsyncStorage.getItem("userID");
      if (!userData) {
        Alert.alert("Error", "User session expired. Please log in again.");
        return;
      }

      console.log("Removing connection:", { userId: userData, connectionId });

      // Make the API call
      const response = await axios.delete(
        `${BASE_URL}/api/auth/remove-connection`,
        {
          data: {
            userId: userData,
            connectionId: connectionId,
          },
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      console.log("Remove connection response:", response.data);

      // Remove from state without refetch
      setConnections((prev) =>
        prev.filter((conn) => conn._id !== connectionId)
      );

      Alert.alert(
        "Success",
        `${fullName} has been removed from your connections.`
      );
    } catch (err) {
      console.error("Error removing connection:", err);

      let errorMessage = "Failed to remove connection. Please try again.";

      if (err.response) {
        // Server responded with error
        console.error("Server error:", err.response.data);
        errorMessage = err.response.data.message || errorMessage;
      } else if (err.request) {
        // Request made but no response
        console.error("Network error:", err.request);
        errorMessage = "Network error. Please check your connection.";
      } else {
        // Something else went wrong
        console.error("Error details:", err.message);
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setRemovingConnection(null);
    }
  };

  const handleCall = (phoneNumber, name) => {
    if (phoneNumber) {
      Alert.alert("Call", `Call ${name}?`, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Call",
          onPress: () => {
            // Implement phone call functionality
            // You can use Linking.openURL(`tel:${phoneNumber}`) here
          },
        },
      ]);
    } else {
      Alert.alert("No Phone Number", `${name} hasn't provided a phone number.`);
    }
  };

  const handleVideoCall = (connectionId, name) => {
    Alert.alert("Video Call", `Start video call with ${name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Call",
        onPress: () => {
          // Navigate to video call screen or implement video call
        },
      },
    ]);
  };

  const handleMessage = (connectionId, name) => {
    // Navigate to chat screen
    navigation.navigate("ChatScreen", {
      connectionId,
      connectionName: name,
    });
  };

  const renderConnectionItem = ({ item }) => {
    const fullName = item.fullName || "Unknown User";
    const email = item.email || "No Email";
    const phoneNumber = item.phoneNumber || null;
    const userRole = item.userRole || item.role || "User"; // Handle both field names
    const isRemoving = removingConnection === item._id;

    return (
      <View style={styles.connectionCard}>
        <View style={styles.connectionHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {fullName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.connectionInfo}>
            <Text style={styles.connectionName}>{fullName}</Text>
            <Text style={styles.connectionEmail}>{email}</Text>
            <Text style={styles.connectionRole}>{userRole}</Text>
            {phoneNumber && (
              <Text style={styles.connectionPhone}>{phoneNumber}</Text>
            )}
          </View>
          <TouchableOpacity
            style={[styles.removeButton, isRemoving && styles.disabledButton]}
            onPress={() => handleRemoveConnection(item._id, fullName)}
            disabled={isRemoving}
          >
            {isRemoving ? (
              <ActivityIndicator size="small" color="#ef4444" />
            ) : (
              <UserMinus size={moderateScale(20)} color="#ef4444" />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleCall(phoneNumber, fullName)}
          >
            <Phone size={moderateScale(20)} color="#22c55e" />
            <Text style={styles.actionButtonText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleVideoCall(item._id, fullName)}
          >
            <Video size={moderateScale(20)} color="#3b82f6" />
            <Text style={styles.actionButtonText}>Video</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleMessage(item._id, fullName)}
          >
            <MessageCircle size={moderateScale(20)} color="#8b5cf6" />
            <Text style={styles.actionButtonText}>Message</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Connections Yet</Text>
      <Text style={styles.emptySubtitle}>
        You haven't connected with anyone yet. Send connection requests to get
        started!
      </Text>
      <TouchableOpacity
        style={styles.findConnectionsButton}
        onPress={() =>
          navigation.navigate("UserSearchScreen", { userRole: "CareGiver" })
        }
      >
        <Text style={styles.findConnectionsButtonText}>Find Caregivers</Text>
      </TouchableOpacity>
    </View>
  );

  const LoadingState = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color="#22c55e" />
      <Text style={styles.loadingText}>Loading connections...</Text>
    </View>
  );

  const ErrorState = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => fetchConnections(loggedInUserId)}
      >
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenWrapper noScrollView={true} style={styles.screenWrapper}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Connections</Text>
        <Text style={styles.headerSubtitle}>
          {connections.length} connection{connections.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState />
      ) : (
        <FlatList
          data={connections}
          keyExtractor={(item) => item._id}
          renderItem={renderConnectionItem}
          ListEmptyComponent={EmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#22c55e"]}
              tintColor="#22c55e"
            />
          }
          contentContainerStyle={
            connections.length === 0
              ? styles.emptyListContainer
              : styles.listContainer
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    paddingHorizontal: 0,
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
  listContainer: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: verticalScale(20),
  },
  emptyListContainer: {
    flex: 1,
    paddingHorizontal: moderateScale(16),
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: moderateScale(20),
  },
  loadingText: {
    marginTop: verticalScale(12),
    fontSize: moderateScale(16),
    color: "#666",
  },
  errorText: {
    color: "#ef4444",
    fontSize: moderateScale(16),
    textAlign: "center",
    marginBottom: verticalScale(16),
    lineHeight: moderateScale(22),
  },
  retryButton: {
    backgroundColor: "#22c55e",
    paddingHorizontal: moderateScale(20),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(8),
  },
  retryButtonText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: moderateScale(20),
  },
  emptyTitle: {
    fontSize: moderateScale(22),
    fontWeight: "bold",
    color: "#333",
    marginBottom: verticalScale(12),
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: moderateScale(16),
    color: "#666",
    textAlign: "center",
    lineHeight: moderateScale(22),
    marginBottom: verticalScale(24),
  },
  findConnectionsButton: {
    backgroundColor: "#22c55e",
    paddingHorizontal: moderateScale(24),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(8),
  },
  findConnectionsButtonText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontWeight: "600",
  },
  connectionCard: {
    backgroundColor: "#fff",
    marginBottom: verticalScale(12),
    paddingVertical: verticalScale(16),
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(12),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  connectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(16),
  },
  avatar: {
    width: moderateScale(50),
    height: moderateScale(50),
    backgroundColor: "#22c55e",
    borderRadius: moderateScale(25),
    justifyContent: "center",
    alignItems: "center",
    marginRight: moderateScale(12),
  },
  avatarText: {
    color: "#fff",
    fontSize: moderateScale(20),
    fontWeight: "bold",
  },
  connectionInfo: {
    flex: 1,
  },
  connectionName: {
    fontSize: moderateScale(18),
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: verticalScale(2),
  },
  connectionEmail: {
    fontSize: moderateScale(14),
    color: "#6b7280",
    marginBottom: verticalScale(2),
  },
  connectionRole: {
    fontSize: moderateScale(12),
    color: "#9ca3af",
    textTransform: "capitalize",
    marginBottom: verticalScale(2),
  },
  connectionPhone: {
    fontSize: moderateScale(12),
    color: "#22c55e",
    fontWeight: "500",
  },
  removeButton: {
    padding: moderateScale(8),
  },
  disabledButton: {
    opacity: 0.6,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: verticalScale(12),
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  actionButton: {
    alignItems: "center",
    paddingVertical: verticalScale(8),
    paddingHorizontal: moderateScale(16),
  },
  actionButtonText: {
    fontSize: moderateScale(12),
    color: "#6b7280",
    marginTop: verticalScale(4),
    fontWeight: "500",
  },
});

export default MyConnections;
