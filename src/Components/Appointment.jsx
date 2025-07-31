import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

// Sample appointment data
const initialAppointments = [
  {
    id: 1,
    doctor: "Dr. Nisha Menon",
    specialization: "Cardiologist",
    clinic: "City Heart Hospital",
    date: "2025-08-02",
    time: "10:30 AM",
    confirmed: false,
  },
  {
    id: 2,
    doctor: "Dr. Rajeev Nair",
    specialization: "Endocrinologist",
    clinic: "Sunrise Medical Center",
    date: "2025-08-05",
    time: "02:00 PM",
    confirmed: false,
  },
];

const Appointment = () => {
  const [appointments, setAppointments] = useState(initialAppointments);

  const handleConfirm = (id) => {
    const updated = appointments.map((item) =>
      item.id === id ? { ...item, confirmed: true } : item
    );
    setAppointments(updated);
    Alert.alert("✅ Confirmed", "Your appointment has been confirmed.");
  };

  const handleReschedule = () => {
    Alert.alert("📅 Reschedule", "You can contact the clinic to reschedule.");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>My Appointments</Text>

      {appointments.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.doctorName}>{item.doctor}</Text>
          <Text style={styles.specialization}>{item.specialization}</Text>
          <Text style={styles.info}>🏥 {item.clinic}</Text>
          <Text style={styles.info}>📅 {item.date}</Text>
          <Text style={styles.info}>🕒 {item.time}</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: item.confirmed ? "#4CAF50" : "#2196F3",
                },
              ]}
              onPress={() => handleConfirm(item.id)}
              disabled={item.confirmed}
            >
              <Text style={styles.buttonText}>
                {item.confirmed ? "Confirmed" : "Confirm"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#FF5722" }]}
              onPress={handleReschedule}
            >
              <Text style={styles.buttonText}>Reschedule</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: moderateScale(20),
    backgroundColor: "#f4f4f4",
    flexGrow: 1,
    marginTop: verticalScale(15),
  },
  title: {
    fontSize: moderateScale(22),
    fontWeight: "bold",
    marginBottom: verticalScale(20),
    textAlign: "center",
    color: "#222",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: scale(10),
    padding: moderateScale(15),
    marginBottom: verticalScale(15),
    elevation: 3,
  },
  doctorName: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#333",
    marginBottom: verticalScale(5),
  },
  specialization: {
    fontSize: moderateScale(14),
    color: "#666",
    marginBottom: verticalScale(10),
  },
  info: {
    fontSize: moderateScale(14),
    marginBottom: verticalScale(4),
    color: "#444",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: verticalScale(12),
  },
  button: {
    flex: 0.48,
    paddingVertical: moderateScale(10),
    borderRadius: scale(8),
  },
  buttonText: {
    color: "#fff",
    fontSize: moderateScale(14),
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default Appointment;
