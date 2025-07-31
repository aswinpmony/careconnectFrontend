import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  Image,
  StatusBar,
} from "react-native";
import { StyleSheet } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import {
  Phone,
  Video,
  Plus,
  Edit3,
  Trash2,
  ArrowLeft,
  User,
  PhoneCall,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CallFamily = ({ onBack }) => {
  const [familyMembers, setFamilyMembers] = useState([
    {
      id: "1",
      name: "Sarah Johnson",
      relationship: "Daughter",
      phone: "+1 234 567 8901",
      avatar: null,
      isOnline: true,
    },
    {
      id: "2",
      name: "Michael Johnson",
      relationship: "Son",
      phone: "+1 234 567 8902",
      avatar: null,
      isOnline: false,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    phone: "",
  });

  const relationships = [
    "Son",
    "Daughter",
    "Spouse",
    "Sibling",
    "Parent",
    "Grandchild",
    "Other",
  ];

  const resetForm = () => {
    setFormData({ name: "", relationship: "", phone: "" });
    setEditingMember(null);
  };

  const handleAddMember = () => {
    if (!formData.name.trim() || !formData.phone.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const newMember = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      relationship: formData.relationship || "Family",
      phone: formData.phone.trim(),
      avatar: null,
      isOnline: Math.random() > 0.5,
    };

    setFamilyMembers((prev) => [...prev, newMember]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditMember = () => {
    if (!formData.name.trim() || !formData.phone.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setFamilyMembers((prev) =>
      prev.map((member) =>
        member.id === editingMember.id
          ? {
              ...member,
              name: formData.name.trim(),
              relationship: formData.relationship || member.relationship,
              phone: formData.phone.trim(),
            }
          : member
      )
    );
    setShowAddModal(false);
    resetForm();
  };

  const handleDeleteMember = (id) => {
    Alert.alert(
      "Delete Member",
      "Are you sure you want to remove this family member?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            setFamilyMembers((prev) => prev.filter((m) => m.id !== id)),
        },
      ]
    );
  };

  const handleCall = (member, isVideo = false) => {
    Alert.alert(
      isVideo ? "Video Call" : "Voice Call",
      `Calling ${member.name}...`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Call",
          onPress: () => {
            // Here you would integrate with your calling service
            console.log(
              `${isVideo ? "Video" : "Voice"} calling ${member.name} at ${
                member.phone
              }`
            );
          },
        },
      ]
    );
  };

  const openEditModal = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      relationship: member.relationship,
      phone: member.phone,
    });
    setShowAddModal(true);
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <ArrowLeft size={moderateScale(24)} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Call Family</Text>
          <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
            <Plus size={moderateScale(24)} color="#8b5cf6" />
          </TouchableOpacity>
        </View>

        {/* Family Members List */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {familyMembers.length === 0 ? (
            <View style={styles.emptyState}>
              <User size={moderateScale(64)} color="#d1d5db" />
              <Text style={styles.emptyTitle}>No Family Members</Text>
              <Text style={styles.emptySubtitle}>
                Add your family members to start video calling
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={openAddModal}
              >
                <Plus size={moderateScale(16)} color="#ffffff" />
                <Text style={styles.emptyButtonText}>Add Family Member</Text>
              </TouchableOpacity>
            </View>
          ) : (
            familyMembers.map((member) => (
              <View key={member.id} style={styles.memberCard}>
                <View style={styles.memberInfo}>
                  <View style={styles.avatarContainer}>
                    {member.avatar ? (
                      <Image
                        source={{ uri: member.avatar }}
                        style={styles.avatar}
                      />
                    ) : (
                      <View style={styles.avatarPlaceholder}>
                        <User size={moderateScale(20)} color="#8b5cf6" />
                      </View>
                    )}
                    {member.isOnline && <View style={styles.onlineIndicator} />}
                  </View>

                  <View style={styles.memberDetails}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberRelation}>
                      {member.relationship}
                    </Text>
                    <Text style={styles.memberPhone}>{member.phone}</Text>
                  </View>
                </View>

                <View style={styles.memberActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleCall(member, false)}
                  >
                    <PhoneCall size={moderateScale(16)} color="#10b981" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.videoButton]}
                    onPress={() => handleCall(member, true)}
                  >
                    <Video size={moderateScale(16)} color="#8b5cf6" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => openEditModal(member)}
                  >
                    <Edit3 size={moderateScale(14)} color="#6b7280" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDeleteMember(member.id)}
                  >
                    <Trash2 size={moderateScale(14)} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        {/* Add/Edit Modal */}
        <Modal
          visible={showAddModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowAddModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Text style={styles.modalCancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {editingMember ? "Edit Member" : "Add Family Member"}
              </Text>
              <TouchableOpacity
                onPress={editingMember ? handleEditMember : handleAddMember}
              >
                <Text style={styles.modalSave}>Save</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter full name"
                  value={formData.name}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, name: text }))
                  }
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Relationship</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.relationshipContainer}>
                    {relationships.map((relation) => (
                      <TouchableOpacity
                        key={relation}
                        style={[
                          styles.relationshipChip,
                          formData.relationship === relation &&
                            styles.relationshipChipActive,
                        ]}
                        onPress={() =>
                          setFormData((prev) => ({
                            ...prev,
                            relationship: relation,
                          }))
                        }
                      >
                        <Text
                          style={[
                            styles.relationshipText,
                            formData.relationship === relation &&
                              styles.relationshipTextActive,
                          ]}
                        >
                          {relation}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, phone: text }))
                  }
                  keyboardType="phone-pad"
                />
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    marginTop: verticalScale(25),
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(15),
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backButton: {
    padding: moderateScale(8),
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: "600",
    color: "#111827",
  },
  addButton: {
    padding: moderateScale(8),
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(20),
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(60),
  },
  emptyTitle: {
    fontSize: moderateScale(20),
    fontWeight: "600",
    color: "#374151",
    marginTop: verticalScale(16),
  },
  emptySubtitle: {
    fontSize: moderateScale(14),
    color: "#6b7280",
    textAlign: "center",
    marginTop: verticalScale(8),
    marginBottom: verticalScale(24),
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8b5cf6",
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(8),
  },
  emptyButtonText: {
    color: "#ffffff",
    fontSize: moderateScale(14),
    fontWeight: "500",
    marginLeft: scale(8),
  },
  memberCard: {
    backgroundColor: "#ffffff",
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    marginVertical: verticalScale(6),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  memberInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    position: "relative",
    marginRight: scale(12),
  },
  avatar: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
  },
  avatarPlaceholder: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: moderateScale(12),
    height: moderateScale(12),
    borderRadius: moderateScale(6),
    backgroundColor: "#10b981",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: moderateScale(16),
    fontWeight: "600",
    color: "#111827",
  },
  memberRelation: {
    fontSize: moderateScale(13),
    color: "#8b5cf6",
    marginTop: verticalScale(2),
  },
  memberPhone: {
    fontSize: moderateScale(12),
    color: "#6b7280",
    marginTop: verticalScale(2),
  },
  memberActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: moderateScale(8),
    marginLeft: scale(4),
    borderRadius: moderateScale(6),
    backgroundColor: "#f9fafb",
  },
  videoButton: {
    backgroundColor: "#f3f4f6",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalCancel: {
    fontSize: moderateScale(16),
    color: "#6b7280",
  },
  modalTitle: {
    fontSize: moderateScale(17),
    fontWeight: "600",
    color: "#111827",
  },
  modalSave: {
    fontSize: moderateScale(16),
    color: "#8b5cf6",
    fontWeight: "600",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(20),
  },
  inputGroup: {
    marginBottom: verticalScale(20),
  },
  inputLabel: {
    fontSize: moderateScale(14),
    fontWeight: "500",
    color: "#374151",
    marginBottom: verticalScale(8),
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: moderateScale(8),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(12),
    fontSize: moderateScale(16),
    backgroundColor: "#ffffff",
  },
  relationshipContainer: {
    flexDirection: "row",
    paddingVertical: verticalScale(4),
  },
  relationshipChip: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
    backgroundColor: "#f3f4f6",
    marginRight: scale(8),
  },
  relationshipChipActive: {
    backgroundColor: "#8b5cf6",
  },
  relationshipText: {
    fontSize: moderateScale(14),
    color: "#6b7280",
  },
  relationshipTextActive: {
    color: "#ffffff",
    fontWeight: "500",
  },
});

export default CallFamily;
