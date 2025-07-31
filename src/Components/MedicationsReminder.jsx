import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import ScreenWrapper from "../Constants/ScreenWrapper";

// Sample data - ideally this should come from API
const initialMedications = [
  {
    id: 1,
    name: "Amlodipine",
    time: "08:00 AM",
    taken: false,
  },
  {
    id: 2,
    name: "Metformin",
    time: "01:00 PM",
    taken: false,
  },
  {
    id: 3,
    name: "Atorvastatin",
    time: "08:00 PM",
    taken: false,
  },
];

const MedicationsReminder = () => {
  const [medications, setMedications] = useState(initialMedications);

  const markAsTaken = (id) => {
    const updated = medications.map((med) =>
      med.id === id ? { ...med, taken: true } : med
    );
    setMedications(updated);
    Alert.alert("✅ Marked", "Medication marked as taken");
  };

  return (
    <ScreenWrapper>
      <Text style={styles.title}>Today's Medications</Text>

      {medications.map((med) => (
        <View key={med.id} style={styles.card}>
          <Text style={styles.medName}>{med.name}</Text>
          <Text style={styles.medTime}>🕒 {med.time}</Text>

          <TouchableOpacity
            style={[
              styles.statusButton,
              { backgroundColor: med.taken ? "#4CAF50" : "#FF9800" },
            ]}
            onPress={() => {
              if (!med.taken) markAsTaken(med.id);
            }}
            disabled={med.taken}
          >
            <Text style={styles.statusButtonText}>
              {med.taken ? "Taken" : "Mark as Taken"}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: moderateScale(20),
    backgroundColor: "#f9f9f9",
    flexGrow: 1,
    marginTop: verticalScale(15),
  },
  title: {
    fontSize: moderateScale(22),
    fontWeight: "bold",
    marginBottom: verticalScale(15),
    textAlign: "center",
    color: "#222",
  },
  card: {
    backgroundColor: "#fff",
    padding: moderateScale(15),
    borderRadius: scale(10),
    marginBottom: verticalScale(12),
    elevation: 2,
  },
  medName: {
    fontSize: moderateScale(16),
    fontWeight: "600",
    marginBottom: verticalScale(6),
    color: "#333",
  },
  medTime: {
    fontSize: moderateScale(14),
    color: "#666",
    marginBottom: verticalScale(10),
  },
  statusButton: {
    padding: moderateScale(10),
    borderRadius: scale(8),
  },
  statusButtonText: {
    color: "#fff",
    fontSize: moderateScale(14),
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default MedicationsReminder;
