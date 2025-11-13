// DrawerNavigator.js
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  Menu,
  User,
  Bell,
  UserCheck,
  Settings,
  X,
  Users,
  Heart,
  Shield,
  Activity,
} from "lucide-react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";

const DrawerNavigator = ({
  children,

  userRole = "Elder",
  userName = "User",
  pendingRequests = 0,
  customMenuItems = [],
}) => {
  const navigation = useNavigation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const navigateFromDrawer = (screenName, params = {}) => {
    console.log("Navigating to:", screenName, params);
    closeDrawer();
    navigation.navigate(screenName, params);
  };

  // Default menu items based on user role
  const getDefaultMenuItems = () => {
    const commonItems = [
      {
        id: "profile",
        icon: User,
        label: "My Profile",
        screen: "Profile",
        color: "#666",
      },
      {
        id: "pending",
        icon: Bell,
        label: "Pending Requests",
        screen: "PendingRequests",
        color: "#666",
        badge: pendingRequests,
      },
      {
        id: "connections",
        icon: UserCheck,
        label: "My Connections",
        screen: "MyConnections",
        color: "#666",
      },
    ];

    if (userRole === "Elder") {
      return [
        ...commonItems,
        {
          id: "find-caregivers",
          icon: Users,
          label: "Find Caregivers",
          screen: "UserSearchScreen",
          params: { userRole: "CareGiver" },
          color: "#666",
        },
        { id: "separator" },
        {
          id: "health",
          icon: Heart,
          label: "Health Records",
          screen: "HealthRecords",
          color: "#666",
        },
        {
          id: "settings",
          icon: Settings,
          label: "Settings",
          screen: "Settings",
          color: "#666",
        },
      ];
    } else if (userRole === "CareGiver") {
      return [
        ...commonItems,
        {
          id: "find-elders",
          icon: Users,
          label: "Find Elders",
          screen: "UserSearchScreen",
          params: { userRole: "Elder" },
          color: "#666",
        },
        { id: "separator" },
        {
          id: "monitoring",
          icon: Activity,
          label: "Health Monitoring",
          screen: "HealthMonitoring",
          color: "#666",
        },
        {
          id: "emergency",
          icon: Shield,
          label: "Emergency Alerts",
          screen: "EmergencyAlerts",
          color: "#666",
        },
        {
          id: "settings",
          icon: Settings,
          label: "Settings",
          screen: "Settings",
          color: "#666",
        },
      ];
    }

    return commonItems;
  };

  const menuItems =
    customMenuItems.length > 0 ? customMenuItems : getDefaultMenuItems();

  const DrawerContent = () => (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <TouchableOpacity style={styles.closeButton} onPress={closeDrawer}>
          <X size={moderateScale(24)} color="#666" />
        </TouchableOpacity>
        <View style={styles.profileSection}>
          <View style={styles.profileAvatar}>
            <User size={moderateScale(40)} color="#22c55e" />
          </View>
          <Text style={styles.profileName}>{userName}</Text>
          <Text style={styles.profileRole}>{userRole}</Text>
        </View>
      </View>

      <View style={styles.drawerMenu}>
        {menuItems.map((item, index) => {
          if (item.id === "separator") {
            return <View key={index} style={styles.menuSeparator} />;
          }

          const IconComponent = item.icon;

          return (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => navigateFromDrawer(item.screen, item.params)}
            >
              <View style={styles.menuIconContainer}>
                <IconComponent size={moderateScale(24)} color={item.color} />
                {item.badge && item.badge > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.menuText}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Add menu button to children if they need it */}
      {React.cloneElement(children, {
        toggleDrawer,
        MenuButton: () => (
          <TouchableOpacity style={styles.menuButton} onPress={toggleDrawer}>
            <Menu size={moderateScale(24)} color="#fff" />
          </TouchableOpacity>
        ),
      })}

      {/* Drawer Overlay */}
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
  container: {
    flex: 1,
  },
  menuButton: {
    padding: moderateScale(8),
    marginRight: moderateScale(12),
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
    backgroundColor: "#22c55e",
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
});

export default DrawerNavigator;
