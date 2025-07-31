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

const CareGiverDashboard = () => {
  const [parents, setParents] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [addParentModal, setAddParentModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [newParent, setNewParent] = useState({
    name: "",
    email: "",
    phone: "",
    relationship: "Parent",
  });

  // Mock data - replace with actual API calls
  const mockParents = [
    {
      id: "1",
      name: "Mary Johnson",
      relationship: "Mother",
      lastUpdate: "2 hours ago",
      healthStatus: "Good",
      criticalAlerts: 0,
      recentReadings: {
        bp: "120/80",
        sugar: "110",
        cholesterol: "180",
      },
    },
    {
      id: "2",
      name: "John Johnson",
      relationship: "Father",
      lastUpdate: "5 hours ago",
      healthStatus: "Attention Needed",
      criticalAlerts: 1,
      recentReadings: {
        bp: "140/90",
        sugar: "160",
        cholesterol: "220",
      },
    },
  ];

  const mockPendingRequests = [
    {
      id: "1",
      name: "Robert Smith",
      email: "robert@email.com",
      requestDate: "2024-01-15",
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Simulate API calls
    setParents(mockParents);
    setPendingRequests(mockPendingRequests);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadData();
      setRefreshing(false);
    }, 1000);
  };

  const handleAddParent = () => {
    if (!newParent.name || !newParent.email || !newParent.phone) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    // Here you would make API call to send request
    Alert.alert(
      "Request Sent",
      `Connection request sent to ${newParent.name}. They will receive a notification to accept your request.`,
      [{ text: "OK", onPress: () => setAddParentModal(false) }]
    );

    setNewParent({ name: "", email: "", phone: "", relationship: "Parent" });
  };

  const getHealthStatusColor = (status) => {
    switch (status) {
      case "Good":
        return "#4CAF50";
      case "Attention Needed":
        return "#FF9800";
      case "Critical":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  };

  const getReadingStatus = (type, value) => {
    // Simple logic for demonstration
    if (type === "bp") {
      const [systolic] = value.split("/").map(Number);
      return systolic > 130 ? "#FF9800" : "#4CAF50";
    }
    if (type === "sugar") {
      return parseInt(value) > 140 ? "#FF9800" : "#4CAF50";
    }
    if (type === "cholesterol") {
      return parseInt(value) > 200 ? "#FF9800" : "#4CAF50";
    }
    return "#4CAF50";
  };

  const renderParentCard = (parent) => (
    <TouchableOpacity key={parent.id} style={styles.parentCard}>
      <View style={styles.parentHeader}>
        <View style={styles.parentInfo}>
          <Text style={styles.parentName}>{parent.name}</Text>
          <Text style={styles.relationshipText}>{parent.relationship}</Text>
        </View>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: getHealthStatusColor(parent.healthStatus) },
            ]}
          />
          <Text
            style={[
              styles.statusText,
              { color: getHealthStatusColor(parent.healthStatus) },
            ]}
          >
            {parent.healthStatus}
          </Text>
        </View>
      </View>

      <View style={styles.lastUpdateContainer}>
        <Icon name="access-time" size={scale(14)} color="#666" />
        <Text style={styles.lastUpdateText}>
          Last update: {parent.lastUpdate}
        </Text>
      </View>

      {parent.criticalAlerts > 0 && (
        <View style={styles.alertContainer}>
          <Icon name="warning" size={scale(16)} color="#FF5722" />
          <Text style={styles.alertText}>
            {parent.criticalAlerts} critical alert(s)
          </Text>
        </View>
      )}

      <View style={styles.healthReadings}>
        <Text style={styles.readingsTitle}>Latest Readings</Text>
        <View style={styles.readingsRow}>
          <View style={styles.readingItem}>
            <Text style={styles.readingLabel}>BP</Text>
            <Text
              style={[
                styles.readingValue,
                { color: getReadingStatus("bp", parent.recentReadings.bp) },
              ]}
            >
              {parent.recentReadings.bp}
            </Text>
          </View>
          <View style={styles.readingItem}>
            <Text style={styles.readingLabel}>Sugar</Text>
            <Text
              style={[
                styles.readingValue,
                {
                  color: getReadingStatus("sugar", parent.recentReadings.sugar),
                },
              ]}
            >
              {parent.recentReadings.sugar}
            </Text>
          </View>
          <View style={styles.readingItem}>
            <Text style={styles.readingLabel}>Cholesterol</Text>
            <Text
              style={[
                styles.readingValue,
                {
                  color: getReadingStatus(
                    "cholesterol",
                    parent.recentReadings.cholesterol
                  ),
                },
              ]}
            >
              {parent.recentReadings.cholesterol}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.viewDetailsButton}>
        <Text style={styles.viewDetailsText}>View Full Health Report</Text>
        <Icon name="arrow-forward" size={scale(16)} color="#2196F3" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderPendingRequest = (request) => (
    <View key={request.id} style={styles.pendingCard}>
      <View style={styles.pendingInfo}>
        <Icon name="person-add" size={scale(20)} color="#FF9800" />
        <View style={styles.pendingDetails}>
          <Text style={styles.pendingName}>{request.name}</Text>
          <Text style={styles.pendingEmail}>{request.email}</Text>
          <Text style={styles.pendingDate}>Sent: {request.requestDate}</Text>
        </View>
      </View>
      <Text style={styles.pendingStatus}>Pending</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2196F3" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>CareGiver Dashboard</Text>
          <Text style={styles.headerSubtitle}>Monitor your loved ones</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setAddParentModal(true)}
        >
          <Icon name="person-add" size={scale(24)} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{parents.length}</Text>
            <Text style={styles.statLabel}>Connected</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: "#FF9800" }]}>
              {parents.reduce((sum, p) => sum + p.criticalAlerts, 0)}
            </Text>
            <Text style={styles.statLabel}>Alerts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: "#4CAF50" }]}>
              {parents.filter((p) => p.healthStatus === "Good").length}
            </Text>
            <Text style={styles.statLabel}>Healthy</Text>
          </View>
        </View>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pending Requests</Text>
            {pendingRequests.map(renderPendingRequest)}
          </View>
        )}

        {/* Connected Parents */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Parents</Text>
          {parents.length > 0 ? (
            parents.map(renderParentCard)
          ) : (
            <View style={styles.emptyState}>
              <Icon name="family-restroom" size={scale(60)} color="#ccc" />
              <Text style={styles.emptyStateText}>
                No parents connected yet
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Add your parents to start monitoring their health
              </Text>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={() => setAddParentModal(true)}
              >
                <Text style={styles.emptyStateButtonText}>Add Parent</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Parent Modal */}
      <Modal
        visible={addParentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAddParentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Parent</Text>
              <TouchableOpacity onPress={() => setAddParentModal(false)}>
                <Icon name="close" size={scale(24)} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name *</Text>
                <TextInput
                  style={styles.input}
                  value={newParent.name}
                  onChangeText={(text) =>
                    setNewParent({ ...newParent, name: text })
                  }
                  placeholder="Enter parent's full name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address *</Text>
                <TextInput
                  style={styles.input}
                  value={newParent.email}
                  onChangeText={(text) =>
                    setNewParent({ ...newParent, email: text })
                  }
                  placeholder="Enter email address"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number *</Text>
                <TextInput
                  style={styles.input}
                  value={newParent.phone}
                  onChangeText={(text) =>
                    setNewParent({ ...newParent, phone: text })
                  }
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Relationship</Text>
                <View style={styles.relationshipContainer}>
                  {["Parent", "Mother", "Father", "Guardian", "Relative"].map(
                    (rel) => (
                      <TouchableOpacity
                        key={rel}
                        style={[
                          styles.relationshipChip,
                          newParent.relationship === rel &&
                            styles.relationshipChipActive,
                        ]}
                        onPress={() =>
                          setNewParent({ ...newParent, relationship: rel })
                        }
                      >
                        <Text
                          style={[
                            styles.relationshipChipText,
                            newParent.relationship === rel &&
                              styles.relationshipChipTextActive,
                          ]}
                        >
                          {rel}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              </View>

              <View style={styles.infoBox}>
                <Icon name="info" size={scale(16)} color="#2196F3" />
                <Text style={styles.infoText}>
                  A connection request will be sent to your parent. They need to
                  accept it to start sharing health data.
                </Text>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setAddParentModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleAddParent}
              >
                <Text style={styles.sendButtonText}>Send Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#2196F3",
    paddingTop: verticalScale(40),
    paddingBottom: verticalScale(20),
    paddingHorizontal: scale(20),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
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
});

export default CareGiverDashboard;
