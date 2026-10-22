import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  RefreshControl,
  StatusBar,
} from "react-native";
import { StyleSheet } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useRoute, CommonActions } from "@react-navigation/native";
import {
  Menu,
  User,
  Bell,
  UserCheck,
  Settings,
  X,
  Users,
  LogOut,
} from "lucide-react-native";
import ScreenWrapper from "../Constants/ScreenWrapper";
import AsyncStorage from "@react-native-async-storage/async-storage";

import apiClient from "../Config/apiClient";

const CareGiverDashboard = ({ navigation }) => {
  const route = useRoute();
  const { userDetails } = route.params;
  const [parents, setParents] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [addParentModal, setAddParentModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newParent, setNewParent] = useState({
    name: "",
    email: "",
    phone: "",
    relationship: "Parent",
  });
  const [loading, setLoading] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState("");

  useEffect(() => {
    const initializeData = async () => {
      try {
        const userId = await AsyncStorage.getItem("userID");
        if (userId) {
          setLoggedInUserId(userId);
          await Promise.all([
            fetchConnectedElders(userId),
            fetchPendingRequests(userId),
          ]);
        }
      } catch (error) {
        console.error("Error initializing:", error);
      }
    };
    initializeData();
  }, []);
 const fetchConnectedElders = async (userId) => {
  try {
    setLoading(true);

    const response = await apiClient.get(
      `/api/auth/linked-users/${userId}`,
      { timeout: 10000 }
    );

    const elders = response.data.filter(
      (user) => user.userRole === "Elder" || user.role === "Elder"
    );

    setParents(elders);
  } catch (error) {
    console.error("Error fetching elders:", error);
    Alert.alert("Error", "Failed to load connected elders");
  } finally {
    setLoading(false);
  }
};

const fetchPendingRequests = async (userId) => {
  try {
    const response = await apiClient.get(
      `/api/auth/connection-requests/pending/${userId}`,
      { timeout: 10000 }
    );

    setPendingRequests(response.data || []);
  } catch (error) {
    console.error("Error fetching pending requests:", error);
  }
};

  const onRefresh = async () => {
    setRefreshing(true);
    if (loggedInUserId) {
      await Promise.all([
        fetchConnectedElders(loggedInUserId),
        fetchPendingRequests(loggedInUserId),
      ]);
    }
    setRefreshing(false);
  };

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const closeDrawer = () => setIsDrawerOpen(false);

  const navigateFromDrawer = (screenName, params = {}) => {
    closeDrawer();
    navigation.navigate(screenName, params);
  };

  const handleAddParent = () => {
    if (!newParent.name || !newParent.email || !newParent.phone) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    // TODO: Implement API to send connection request
    Alert.alert(
      "Request Sent",
      `Connection request sent to ${newParent.name}. They will receive a notification to accept your request.`,
      [{ text: "OK", onPress: () => setAddParentModal(false) }]
    );

    setNewParent({ name: "", email: "", phone: "", relationship: "Parent" });
  };

  const DrawerContent = () => (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <TouchableOpacity style={styles.closeButton} onPress={closeDrawer}>
          <X size={moderateScale(24)} color="#666" />
        </TouchableOpacity>
        <View style={styles.profileSection}>
          <View style={styles.profileAvatar}>
            <User size={moderateScale(40)} color="#2196F3" />
          </View>
          <Text style={styles.profileName}>{userDetails.fullName}</Text>
          <Text style={styles.profileRole}>{userDetails.role}</Text>
        </View>
      </View>

      <View style={styles.drawerMenu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateFromDrawer("MyProfile", { userDetails })}
        >
          <User size={moderateScale(24)} color="#666" />
          <Text style={styles.menuText}>My Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            navigateFromDrawer("PendingRequestsScreen", {
              userRole: "Elder",
            })
          }
        >
          <View style={styles.menuIconContainer}>
            <Bell size={moderateScale(24)} color="#666" />
            {pendingRequests.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{pendingRequests.length}</Text>
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
            navigateFromDrawer("UserSearchScreen", { userRole: "Elder" })
          }
        >
          <Users size={moderateScale(24)} color="#666" />
          <Text style={styles.menuText}>Find Elders</Text>
        </TouchableOpacity>

        <View style={styles.menuSeparator} />

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateFromDrawer("Settings")}
        >
          <Settings size={moderateScale(24)} color="#666" />
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={async () => {
            try {
              await AsyncStorage.multiRemove(["userToken", "userDetails"]);
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: "Login" }],
                })
              );
            } catch (error) {
              console.error("Error logging out:", error);
            }
          }}
        >
          <LogOut size={moderateScale(24)} color="#666" />
          <Text style={styles.menuText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderElderCard = (elder) => (
    <TouchableOpacity
      key={elder._id}
      style={styles.parentCard}
      onPress={() =>
        navigation.navigate("ElderHealthDetails", {
          elderId: elder._id,
          elderName: elder.fullName,
        })
      }
    >
      <View style={styles.parentHeader}>
        <View style={styles.avatar}>
          {/* <Text style={styles.avatarText}>
            {(elder.fullName || "U").charAt(0).toUpperCase()}
          </Text> */}
        </View>
        <View style={styles.parentInfo}>
          <Text style={styles.parentName}>{elder.fullName || "Unknown"}</Text>
          <Text style={styles.relationshipText}>{elder.email}</Text>
          <Text style={styles.roleText}>Elder</Text>
        </View>
        <Icon name="chevron-right" size={scale(24)} color="#666" />
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => handleCall(elder.phoneNumber, elder.fullName)}
        >
          <Icon name="phone" size={scale(18)} color="#22c55e" />
          <Text style={styles.quickActionText}>Call</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() =>
            navigation.navigate("ChatScreen", {
              connectionId: elder._id,
              connectionName: elder.fullName,
            })
          }
        >
          <Icon name="message" size={scale(18)} color="#2196F3" />
          <Text style={styles.quickActionText}>Message</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <ScreenWrapper>
        <View style={styles.container}>
          <StatusBar backgroundColor="#2196F3" barStyle="light-content" />
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <TouchableOpacity
                style={styles.menuButton}
                onPress={toggleDrawer}
              >
                <Menu size={moderateScale(24)} color="#fff" />
              </TouchableOpacity>

              <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>CareGiver Dashboard</Text>
                <Text style={styles.headerSubtitle}>
                  Monitor your loved ones
                </Text>
              </View>

              <TouchableOpacity
                style={styles.addButton}
                onPress={() =>
                  navigation.navigate("UserSearchScreen", { userRole: "Elder" })
                }
              >
                <Icon name="person-add" size={scale(24)} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            style={styles.content}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{parents.length}</Text>
                <Text style={styles.statLabel}>Connected Elders</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statNumber, { color: "#FF9800" }]}>
                  {pendingRequests.length}
                </Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statNumber, { color: "#22c55e" }]}>
                  {parents.length}
                </Text>
                <Text style={styles.statLabel}>Active</Text>
              </View>
            </View>

            {pendingRequests.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Pending Requests</Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("PendingRequestsScreen")}
                  >
                    <Text style={styles.viewAllText}>View All</Text>
                  </TouchableOpacity>
                </View>
                {pendingRequests.slice(0, 2).map((request) => (
                  <View key={request._id} style={styles.pendingCard}>
                    <View style={styles.pendingInfo}>
                      <View style={styles.smallAvatar}>
                        <Text style={styles.smallAvatarText}>
                          {(request.fromUserId?.fullName || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.pendingDetails}>
                        <Text style={styles.pendingName}>
                          {request.fromUserId?.fullName || "Unknown"}
                        </Text>
                        <Text style={styles.pendingEmail}>
                          {request.fromUserId?.email || "No email"}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.pendingStatus}>Pending</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Connected Elders</Text>
              {parents.length > 0 ? (
                parents.map(renderElderCard)
              ) : (
                <View style={styles.emptyState}>
                  <Icon name="people-outline" size={scale(60)} color="#ccc" />
                  <Text style={styles.emptyStateText}>
                    No elders connected yet
                  </Text>
                  <Text style={styles.emptyStateSubtext}>
                    Connect with elders to monitor their health
                  </Text>
                  <TouchableOpacity
                    style={styles.emptyStateButton}
                    onPress={() =>
                      navigation.navigate("UserSearchScreen", {
                        userRole: "Elder",
                      })
                    }
                  >
                    <Text style={styles.emptyStateButtonText}>Find Elders</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </ScreenWrapper>

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
    // backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#2196F3",
    paddingBottom: verticalScale(20),
    paddingHorizontal: scale(20),
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
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
    fontSize: moderateScale(24),
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: moderateScale(14),
    color: "#E3F2FD",
    marginTop: verticalScale(2),
  },
  addButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: scale(12),
    borderRadius: scale(25),
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
    backgroundColor: "#2196F3",
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

  // Existing styles continue...
  content: {
    flex: 1,
    paddingHorizontal: scale(16),
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
  },
  statCard: {
    backgroundColor: "#fff",
    padding: scale(16),
    borderRadius: scale(12),
    alignItems: "center",
    flex: 1,
    marginHorizontal: scale(4),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statNumber: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    color: "#2196F3",
  },
  statLabel: {
    fontSize: moderateScale(12),
    color: "#666",
    marginTop: verticalScale(4),
  },
  section: {
    marginBottom: verticalScale(24),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: "600",
    color: "#333",
    marginBottom: verticalScale(12),
  },
  parentCard: {
    backgroundColor: "#fff",
    borderRadius: scale(12),
    padding: scale(16),
    marginBottom: verticalScale(12),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  parentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: verticalScale(12),
  },
  parentInfo: {
    flex: 1,
  },
  parentName: {
    fontSize: moderateScale(18),
    fontWeight: "600",
    color: "#333",
  },
  relationshipText: {
    fontSize: moderateScale(14),
    color: "#666",
    marginTop: verticalScale(2),
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    marginRight: scale(6),
  },
  statusText: {
    fontSize: moderateScale(12),
    fontWeight: "500",
  },
  lastUpdateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(12),
  },
  lastUpdateText: {
    fontSize: moderateScale(12),
    color: "#666",
    marginLeft: scale(4),
  },
  alertContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    padding: scale(8),
    borderRadius: scale(6),
    marginBottom: verticalScale(12),
  },
  alertText: {
    fontSize: moderateScale(12),
    color: "#FF5722",
    marginLeft: scale(4),
    fontWeight: "500",
  },
  healthReadings: {
    backgroundColor: "#F8F9FA",
    padding: scale(12),
    borderRadius: scale(8),
    marginBottom: verticalScale(12),
  },
  readingsTitle: {
    fontSize: moderateScale(14),
    fontWeight: "600",
    color: "#333",
    marginBottom: verticalScale(8),
  },
  readingsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  readingItem: {
    alignItems: "center",
  },
  readingLabel: {
    fontSize: moderateScale(11),
    color: "#666",
    marginBottom: verticalScale(2),
  },
  readingValue: {
    fontSize: moderateScale(14),
    fontWeight: "600",
  },
  viewDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(8),
  },
  viewDetailsText: {
    fontSize: moderateScale(14),
    color: "#2196F3",
    fontWeight: "500",
    marginRight: scale(4),
  },
  pendingCard: {
    backgroundColor: "#fff",
    borderRadius: scale(12),
    padding: scale(16),
    marginBottom: verticalScale(8),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeftWidth: scale(4),
    borderLeftColor: "#FF9800",
  },
  pendingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  pendingDetails: {
    marginLeft: scale(12),
    flex: 1,
  },
  pendingName: {
    fontSize: moderateScale(16),
    fontWeight: "600",
    color: "#333",
  },
  pendingEmail: {
    fontSize: moderateScale(12),
    color: "#666",
  },
  pendingDate: {
    fontSize: moderateScale(11),
    color: "#999",
  },
  pendingStatus: {
    fontSize: moderateScale(12),
    color: "#FF9800",
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: verticalScale(40),
    backgroundColor: "#fff",
    borderRadius: scale(12),
  },
  emptyStateText: {
    fontSize: moderateScale(18),
    color: "#666",
    marginTop: verticalScale(16),
    fontWeight: "500",
  },
  emptyStateSubtext: {
    fontSize: moderateScale(14),
    color: "#999",
    marginTop: verticalScale(8),
    textAlign: "center",
  },
  emptyStateButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(12),
    borderRadius: scale(25),
    marginTop: verticalScale(16),
  },
  emptyStateButtonText: {
    color: "#fff",
    fontSize: moderateScale(14),
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: scale(20),
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: moderateScale(20),
    fontWeight: "600",
    color: "#333",
  },
  modalBody: {
    padding: scale(20),
  },
  inputGroup: {
    marginBottom: verticalScale(20),
  },
  inputLabel: {
    fontSize: moderateScale(14),
    fontWeight: "500",
    color: "#333",
    marginBottom: verticalScale(8),
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: scale(8),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(12),
    fontSize: moderateScale(14),
    backgroundColor: "#f9f9f9",
  },
  relationshipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scale(8),
  },
  relationshipChip: {
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: scale(20),
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  relationshipChipActive: {
    backgroundColor: "#2196F3",
    borderColor: "#2196F3",
  },
  relationshipChipText: {
    fontSize: moderateScale(12),
    color: "#666",
  },
  relationshipChipTextActive: {
    color: "#fff",
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#E3F2FD",
    padding: scale(12),
    borderRadius: scale(8),
    marginTop: verticalScale(12),
  },
  infoText: {
    fontSize: moderateScale(12),
    color: "#1976D2",
    marginLeft: scale(8),
    flex: 1,
  },
  modalFooter: {
    flexDirection: "row",
    padding: scale(20),
    borderTopWidth: 1,
    borderTopColor: "#eee",
    gap: scale(12),
  },
  cancelButton: {
    flex: 1,
    paddingVertical: verticalScale(12),
    borderRadius: scale(8),
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    fontSize: moderateScale(14),
    color: "#666",
    fontWeight: "500",
  },
  sendButton: {
    flex: 1,
    backgroundColor: "#2196F3",
    paddingVertical: verticalScale(12),
    borderRadius: scale(8),
    alignItems: "center",
  },
  sendButtonText: {
    fontSize: moderateScale(14),
    color: "#fff",
    fontWeight: "500",
  },

  quickActions: {
    flexDirection: "row",
    marginTop: verticalScale(12),
    gap: moderateScale(12),
    paddingTop: verticalScale(12),
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  quickActionButton: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingVertical: verticalScale(8),
    backgroundColor: "#f8f9fa",
    borderRadius: moderateScale(8),
  },
  quickActionText: {
    marginLeft: moderateScale(4),
    fontSize: moderateScale(12),
    color: "#666",
    fontWeight: "500",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(12),
  },
  viewAllText: {
    fontSize: moderateScale(14),
    color: "#2196F3",
    fontWeight: "500",
  },
  smallAvatar: {
    width: moderateScale(40),
    height: moderateScale(40),
    backgroundColor: "#22c55e",
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
    marginRight: moderateScale(12),
  },
  smallAvatarText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontWeight: "bold",
  },
  roleText: {
    fontSize: moderateScale(12),
    color: "#22c55e",
    fontWeight: "500",
    marginTop: verticalScale(2),
  },
});

export default CareGiverDashboard;
