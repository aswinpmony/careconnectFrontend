import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { SafeAreaView } from "react-native-safe-area-context";

const ScreenWrapper = ({ children, scrollable = false, style = {} }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={[styles.wrapper, style]}
        contentContainerStyle={scrollable ? styles.scrollContainer : {}}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(10),
  },
  scrollContainer: {
    flexGrow: 1,
  },
});

export default ScreenWrapper;
