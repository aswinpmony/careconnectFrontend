// components/Loader.js
import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

const Loader = () => (
  <View style={styles.overlay}>
    <ActivityIndicator size="large" color="#fff" />
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});

export default Loader;
