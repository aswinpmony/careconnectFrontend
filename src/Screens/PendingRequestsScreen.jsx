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
import axios from "axios";
import BASE_URL from "../Config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenWrapper from "../Constants/ScreenWrapper";

const PendingRequestsScreen = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [error, setError] = useState(null);
  const [processingRequests, setProcessingRequests] = useState(new Set());

  useEffect(() => {
    const getUserIdAndFetchRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const id = await AsyncStorage.getItem("userID");

        if (id) {
          setLoggedInUserId(id);
          await fetchPendingRequests(id);
        } else {
          setError("User ID not found. Please log in again.");
          setLoading(false);
        }
      } catch (error) {
        setError("Failed to retrieve user information.");
        setLoading(false);
      }
    };

    getUserIdAndFetchRequests();
  }, []);

  const fetchPendingRequests = async (userId = loggedInUserId) => {
    if (!userId) return;

    try {
      const response = await axios.get(
        `${BASE_URL}/api/auth/connection-requests/pending/${userId}`,
        { timeout: 10000 }
      );

      setPendingRequests(response.data || []);
      setError(null);
    } catch (error) {
      if (error.response) {
        setError(
          `Server error: ${error.response.data?.message || "Unknown error"}`
        );
      } else if (error.request) {
        setError("Network error. Please check your connection.");
      } else {
        setError("Failed to fetch pending requests.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const acceptRequest = async (requestId) => {
    if (!requestId) {
      Alert.alert("Error", "Invalid request ID");
      return;
    }

    try {
      setProcessingRequests((prev) => new Set(prev).add(requestId));

      const response = await axios.put(
        `${BASE_URL}/api/auth/respond-request`,
        { requestId, action: "accept" },
        { timeout: 10000 }
      );

      // Remove the accepted request from the list
      setPendingRequests((prev) => prev.filter((req) => req._id !== requestId));

      Alert.alert("Success", "Connection request accepted!");
    } catch (error) {
      let errorMessage = "Failed to accept request. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setProcessingRequests((prev) => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const rejectRequest = async (requestId) => {
    if (!requestId) {
      Alert.alert("Error", "Invalid request ID");
      return;
    }

    try {
      setProcessingRequests((prev) => new Set(prev).add(requestId));

      const response = await axios.put(
        `${BASE_URL}/api/auth/respond-request`,
        { requestId, action: "reject" },
        { timeout: 10000 }
      );

      // Remove the rejected request from the list
      setPendingRequests((prev) => prev.filter((req) => req._id !== requestId));

      Alert.alert("Success", "Connection request rejected!");
    } catch (error) {
      console.error("Error rejecting request:", error);
      let errorMessage = "Failed to reject request. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setProcessingRequests((prev) => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPendingRequests();
  };

  const handleAcceptRequest = (id, name) => {
    Alert.alert("Accept Request", `Accept connection request from ${name}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Accept", onPress: () => acceptRequest(id) },
    ]);
  };

  const handleIgnoreRequest = (id, name) => {
    Alert.alert("Ignore Request", `Ignore connection request from ${name}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Ignore", onPress: () => rejectRequest(id) },
    ]);
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return (
        date.toLocaleDateString() +
        " " +
        date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } catch (error) {
      return "Unknown date";
    }
  };

  const renderItem = ({ item }) => {
    const { fromUserId, sentAt } = item;
    const fullName = fromUserId?.fullName || "Unknown";
    const email = fromUserId?.email || "No Email";
    const userRole = fromUserId?.userRole || "User";
    const isProcessing = processingRequests.has(item._id);

    return (
      <View style={styles.card}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {fullName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.name}>{fullName}</Text>
            <Text style={styles.email}>{email}</Text>
            <Text style={styles.role}>Role: {userRole}</Text>
            <Text style={styles.timeStamp}>Sent: {formatDate(sentAt)}</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.ignoreButton, isProcessing && styles.disabledButton]}
            onPress={() => handleIgnoreRequest(item._id, fullName)}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.ignoreButtonText}>Ignore</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.acceptButton, isProcessing && styles.disabledButton]}
            onPress={() => handleAcceptRequest(item._id, fullName)}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.acceptButtonText}>Accept</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Pending Requests</Text>
      <Text style={styles.emptySubtitle}>
        You don't have any connection requests at the moment.
      </Text>
    </View>
  );

  const LoadingState = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color="#22c55e" />
      <Text style={styles.loadingText}>Loading requests...</Text>
    </View>
  );

  const ErrorState = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => fetchPendingRequests()}
      >
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenWrapper noScrollView={true} style={styles.screenWrapper}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pending Requests</Text>
        <Text style={styles.headerSubtitle}>
          {pendingRequests.length} request
          {pendingRequests.length !== 1 ? "s" : ""} waiting
        </Text>
      </View>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState />
      ) : (
        <FlatList
          data={pendingRequests}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
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
            pendingRequests.length === 0
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
    fontSize: moderateScale(20),
    fontWeight: "bold",
    color: "#333",
    marginBottom: verticalScale(8),
  },
  emptySubtitle: {
    fontSize: moderateScale(16),
    color: "#666",
    textAlign: "center",
    lineHeight: moderateScale(22),
  },
  card: {
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
  userInfo: {
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
  userDetails: {
    flex: 1,
  },
  name: {
    fontSize: moderateScale(18),
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: verticalScale(2),
  },
  email: {
    fontSize: moderateScale(14),
    color: "#6b7280",
    marginBottom: verticalScale(2),
  },
  role: {
    fontSize: moderateScale(12),
    color: "#9ca3af",
    marginBottom: verticalScale(2),
  },
  timeStamp: {
    fontSize: moderateScale(12),
    color: "#9ca3af",
  },
  actionButtons: {
    flexDirection: "row",
    gap: moderateScale(12),
  },
  acceptButton: {
    backgroundColor: "#22c55e",
    paddingVertical: verticalScale(12),
    paddingHorizontal: moderateScale(20),
    borderRadius: moderateScale(8),
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: verticalScale(44),
  },
  acceptButtonText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontWeight: "600",
  },
  ignoreButton: {
    backgroundColor: "#ef4444",
    paddingVertical: verticalScale(12),
    paddingHorizontal: moderateScale(20),
    borderRadius: moderateScale(8),
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: verticalScale(44),
  },
  ignoreButtonText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default PendingRequestsScreen;
