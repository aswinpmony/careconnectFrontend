import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import {
  Heart,
  Video,
  Shield,
  Users,
  Smartphone,
  Activity,
  Clock,
  MapPin,
} from "lucide-react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import ScreenWrapper from "../Constants/ScreenWrapper";
const IntroScreen = ({ navigation }) => {
  const pulseAnim = new Animated.Value(1);

  React.useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    pulse();
  }, []);

  return (
    <ScreenWrapper>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Heart color="white" size={scale(32)} />
          </View>
          <Text style={styles.title}>CareConnect</Text>
        </View>
        <Text style={styles.subtitle}>Bridging Distance with Care</Text>
      </View>

      {/* Central Illustration Section */}
      <View style={styles.illustrationCard}>
        {/* Family Connection Visual */}
        <View style={styles.connectionContainer}>
          {/* Parent Side */}
          <View style={styles.parentCard}>
            <View style={styles.parentAvatar}>
              <View style={styles.avatarInner}>
                <Text style={styles.avatarEmoji}>👴</Text>
              </View>
            </View>
            <Text style={styles.cardLabel}>Parent</Text>
            <View style={styles.statusBadge}>
              <Activity size={scale(16)} color="white" />
            </View>
          </View>

          {/* Connection Visual */}
          <View style={styles.connectionVisual}>
            <Animated.View
              style={[styles.videoIcon, { transform: [{ scale: pulseAnim }] }]}
            >
              <Video size={scale(32)} color="#3B82F6" />
              <View style={styles.activeDot} />
            </Animated.View>
            <View style={styles.connectionLine} />
            <MapPin size={scale(20)} color="#6B7280" />
          </View>

          {/* Child Side */}
          <View style={styles.childCard}>
            <View style={styles.childAvatar}>
              <View style={styles.avatarInner}>
                <Text style={styles.avatarEmoji}>👩</Text>
              </View>
            </View>
            <Text style={styles.cardLabel}>You</Text>
            <View style={styles.statusBadgeChild}>
              <Smartphone size={scale(16)} color="white" />
            </View>
          </View>
        </View>

        {/* Health Monitoring Icons */}
        <View style={styles.healthGrid}>
          <View style={[styles.healthItem, styles.bpItem]}>
            <View style={styles.healthIconContainer}>
              <Text style={styles.healthEmoji}>❤️</Text>
            </View>
            <Text style={styles.healthLabel}>BP</Text>
          </View>

          <View style={[styles.healthItem, styles.sugarItem]}>
            <View style={styles.healthIconContainer}>
              <Text style={styles.healthEmoji}>🍯</Text>
            </View>
            <Text style={styles.healthLabel}>Sugar</Text>
          </View>

          <View style={[styles.healthItem, styles.cholesterolItem]}>
            <View style={styles.healthIconContainer}>
              <Text style={styles.healthEmoji}>🧪</Text>
            </View>
            <Text style={styles.healthLabel}>Cholesterol</Text>
          </View>

          <View style={[styles.healthItem, styles.medsItem]}>
            <View style={styles.healthIconContainer}>
              <Text style={styles.healthEmoji}>💊</Text>
            </View>
            <Text style={styles.healthLabel}>Meds</Text>
          </View>
        </View>
      </View>

      {/* App Purpose Section */}
      <View style={styles.purposeSection}>
        <Text style={styles.purposeText}>
          CareConnect helps you track your loved ones' health, no matter where
          you are.
        </Text>
      </View>

      {/* Main Action Buttons */}
      <View style={styles.buttonSection}>
        <TouchableOpacity
          onPress={() => navigation.navigate("SignUp")}
          style={styles.primaryButton}
          activeOpacity={0.8}
        >
          <Users
            color="white"
            size={scale(24)}
            style={{ marginRight: scale(12) }}
          />
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={styles.secondaryButton}
          activeOpacity={0.8}
        >
          <Shield
            color="#3B82F6"
            size={scale(24)}
            style={{ marginRight: scale(12) }}
          />
          <Text style={styles.secondaryButtonText}>Login</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerIcons}>
          <View style={styles.footerIconItem}>
            <View style={[styles.footerIconContainer, styles.careIcon]}>
              <Heart size={scale(24)} color="#EC4899" />
            </View>
            <Text style={styles.footerIconLabel}>Care</Text>
          </View>

          <View style={styles.footerIconItem}>
            <View style={[styles.footerIconContainer, styles.connectIcon]}>
              <Video size={scale(24)} color="#3B82F6" />
            </View>
            <Text style={styles.footerIconLabel}>Connect</Text>
          </View>

          <View style={styles.footerIconItem}>
            <View style={[styles.footerIconContainer, styles.healthIcon]}>
              <Activity size={scale(24)} color="#10B981" />
            </View>
            <Text style={styles.footerIconLabel}>Health</Text>
          </View>

          <View style={styles.footerIconItem}>
            <View style={[styles.footerIconContainer, styles.alwaysIcon]}>
              <Clock size={scale(24)} color="#F59E0B" />
            </View>
            <Text style={styles.footerIconLabel}>Always</Text>
          </View>
        </View>

        <Text style={styles.footerText}>
          Your family's health, always within reach
        </Text>
      </View>
    </ScreenWrapper>
  );
};

export default IntroScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F9FF",
  },
  header: {
    alignItems: "center",
    paddingTop: verticalScale(60),
    paddingBottom: verticalScale(32),
    paddingHorizontal: scale(24),
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(12),
  },
  logo: {
    backgroundColor: "#3B82F6",
    padding: scale(12),
    borderRadius: 999,
    marginRight: scale(12),
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: moderateScale(32),
    fontWeight: "bold",
    color: "#1F2937",
  },
  subtitle: {
    fontSize: moderateScale(18),
    color: "#6B7280",
    fontWeight: "500",
  },
  illustrationCard: {
    marginHorizontal: scale(24),
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: scale(24),
    padding: scale(32),
    marginBottom: verticalScale(32),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  connectionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(24),
  },
  parentCard: {
    backgroundColor: "#DBEAFE",
    borderRadius: scale(16),
    padding: scale(24),
    alignItems: "center",
    position: "relative",
    marginRight: scale(16),
  },
  parentAvatar: {
    width: scale(64),
    height: scale(64),
    backgroundColor: "#93C5FD",
    borderRadius: scale(32),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(12),
  },
  childCard: {
    backgroundColor: "#D1FAE5",
    borderRadius: scale(16),
    padding: scale(24),
    alignItems: "center",
    position: "relative",
    marginLeft: scale(10),
  },
  childAvatar: {
    width: scale(64),
    height: scale(64),
    backgroundColor: "#6EE7B7",
    borderRadius: scale(32),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(12),
  },
  avatarInner: {
    width: scale(40),
    height: scale(40),
    backgroundColor: "white",
    borderRadius: scale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  avatarEmoji: {
    fontSize: moderateScale(20),
  },
  cardLabel: {
    fontSize: moderateScale(14),
    fontWeight: "600",
    color: "#1F2937",
  },
  statusBadge: {
    position: "absolute",
    bottom: scale(-8),
    right: scale(-8),
    backgroundColor: "#10B981",
    borderRadius: scale(16),
    padding: scale(8),
  },
  statusBadgeChild: {
    position: "absolute",
    bottom: scale(-8),
    left: scale(-8),
    backgroundColor: "#3B82F6",
    borderRadius: scale(16),
    padding: scale(8),
  },
  connectionVisual: {
    alignItems: "center",
    marginHorizontal: scale(16),
  },
  videoIcon: {
    position: "relative",
    marginBottom: verticalScale(8),
  },
  activeDot: {
    position: "absolute",
    top: scale(-4),
    right: scale(-4),
    width: scale(12),
    height: scale(12),
    backgroundColor: "#10B981",
    borderRadius: scale(6),
    borderWidth: 2,
    borderColor: "white",
  },
  connectionLine: {
    width: scale(80),
    height: scale(2),
    backgroundColor: "#3B82F6",
    marginVertical: verticalScale(8),
  },
  healthGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  healthItem: {
    flex: 1,
    alignItems: "center",
    borderRadius: scale(12),
    padding: scale(12),
    marginHorizontal: scale(4),
  },
  bpItem: {
    backgroundColor: "#FEE2E2",
  },
  sugarItem: {
    backgroundColor: "#FED7AA",
  },
  cholesterolItem: {
    backgroundColor: "#E9D5FF",
  },
  medsItem: {
    backgroundColor: "#CCFBF1",
  },
  healthIconContainer: {
    width: scale(32),
    height: scale(32),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(8),
  },
  healthEmoji: {
    fontSize: moderateScale(18),
  },
  healthLabel: {
    fontSize: moderateScale(12),
    fontWeight: "600",
    color: "#374151",
  },
  purposeSection: {
    paddingHorizontal: scale(24),
    marginBottom: verticalScale(32),
    alignItems: "center",
  },
  purposeText: {
    fontSize: moderateScale(18),
    color: "#374151",
    textAlign: "center",
    lineHeight: moderateScale(28),
  },
  buttonSection: {
    paddingHorizontal: scale(24),
    marginBottom: verticalScale(48),
  },
  primaryButton: {
    flexDirection: "row",
    backgroundColor: "#10B981",
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(24),
    borderRadius: scale(16),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(16),
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: moderateScale(18),
  },
  secondaryButton: {
    flexDirection: "row",
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(24),
    borderRadius: scale(16),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButtonText: {
    color: "#374151",
    fontWeight: "bold",
    fontSize: moderateScale(18),
  },
  footer: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingVertical: verticalScale(24),
    paddingHorizontal: scale(24),
  },
  footerIcons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: verticalScale(16),
  },
  footerIconItem: {
    alignItems: "center",
  },
  footerIconContainer: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(8),
  },
  careIcon: {
    backgroundColor: "#FCE7F3",
  },
  connectIcon: {
    backgroundColor: "#DBEAFE",
  },
  healthIcon: {
    backgroundColor: "#D1FAE5",
  },
  alwaysIcon: {
    backgroundColor: "#FEF3C7",
  },
  footerIconLabel: {
    fontSize: moderateScale(12),
    fontWeight: "600",
    color: "#6B7280",
  },
  footerText: {
    fontSize: moderateScale(12),
    color: "#9CA3AF",
    textAlign: "center",
  },
});
