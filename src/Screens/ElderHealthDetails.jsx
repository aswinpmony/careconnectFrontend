import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import axios from "axios";
import BASE_URL from "../Config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenWrapper from "../Constants/ScreenWrapper";
const { width } = Dimensions.get("window");

const ElderHealthDetails = ({ route, navigation }) => {
  const { elderId, elderName } = route.params;

  const [elderProfile, setElderProfile] = useState(null);
  const [healthLogs, setHealthLogs] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedView, setSelectedView] = useState("overview"); // 'overview', 'logs', 'trends'

  // Fetch elder details
  const fetchElderDetails = async () => {
    try {
      setLoading(true);
      const caregiverId = await AsyncStorage.getItem("userID");

      if (!caregiverId) {
        Alert.alert("Error", "Please log in again");
        navigation.goBack();
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/api/auth/get-connected-elder/${caregiverId}/${elderId}`,
        { timeout: 10000 }
      );

      const { elderData } = response.data;
      setElderProfile(elderData);
      setHealthLogs(elderData.healthLogs || []);
      setStatistics(elderData.statistics || {});
    } catch (error) {
      console.error("Error fetching elder details:", error);

      if (error.response?.status === 403) {
        Alert.alert("Access Denied", "You are not connected to this elder", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Error", "Unable to fetch elder data");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElderDetails();
  }, [elderId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchElderDetails();
    setRefreshing(false);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Critical":
        return "#ef4444";
      case "Warning":
        return "#f59e0b";
      default:
        return "#22c55e";
    }
  };

  // Get vital status
  const getVitalStatus = (type, value) => {
    if (!value) return { status: "Unknown", color: "#9ca3af" };

    switch (type) {
      case "bloodPressure":
        const [systolic, diastolic] = value.split("/").map(Number);
        if (systolic > 140 || diastolic > 90) {
          return { status: "High", color: "#ef4444" };
        } else if (systolic < 90 || diastolic < 60) {
          return { status: "Low", color: "#f59e0b" };
        }
        return { status: "Normal", color: "#22c55e" };

      case "heartRate":
        if (value > 100) {
          return { status: "High", color: "#ef4444" };
        } else if (value < 60) {
          return { status: "Low", color: "#f59e0b" };
        }
        return { status: "Normal", color: "#22c55e" };

      case "sugar":
        if (value > 180) {
          return { status: "High", color: "#ef4444" };
        } else if (value < 70) {
          return { status: "Low", color: "#ef4444" };
        }
        return { status: "Normal", color: "#22c55e" };

      case "temperature":
        if (value > 38) {
          return { status: "Fever", color: "#ef4444" };
        } else if (value < 36) {
          return { status: "Low", color: "#f59e0b" };
        }
        return { status: "Normal", color: "#22c55e" };

      case "oxygen":
        if (value < 95) {
          return { status: "Low", color: "#ef4444" };
        }
        return { status: "Normal", color: "#22c55e" };

      default:
        return { status: "—", color: "#9ca3af" };
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    });
  };

  // Render vital card
  const renderVitalCard = (icon, label, value, unit, type) => {
    const vitalStatus = getVitalStatus(type, value);

    return (
      <View style={styles.vitalCard}>
        <View style={styles.vitalHeader}>
          <Icon name={icon} size={scale(20)} color="#666" />
          <Text style={styles.vitalLabel}>{label}</Text>
        </View>
        <View style={styles.vitalContent}>
          <Text style={styles.vitalValue}>
            {value || "—"}
            {value && unit && <Text style={styles.vitalUnit}> {unit}</Text>}
          </Text>
          <View
            style={[styles.statusBadge, { backgroundColor: vitalStatus.color }]}
          >
            <Text style={styles.statusText}>{vitalStatus.status}</Text>
          </View>
        </View>
      </View>
    );
  };

  // Render latest vitals
  const renderLatestVitals = () => {
    const latestLog = healthLogs[0];

    if (!latestLog) {
      return (
        <View style={styles.emptyBox}>
          <Icon name="favorite-border" size={scale(40)} color="#ccc" />
          <Text style={styles.emptyText}>No health data available</Text>
        </View>
      );
    }

    return (
      <View style={styles.vitalsGrid}>
        {renderVitalCard(
          "favorite",
          "Blood Pressure",
          latestLog.bloodPressure,
          "mmHg",
          "bloodPressure"
        )}
        {renderVitalCard(
          "favorite-border",
          "Heart Rate",
          latestLog.heartRate,
          "bpm",
          "heartRate"
        )}
        {renderVitalCard(
          "opacity",
          "Blood Sugar",
          latestLog.sugarLevel,
          "mg/dL",
          "sugar"
        )}
        {renderVitalCard(
          "ac-unit",
          "Temperature",
          latestLog.temperature,
          "°C",
          "temperature"
        )}
        {latestLog.oxygenLevel &&
          renderVitalCard(
            "air",
            "Oxygen Level",
            latestLog.oxygenLevel,
            "%",
            "oxygen"
          )}
        {latestLog.weight &&
          renderVitalCard(
            "monitor-weight",
            "Weight",
            latestLog.weight,
            "kg",
            "weight"
          )}
      </View>
    );
  };

  // Render health log item
  const renderHealthLog = (log, index) => {
    const statusColor = getStatusColor(log.status);

    return (
      <View key={index} style={styles.logCard}>
        <View style={styles.logHeader}>
          <View style={styles.logDateContainer}>
            <Icon name="calendar-today" size={scale(14)} color="#666" />
            <Text style={styles.logDate}>{formatDate(log.date)}</Text>
          </View>
          <View
            style={[styles.logStatusBadge, { backgroundColor: statusColor }]}
          >
            <Text style={styles.logStatusText}>{log.status || "Normal"}</Text>
          </View>
        </View>

        <View style={styles.logMetrics}>
          {log.bloodPressure && (
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>BP:</Text>
              <Text style={styles.metricValue}>{log.bloodPressure} mmHg</Text>
            </View>
          )}
          {log.heartRate && (
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>HR:</Text>
              <Text style={styles.metricValue}>{log.heartRate} bpm</Text>
            </View>
          )}
          {log.sugarLevel && (
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Sugar:</Text>
              <Text style={styles.metricValue}>{log.sugarLevel} mg/dL</Text>
            </View>
          )}
          {log.temperature && (
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Temp:</Text>
              <Text style={styles.metricValue}>{log.temperature}°C</Text>
            </View>
          )}
        </View>

        {log.alerts && log.alerts.length > 0 && (
          <View style={styles.alertsContainer}>
            {log.alerts.map((alert, i) => (
              <View key={i} style={styles.alertItem}>
                <Icon name="warning" size={scale(12)} color="#ef4444" />
                <Text style={styles.alertText}>{alert}</Text>
              </View>
            ))}
          </View>
        )}

        {log.notes && (
          <View style={styles.notesContainer}>
            <Icon name="note" size={scale(12)} color="#666" />
            <Text style={styles.notesText}>{log.notes}</Text>
          </View>
        )}
      </View>
    );
  };

  // Render overview tab
  const renderOverview = () => (
    <View>
      {/* Profile Summary */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="person" size={scale(20)} color="#2196F3" />
          <Text style={styles.cardTitle}>Profile Information</Text>
        </View>

        <View style={styles.profileGrid}>
          <View style={styles.profileItem}>
            <Text style={styles.profileLabel}>Age</Text>
            <Text style={styles.profileValue}>
              {elderProfile?.dob
                ? (() => {
                    const [day, month, year] = elderProfile.dob
                      .split("/")
                      .map(Number);
                    const birthDate = new Date(year, month - 1, day);
                    const today = new Date();
                    let age = today.getFullYear() - birthDate.getFullYear();
                    const m = today.getMonth() - birthDate.getMonth();
                    if (
                      m < 0 ||
                      (m === 0 && today.getDate() < birthDate.getDate())
                    ) {
                      age--;
                    }
                    return age;
                  })()
                : "—"}
            </Text>
          </View>

          <View style={styles.profileItem}>
            <Text style={styles.profileLabel}>Gender</Text>
            <Text style={styles.profileValue}>
              {elderProfile?.gender || "—"}
            </Text>
          </View>
          <View style={styles.profileItem}>
            <Text style={styles.profileLabel}>Phone</Text>
            <Text style={styles.profileValue}>
              {elderProfile?.phoneNumber || "—"}
            </Text>
          </View>
          <View style={styles.profileItem}>
            <Text style={styles.profileLabel}>Emergency</Text>
            <Text style={styles.profileValue}>
              {elderProfile?.emergencyContact || "—"}
            </Text>
          </View>
        </View>

        {elderProfile?.healthIssues && elderProfile.healthIssues.length > 0 && (
          <View style={styles.healthIssuesContainer}>
            <Text style={styles.healthIssuesLabel}>Health Conditions:</Text>
            <View style={styles.healthIssuesChips}>
              {elderProfile.healthIssues.map((issue, index) => (
                <View key={index} style={styles.healthChip}>
                  <Text style={styles.healthChipText}>{issue}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Statistics */}
      {statistics && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="bar-chart" size={scale(20)} color="#2196F3" />
            <Text style={styles.cardTitle}>Health Statistics</Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{statistics.totalLogs || 0}</Text>
              <Text style={styles.statLabel}>Total Records</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: "#ef4444" }]}>
                {statistics.recentCriticalAlerts || 0}
              </Text>
              <Text style={styles.statLabel}>Recent Alerts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: "#22c55e" }]}>
                {statistics.lastUpdate
                  ? formatDate(statistics.lastUpdate)
                  : "Never"}
              </Text>
              <Text style={styles.statLabel}>Last Update</Text>
            </View>
          </View>
        </View>
      )}

      {/* Latest Vitals */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="favorite" size={scale(20)} color="#2196F3" />
          <Text style={styles.cardTitle}>Latest Vitals</Text>
        </View>
        {renderLatestVitals()}
      </View>

      {/* Recent Logs Preview */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="history" size={scale(20)} color="#2196F3" />
          <Text style={styles.cardTitle}>Recent Health Logs</Text>
          <TouchableOpacity onPress={() => setSelectedView("logs")}>
            <Text style={styles.viewAllLink}>View All</Text>
          </TouchableOpacity>
        </View>
        {healthLogs.length > 0 ? (
          healthLogs.slice(0, 3).map(renderHealthLog)
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No health logs yet</Text>
          </View>
        )}
      </View>
    </View>
  );

  // Render logs tab
  const renderLogs = () => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Icon name="list" size={scale(20)} color="#2196F3" />
        <Text style={styles.cardTitle}>All Health Logs</Text>
        <Text style={styles.logCount}>({healthLogs.length})</Text>
      </View>

      {healthLogs.length > 0 ? (
        healthLogs.map(renderHealthLog)
      ) : (
        <View style={styles.emptyBox}>
          <Icon name="assignment" size={scale(50)} color="#ccc" />
          <Text style={styles.emptyText}>No health logs available</Text>
          <Text style={styles.emptySubtext}>
            Health logs will appear here once the elder starts tracking
          </Text>
        </View>
      )}
    </View>
  );

  // Loading state
  if (loading) {
    return (
      <ScreenWrapper noScrollView={true} style={styles.screenWrapper}>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Loading elder data...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  // Error state
  if (!elderProfile) {
    return (
      <ScreenWrapper noScrollView={true} style={styles.screenWrapper}>
        <View style={styles.loader}>
          <Icon name="error-outline" size={scale(60)} color="#ef4444" />
          <Text style={styles.errorText}>Unable to load elder data</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchElderDetails}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper noScrollView={true} style={styles.screenWrapper}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={scale(24)} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{elderProfile.fullName}</Text>
          <Text style={styles.headerSubtitle}>Health Dashboard</Text>
        </View>

        <TouchableOpacity
          style={styles.callButton}
          onPress={() => {
            if (elderProfile.phoneNumber) {
              // Implement call functionality
              Alert.alert(
                "Call Elder",
                `Call ${elderProfile.fullName} at ${elderProfile.phoneNumber}?`,
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Call", onPress: () => console.log("Calling...") },
                ]
              );
            }
          }}
        >
          <Icon name="phone" size={scale(20)} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedView === "overview" && styles.tabActive]}
          onPress={() => setSelectedView("overview")}
        >
          <Icon
            name="dashboard"
            size={scale(18)}
            color={selectedView === "overview" ? "#2196F3" : "#666"}
          />
          <Text
            style={[
              styles.tabText,
              selectedView === "overview" && styles.tabTextActive,
            ]}
          >
            Overview
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedView === "logs" && styles.tabActive]}
          onPress={() => setSelectedView("logs")}
        >
          <Icon
            name="assignment"
            size={scale(18)}
            color={selectedView === "logs" ? "#2196F3" : "#666"}
          />
          <Text
            style={[
              styles.tabText,
              selectedView === "logs" && styles.tabTextActive,
            ]}
          >
            Logs
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {selectedView === "overview" ? renderOverview() : renderLogs()}
      </ScrollView>
    </ScreenWrapper>
  );
};

// ==================== STYLES ====================
const styles = StyleSheet.create({
  screenWrapper: {
    paddingHorizontal: 0,
    backgroundColor: "#f5f6fa",
  },
  header: {
    backgroundColor: "#2196F3",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
    padding: moderateScale(8),
    marginRight: moderateScale(8),
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    color: "#fff",
    fontSize: moderateScale(20),
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "#E3F2FD",
    fontSize: moderateScale(12),
    marginTop: verticalScale(2),
  },
  callButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: moderateScale(10),
    borderRadius: moderateScale(20),
  },

  // Tab Navigation
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(14),
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: "#2196F3",
  },
  tabText: {
    fontSize: moderateScale(14),
    color: "#666",
    marginLeft: scale(6),
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#2196F3",
    fontWeight: "600",
  },

  // Content
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: scale(16),
  },

  // Cards
  card: {
    backgroundColor: "#fff",
    borderRadius: scale(12),
    padding: scale(16),
    marginBottom: verticalScale(16),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(16),
  },
  cardTitle: {
    fontSize: moderateScale(16),
    fontWeight: "600",
    color: "#333",
    marginLeft: scale(8),
    flex: 1,
  },
  viewAllLink: {
    fontSize: moderateScale(12),
    color: "#2196F3",
    fontWeight: "500",
  },
  logCount: {
    fontSize: moderateScale(12),
    color: "#999",
    marginLeft: scale(4),
  },

  // Profile Grid
  profileGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: verticalScale(12),
  },
  profileItem: {
    width: "50%",
    marginBottom: verticalScale(12),
  },
  profileLabel: {
    fontSize: moderateScale(12),
    color: "#666",
    marginBottom: verticalScale(4),
  },
  profileValue: {
    fontSize: moderateScale(14),
    color: "#333",
    fontWeight: "600",
  },

  // Health Issues
  healthIssuesContainer: {
    marginTop: verticalScale(8),
    paddingTop: verticalScale(12),
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  healthIssuesLabel: {
    fontSize: moderateScale(12),
    color: "#666",
    marginBottom: verticalScale(8),
    fontWeight: "500",
  },
  healthIssuesChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scale(8),
  },
  healthChip: {
    backgroundColor: "#FFF3E0",
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: "#FFE0B2",
  },
  healthChipText: {
    fontSize: moderateScale(12),
    color: "#E65100",
    fontWeight: "500",
  },

  // Statistics
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    color: "#2196F3",
  },
  statLabel: {
    fontSize: moderateScale(11),
    color: "#666",
    marginTop: verticalScale(4),
    textAlign: "center",
  },

  // Vitals Grid
  vitalsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  vitalCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: scale(10),
    padding: scale(12),
    width: (width - scale(48)) / 2,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: scale(12),
  },

  vitalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(8),
  },
  vitalLabel: {
    fontSize: moderateScale(12),
    color: "#666",
    marginLeft: scale(6),
    fontWeight: "500",
  },
  vitalContent: {
    alignItems: "flex-start",
  },
  vitalValue: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#333",
    marginBottom: verticalScale(6),
  },
  vitalUnit: {
    fontSize: moderateScale(12),
    fontWeight: "normal",
    color: "#666",
  },
  statusBadge: {
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(3),
    borderRadius: scale(12),
  },
  statusText: {
    fontSize: moderateScale(10),
    color: "#fff",
    fontWeight: "600",
  },

  // Health Logs
  logCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: scale(10),
    padding: scale(12),
    marginBottom: verticalScale(12),
    borderLeftWidth: scale(4),
    borderLeftColor: "#2196F3",
  },
  logHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(12),
  },
  logDateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logDate: {
    fontSize: moderateScale(13),
    color: "#666",
    marginLeft: scale(6),
    fontWeight: "500",
  },
  logStatusBadge: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: scale(12),
  },
  logStatusText: {
    fontSize: moderateScale(11),
    color: "#fff",
    fontWeight: "600",
  },
  logMetrics: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scale(12),
    marginBottom: verticalScale(8),
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metricLabel: {
    fontSize: moderateScale(12),
    color: "#666",
    marginRight: scale(4),
  },
  metricValue: {
    fontSize: moderateScale(12),
    color: "#333",
    fontWeight: "600",
  },
  alertsContainer: {
    backgroundColor: "#FEE2E2",
    borderRadius: scale(6),
    padding: scale(8),
    marginTop: verticalScale(8),
  },
  alertItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(4),
  },
  alertText: {
    fontSize: moderateScale(11),
    color: "#DC2626",
    marginLeft: scale(6),
    flex: 1,
  },
  notesContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: verticalScale(8),
    paddingTop: verticalScale(8),
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  notesText: {
    fontSize: moderateScale(12),
    color: "#666",
    marginLeft: scale(6),
    flex: 1,
    fontStyle: "italic",
  },

  // Empty States
  emptyBox: {
    alignItems: "center",
    paddingVertical: verticalScale(24),
  },
  emptyText: {
    fontSize: moderateScale(14),
    color: "#999",
    marginTop: verticalScale(12),
  },
  emptySubtext: {
    fontSize: moderateScale(12),
    color: "#bbb",
    marginTop: verticalScale(4),
    textAlign: "center",
  },

  // Loading & Error
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: moderateScale(14),
    color: "#666",
    marginTop: verticalScale(12),
  },
  errorText: {
    fontSize: moderateScale(16),
    color: "#ef4444",
    marginTop: verticalScale(16),
    fontWeight: "500",
  },
  retryButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(12),
    borderRadius: scale(8),
    marginTop: verticalScale(16),
  },
  retryButtonText: {
    color: "#fff",
    fontSize: moderateScale(14),
    fontWeight: "600",
  },
});

export default ElderHealthDetails;
