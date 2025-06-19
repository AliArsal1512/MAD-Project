import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import {
  Alert,
  BackHandler,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { editCustomerProfile, getCurrentCustomerProfile } from "../apis/customerApi";
import Footer from "../components/customer/Footer";
import { useThemeContext } from "../contexts/ThemeContext";
import { supabase } from '../credentials/supabaseClient';

export default function EditCustomerProfile() {
  const router = useRouter();
  const { colors } = useThemeContext();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [customerData, setCustomerData] = useState({
    image: "",
    full_name: "",
    phone: "",
    gender: "",
    email: "",
    avatar_url: "",
  });
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
      const onBackPress = () => {
        router.replace('/Customer/CustomerProfile'); // Replace '/Role' with your target route path
        return true;
      };
  
      const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
  
      return () => backHandler.remove();
    }, [router]);

  // Helper to upload image to Supabase Storage
  const uploadImageAsync = async (uri: string) => {
    try {
      setUploading(true);
      // Get file extension
      const fileExt = uri.split('.').pop()?.split('?')[0] || 'jpg';
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Convert image to blob (Expo fetch)
      const response = await fetch(uri);
      const blob = await response.blob();

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage.from('avatars').upload(filePath, blob, {
        cacheControl: '3600',
        upsert: false,
        contentType: blob.type || 'image/jpeg',
      });
      if (error) throw error;

      // Get public URL
      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setUploading(false);
      return publicUrlData.publicUrl;
    } catch (e: any) {
      setUploading(false);
      Alert.alert('Upload failed', e.message || 'Could not upload image');
      return null;
    }
  };

  // Pick image and upload
  const handlePickImage = async () => {
    // Request permission first
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please grant media library permissions to upload a profile picture.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      const publicUrl = await uploadImageAsync(uri);
      if (publicUrl) {
        setCustomerData((prev) => ({
          ...prev,
          image: publicUrl,
          avatar_url: publicUrl,
        }));
      }
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const { profile, error } = await getCurrentCustomerProfile();
      if (error) {
        Alert.alert("Error", error);
      } else {
        setCustomerData((prev) => ({
          ...prev,
          image: profile.avatar_url || prev.image || "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?auto=format&fit=crop&w=400&q=80",
          avatar_url: profile.avatar_url || prev.avatar_url || "",
          full_name: profile.full_name || "",
          phone: profile.phone || "",
          gender: profile.gender || "",
          email: profile.email || "",
        }));
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      const result = await editCustomerProfile({
        full_name: customerData.full_name,
        phone: customerData.phone,
        gender: customerData.gender,
        email: customerData.email,
        avatar_url: customerData.avatar_url,
      });

      setLoading(false);

      if (result.error) {
        Alert.alert("Update Failed", result.error);
      } else {
        Alert.alert("Success", "Profile updated successfully");
        router.back();
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      Alert.alert("Unexpected Error", "Something went wrong");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text }}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          <Text style={{ color: colors.primary, fontWeight: '600' }}>
            {loading ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Form */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 100, paddingTop: 12, paddingHorizontal: 16 }}>
          {/* Profile Image */}
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <>
              <Pressable onPress={() => setModalVisible(true)} style={{ alignItems: 'center' }}>
                <Image
                  source={{ uri: customerData.image }}
                  style={{ width: 128, height: 128, borderRadius: 64, borderWidth: 2, borderColor: colors.primary }}
                />
                {/* Camera Icon Button */}
                <TouchableOpacity
                  onPress={handlePickImage}
                  disabled={uploading}
                  style={{ position: 'absolute', bottom: 8, right: 8, backgroundColor: colors.surface, borderRadius: 16, padding: 6, borderWidth: 1, borderColor: colors.border }}
                  hitSlop={10}
                >
                  <Ionicons name="camera" size={18} color={colors.primary} />
                </TouchableOpacity>
              </Pressable>
              {uploading && <Text style={{ color: colors.primary, marginTop: 8 }}>Uploading...</Text>}
              {/* Modal for enlarged image */}
              <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
              >
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' }}>
                  <Pressable style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onPress={() => setModalVisible(false)} />
                  <Image
                    source={{ uri: customerData.image }}
                    style={{ width: 320, height: 320, borderRadius: 16, borderWidth: 3, borderColor: colors.primary, marginBottom: 24 }}
                    resizeMode="contain"
                  />
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={{ backgroundColor: colors.surface, padding: 12, borderRadius: 24, borderWidth: 1, borderColor: colors.border }}
                  >
                    <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 16 }}>Close</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </>
          </View>

          {/* Full Name */}
          <Text style={{ color: colors.textSecondary, marginBottom: 4 }}>Full Name</Text>
          <TextInput
            value={customerData.full_name}
            onChangeText={(text) => setCustomerData({ ...customerData, full_name: text })}
            style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, marginBottom: 16, color: colors.text, backgroundColor: colors.card }}
            placeholderTextColor={colors.textSecondary}
          />

          {/* Phone */}
          <Text style={{ color: colors.textSecondary, marginBottom: 4 }}>Phone</Text>
          <TextInput
            value={customerData.phone}
            onChangeText={(text) => setCustomerData({ ...customerData, phone: text })}
            keyboardType="phone-pad"
            style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, marginBottom: 16, color: colors.text, backgroundColor: colors.card }}
            placeholderTextColor={colors.textSecondary}
          />

          {/* Gender */}
          <Text style={{ color: colors.textSecondary, marginBottom: 4 }}>Gender</Text>
          <TextInput
            value={customerData.gender}
            onChangeText={(text) => setCustomerData({ ...customerData, gender: text })}
            style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, marginBottom: 16, color: colors.text, backgroundColor: colors.card }}
            placeholderTextColor={colors.textSecondary}
          />

          {/* Email */}
          <Text style={{ color: colors.textSecondary, marginBottom: 4 }}>Email</Text>
          <TextInput
            value={customerData.email}
            onChangeText={(text) => setCustomerData({ ...customerData, email: text })}
            keyboardType="email-address"
            style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, marginBottom: 16, color: colors.text, backgroundColor: colors.card }}
            placeholderTextColor={colors.textSecondary}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer */}
      <SafeAreaView style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
        <Footer />
      </SafeAreaView>
    </SafeAreaView>
  );
}
