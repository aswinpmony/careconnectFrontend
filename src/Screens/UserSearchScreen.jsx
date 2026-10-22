import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import apiClient from "../Config/apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserSearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (text) => {
    setQuery(text);
    setError("");

    const searchText = text.trim();

    if (!searchText) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const currentUserId = await AsyncStorage.getItem("userID");

      if (!currentUserId) {
        setResults([]);
        setError("Please log in again.");
        return;
      }

      const response = await apiClient.get("/api/auth/search-users", {
        params: {
          q: searchText,
          userId: currentUserId,
        },
        timeout: 10000,
      });

      const users = Array.isArray(response.data) ? response.data : [];

      console.log(
        "Search results:",
        users.map((user) => ({
          id: user._id,
          name: user.fullName,
          role: user.role,
        }))
      );

      setResults(users);
    } catch (err) {
      console.error(
        "Search error:",
        err.response?.status,
        err.response?.data || err.message
      );

      setResults([]);
      setError(
        err.response?.data?.message ||
          "Unable to search users. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("UserProfile", { user: item })}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.avatar}>
          {item.profileImage ? (
            <Image
              source={{ uri: item.profileImage }}
              style={styles.avatarImage}
            />
          ) : (
            <Text style={styles.avatarText}>
              {item.fullName?.trim()?.charAt(0)?.toUpperCase() || "?"}
            </Text>
          )}
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {item.fullName?.trim() || "Name unavailable"}
          </Text>

          <Text style={styles.userRole}>
            {item.role === "Elder" ? "Elder" : "Caregiver"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search by name"
        value={query}
        onChangeText={handleSearch}
        autoCapitalize="words"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#2563EB" />
      ) : error ? (
        <Text style={styles.message}>{error}</Text>
      ) : query.trim() && results.length === 0 ? (
        <Text style={styles.message}>No matching users found.</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#F2F2F2",
  },
  input: {
    height: 50,
    borderColor: "#999",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    marginBottom: 20,
    color: "#111827",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    overflow: "hidden",
  },
  avatarImage: {
    width: 40,
    height: 40,
  },
  avatarText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#fff",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  userRole: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },
  message: {
    textAlign: "center",
    marginTop: 20,
    color: "#6B7280",
  },
});

export default UserSearchScreen;