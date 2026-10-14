import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import BASE_URL from "../Config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserSearchScreen = ({ navigation, route }) => {
  const { userRole } = route.params;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleSearch = async (text) => {
    console.log("🔍 Search triggered with text:", text);
    console.log("👤 Current userRole (who is searching):", userRole);

    setQuery(text);

    if (!text.trim()) {
      console.log("ℹ️ Empty text, clearing results");
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const currentUserId = await AsyncStorage.getItem("userID");
      console.log("🆔 Logged-in user ID:", currentUserId);

      if (!currentUserId) {
        console.warn("⚠️ No logged-in user ID found");
        setLoading(false);
        return;
      }

      const apiURL = `${BASE_URL}/api/auth/search-users?q=${encodeURIComponent(
        text.trim()
      )}&userId=${currentUserId}`;
      console.log("🌐 Calling API:", apiURL);

      const response = await fetch(apiURL);

      console.log("📡 API status:", response.status);

      if (!response.ok) throw new Error("Failed to fetch search results");

      const data = await response.json();
      console.log("📥 Raw data from API:", data);

      const filteredResults = (data || []).filter((u) => {
        console.log(`➡️ Checking user: ${u.fullName}, role: ${u.role}`);
        return u.role !== userRole;
      });

      console.log(
        "📤 Filtered results (after removing same role):",
        filteredResults
      );

      setResults(filteredResults);
    } catch (err) {
      setResults([]);
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
              {item.fullName?.charAt(0)?.toUpperCase() || "?"}
            </Text>
          )}
        </View>
        <Text style={styles.userName}>{item.fullName || "No Name"}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search here"
        value={query}
        onChangeText={handleSearch}
      />

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
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
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#fff",
  },
  userName: {
    fontSize: 16,
  },
});

export default UserSearchScreen;
