import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

const ScreenWrapper = ({
  children,
  scrollable = false,
  style = {},
  noScrollView = false,
}) => {
  return (
    <>
      {/* StatusBar configuration */}
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#fff"
        translucent={false}
      />

      <SafeAreaView style={styles.safeArea}>
        {noScrollView ? (
          <View style={[styles.wrapper, style]}>{children}</View>
        ) : (
          <ScrollView
            style={[styles.wrapper, style]}
            contentContainerStyle={scrollable ? styles.scrollContainer : {}}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    // Remove the manual StatusBar height padding since SafeAreaView handles it
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
