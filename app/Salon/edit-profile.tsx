import React, { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { updateSalonProfile } from "../apis/salonApi";
import Footer from "../components/salon/Footer";
import { useThemeContext } from "../contexts/ThemeContext";
import { supabase } from '../credentials/supabaseClient';
import { AppDispatch, RootState } from "../store";
import { setSalonProfile } from "../store/slices/salonProfileSlice";

export default function EditProfile() {
  const router = useRouter();
  const { colors } = useThemeContext();
  const [loading, setLoading] = useState(false);
  const [salonData, setSalonData] = useState({
    name: '',
    description: '',
    city: '',
    address: '',
    phone: '',
    location: '',
    workingHours: '',
    image: '',
  });

  const salonProfile = useSelector((state: RootState) => state.salonProfile);
  const dispatch = useDispatch<AppDispatch>();
  const [modalVisible, setModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
      const onBackPress = () => {
        router.replace('/Salon/Profile'); // Replace '/Role' with your target route path
        return true;
      };
  
      const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
  
      return () => backHandler.remove();
    }, [router]);
  

  useEffect(() => {
    if (salonProfile && Object.keys(salonProfile).length > 0) {
      setSalonData({
        name: salonProfile.salon_name || '',
        description: salonProfile.description || '',
        city: salonProfile.city || '',
        address: salonProfile.address || '',
        phone: salonProfile.phone || '',
        location: salonProfile.city || '',
        workingHours: `From: ${salonProfile.open_time} - ${salonProfile.close_time}`,
        image: salonProfile.ambience_images?.[0] || '',
      });
    }
  }, [salonProfile]);

  const handleSave = async () => {
    try {
      setLoading(true);

      // Split working hours into open and close time
      let open_time = "",
        close_time = "";
      const workingHoursParts = salonData.workingHours.split(": ");
      if (workingHoursParts.length === 2) {
        const times = workingHoursParts[1].split(" - ");
        if (times.length === 2) {
          open_time = times[0].trim();
          close_time = times[1].trim();
        }
      }

      const result = await updateSalonProfile({
        salon_name: salonData.name,
        description: salonData.description,
        address: salonData.address,
        phone: salonData.phone,
        city: salonData.location,
        open_time,
        close_time,
        ambience_images: salonData.image ? [salonData.image] : [], // Optional image
      });

      setLoading(false);


      if (result.error) {
        Alert.alert("Error updating profile: " + result.error);
      } else {
        dispatch(
          setSalonProfile({
            salon_name: salonData.name,
            description: salonData.description,
            address: salonData.address,
            phone: salonData.phone,
            city: salonData.location,
            open_time,
            close_time,
            ambience_images: salonData.image ? [salonData.image] : [],
          })
        );
        Alert.alert("Success", "Profile updated successfully");
        router.back();
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Unexpected error while updating profile.");
      console.error(error);
    }
  };

  // Helper to upload image to Supabase Storage
  const uploadImageAsync = async (uri: string) => {
    try {
      setUploading(true);
      const fileExt = uri.split('.').pop()?.split('?')[0] || 'jpg';
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      const response = await fetch(uri);
      const blob = await response.blob();
      const { data, error } = await supabase.storage.from('avatars').upload(filePath, blob, {
        cacheControl: '3600',
        upsert: false,
        contentType: blob.type || 'image/jpeg',
      });
      if (error) throw error;
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
        setSalonData((prev: any) => ({
          ...prev,
          image: publicUrl,
        }));
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text }}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          <Text style={{ color: colors.primary, fontWeight: '600' }}>
            {loading ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 100, // Extra space for footer
            paddingTop: 12,
            paddingHorizontal: 16,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Profile Image */}
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <>
              <Pressable onPress={() => setModalVisible(true)} style={{ alignItems: 'center' }}>
                <Image
                  source={salonData.image ? { uri: salonData.image } : require("../../assets/images/adaptive-icon.png")}
                  style={{ width: 160, height: 160, borderRadius: 24, borderWidth: 2, borderColor: colors.primary }}
                />
                {/* Camera Icon Button */}
                <TouchableOpacity
                  onPress={handlePickImage}
                  disabled={uploading}
                  style={{ position: 'absolute', bottom: 8, right: 8, backgroundColor: colors.surface, borderRadius: 20, padding: 8, borderWidth: 1, borderColor: colors.border }}
                  hitSlop={10}
                >
                  <Ionicons name="camera" size={20} color={colors.primary} />
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
                    source={salonData.image ? { uri: salonData.image } : require("../../assets/images/adaptive-icon.png")}
                    style={{ width: 320, height: 320, borderRadius: 24, borderWidth: 3, borderColor: colors.primary, marginBottom: 24 }}
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

          {/* Form Fields */}
          <View style={{ gap: 32 }}>
            {/* Salon Name */}
            <View>
              <Text style={{ color: colors.textSecondary, marginBottom: 8 }}>Salon Name</Text>
              <TextInput
                value={salonData.name}
                onChangeText={(text) =>
                  setSalonData({ ...salonData, name: text })
                }
                style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, color: colors.text, backgroundColor: colors.card }}
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            {/* Description */}
            <View>
              <Text style={{ color: colors.textSecondary, marginBottom: 8 }}>Description</Text>
              <TextInput
                value={salonData.description}
                onChangeText={(text) =>
                  setSalonData({ ...salonData, description: text })
                }
                multiline
                numberOfLines={4}
                style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, color: colors.text, backgroundColor: colors.card }}
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            {/* Location */}
            <View>
              <Text style={{ color: colors.textSecondary, marginBottom: 8 }}>City</Text>
              <TextInput
                value={salonData.city}
                onChangeText={(text) =>
                  setSalonData({ ...salonData, location: text })
                }
                style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, color: colors.text, backgroundColor: colors.card }}
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            {/* Address */}
            <View>
              <Text style={{ color: colors.textSecondary, marginBottom: 8 }}>Address</Text>
              <TextInput
                value={salonData.address}
                onChangeText={(text) =>
                  setSalonData({ ...salonData, address: text })
                }
                style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, color: colors.text, backgroundColor: colors.card }}
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            {/* Phone */}
            <View>
              <Text style={{ color: colors.textSecondary, marginBottom: 8 }}>Phone</Text>
              <TextInput
                value={salonData.phone}
                onChangeText={(text) =>
                  setSalonData({ ...salonData, phone: text })
                }
                keyboardType="phone-pad"
                style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, color: colors.text, backgroundColor: colors.card }}
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            {/* Working Hours */}
            <View>
              <Text style={{ color: colors.textSecondary, marginBottom: 8 }}>Working Hours</Text>
              <TextInput
                value={salonData.workingHours}
                onChangeText={(text) =>
                  setSalonData({ ...salonData, workingHours: text })
                }
                style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, color: colors.text, backgroundColor: colors.card }}
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {/* Footer (now stays fixed at bottom) */}
      <SafeAreaView style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
        <Footer />
      </SafeAreaView>
    </SafeAreaView>
  );
}
