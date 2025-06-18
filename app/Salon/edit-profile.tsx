import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
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
import { AppDispatch } from "../store";
import { setSalonProfile } from "../store/slices/salonProfileSlice";

export default function EditProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [salonData, setSalonData] = useState({});

  const salonProfile = useSelector((state) => state.salonProfile);
  const dispatch = useDispatch<AppDispatch>();
  

  useEffect(() => {
    if (salonProfile && Object.keys(salonProfile).length > 0) {
      setSalonData({
        name: salonProfile.salon_name || "",
        description: salonProfile.description || "",
        city: salonProfile.city || "",
        address: salonProfile.address || "",
        phone: salonProfile.phone || "", // only if added in DB
        workingHours: `From: ${salonProfile.open_time} - ${salonProfile.close_time}`,
        image: salonProfile.ambience_images?.[0] || "",
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

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold">Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          <Text className="text-blue-500 font-semibold">
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
          <View className="items-center mb-6">
            <View className="relative">
              <Image
                source={
                  salonData.image
                    ? { uri: salonData.image }
                    : require("../../assets/images/adaptive-icon.png")
                }
                className="w-40 h-40 rounded-2xl"
              />
              <TouchableOpacity className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md">
                <Ionicons name="camera" size={20} color="black" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Form Fields */}
          <View className="space-y-8">
            {/* Salon Name */}
            <View>
              <Text className="text-gray-600 mb-2">Salon Name</Text>
              <TextInput
                value={salonData.name}
                onChangeText={(text) =>
                  setSalonData({ ...salonData, name: text })
                }
                className="border border-gray-300 rounded-lg p-3"
              />
            </View>

            {/* Description */}
            <View>
              <Text className="text-gray-600 mb-2">Description</Text>
              <TextInput
                value={salonData.description}
                onChangeText={(text) =>
                  setSalonData({ ...salonData, description: text })
                }
                multiline
                numberOfLines={4}
                className="border border-gray-300 rounded-lg p-3"
              />
            </View>

            {/* Location */}
            <View>
              <Text className="text-gray-600 mb-2">City</Text>
              <TextInput
                value={salonData.city}
                onChangeText={(text) =>
                  setSalonData({ ...salonData, location: text })
                }
                className="border border-gray-300 rounded-lg p-3"
              />
            </View>

            {/* Address */}
            <View>
              <Text className="text-gray-600 mb-2">Address</Text>
              <TextInput
                value={salonData.address}
                onChangeText={(text) =>
                  setSalonData({ ...salonData, address: text })
                }
                className="border border-gray-300 rounded-lg p-3"
              />
            </View>

            {/* Phone */}
            <View>
              <Text className="text-gray-600 mb-2">Phone</Text>
              <TextInput
                value={salonData.phone}
                onChangeText={(text) =>
                  setSalonData({ ...salonData, phone: text })
                }
                keyboardType="phone-pad"
                className="border border-gray-300 rounded-lg p-3"
              />
            </View>

            {/* Working Hours */}
            <View>
              <Text className="text-gray-600 mb-2">Working Hours</Text>
              <TextInput
                value={salonData.workingHours}
                onChangeText={(text) =>
                  setSalonData({ ...salonData, workingHours: text })
                }
                className="border border-gray-300 rounded-lg p-3"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {/* Footer (now stays fixed at bottom) */}
      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
        <Footer />
      </View>
    </SafeAreaView>
  );
}
