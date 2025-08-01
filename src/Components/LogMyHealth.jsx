import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import axios from "axios";
import BASE_URL from "../Config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LogMyHealth = () => {
  const [bp, setBp] = useState("");
  const [sugar, setSugar] = useState("");
  const [cholesterol, setCholesterol] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Optional: if you're using notes in payload
  const [notes, setNotes] = useState("");

  const handleDateChange = (event, selectedDate) => {
    console.log("📅 Date picker opened");
    setShowDatePicker(false);
    if (selectedDate) {
      console.log("📅 Date selected:", selectedDate.toISOString());
      setDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    console.log("📤 Submit button pressed");

    if (!bp || !sugar || !cholesterol) {
      console.warn("❗Missing required fields");
      Alert.alert("Missing Info", "Please fill in all the health fields.");
      return;
    }
    const userId = await AsyncStorage.getItem("userID");

    const data = {
      userId: userId, // must exist
      date: date.toISOString(),
      bloodPressure: bp,
      sugarLevel: sugar,
      cholesterol,
      notes,
    };

    console.log("🧾 Prepared data to send:", data);

    try {
      const res = await axios.post(`${BASE_URL}/api/auth/add-health-log`, data);

      console.log("✅ Response from server:", res.data);

      if (res.status === 200 || res.data.success) {
        Alert.alert("✅ Success", "Health log created successfully");

        // Clear inputs
        setBp("");
        setSugar("");
        setCholesterol("");
        setNotes("");
        setDate(new Date());
      } else {
        Alert.alert("⚠️ Failed", "Something went wrong");
      }
    } catch (error) {
      Alert.alert("❌ Error", "Could not submit health data");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Log My Health</Text>

      <TouchableOpacity
        onPress={() => {
          console.log("📅 Date picker toggled");
          setShowDatePicker(true);
        }}
        style={styles.input}
      >
        <Text style={styles.inputText}>{date.toDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Blood Pressure (e.g., 120/80)"
        value={bp}
        onChangeText={(text) => {
          console.log("📝 BP changed:", text);
          setBp(text);
        }}
      />

      <TextInput
        style={styles.input}
        placeholder="Sugar Level (e.g., 110 mg/dL)"
        value={sugar}
        onChangeText={(text) => {
          console.log("📝 Sugar changed:", text);
          setSugar(text);
        }}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Cholesterol (e.g., 180 mg/dL)"
        value={cholesterol}
        onChangeText={(text) => {
          console.log("📝 Cholesterol changed:", text);
          setCholesterol(text);
        }}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Notes (optional)"
        value={notes}
        onChangeText={(text) => {
          console.log("📝 Notes changed:", text);
          setNotes(text);
        }}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: moderateScale(20),
    backgroundColor: "#f2f2f2",
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    marginBottom: verticalScale(20),
    textAlign: "center",
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    padding: moderateScale(12),
    marginVertical: verticalScale(8),
    borderRadius: scale(10),
    fontSize: moderateScale(14),
  },
  inputText: {
    fontSize: moderateScale(14),
    color: "#000",
  },
  button: {
    backgroundColor: "#0066cc",
    padding: moderateScale(14),
    borderRadius: scale(10),
    marginTop: verticalScale(20),
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: moderateScale(16),
    fontWeight: "bold",
  },
});

export default LogMyHealth;
