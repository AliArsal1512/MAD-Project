import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Footer from "../components/customer/Footer";
import { getCurrentCustomerProfile, editCustomerProfile } from "../apis/customerApi";

export default function EditCustomerProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [customerData, setCustomerData] = useState({
    image: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?auto=format&fit=crop&w=400&q=80",
    full_name: "",
    phone: "",
    gender: "",
    email: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const { profile, error } = await getCurrentCustomerProfile();
      if (error) {
        Alert.alert("Error", error);
      } else {
        setCustomerData({
          image: customerData.image,
          full_name: profile.full_name || "",
          phone: profile.phone || "",
          gender: profile.gender || "",
          email: profile.email || "",
        });
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
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold">Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          <Text className="text-blue-500 font-semibold">
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
          <View className="items-center mb-6">
            <Image
              source={{ uri: customerData.image }}
              className="w-32 h-32 rounded-full"
            />
          </View>

          {/* Full Name */}
          <Text className="text-gray-600 mb-1">Full Name</Text>
          <TextInput
            value={customerData.full_name}
            onChangeText={(text) => setCustomerData({ ...customerData, full_name: text })}
            className="border border-gray-300 rounded-lg p-3 mb-4"
          />

          {/* Phone */}
          <Text className="text-gray-600 mb-1">Phone</Text>
          <TextInput
            value={customerData.phone}
            onChangeText={(text) => setCustomerData({ ...customerData, phone: text })}
            keyboardType="phone-pad"
            className="border border-gray-300 rounded-lg p-3 mb-4"
          />

          {/* Gender */}
          <Text className="text-gray-600 mb-1">Gender</Text>
          <TextInput
            value={customerData.gender}
            onChangeText={(text) => setCustomerData({ ...customerData, gender: text })}
            className="border border-gray-300 rounded-lg p-3 mb-4"
          />

          {/* Email */}
          <Text className="text-gray-600 mb-1">Email</Text>
          <TextInput
            value={customerData.email}
            onChangeText={(text) => setCustomerData({ ...customerData, email: text })}
            keyboardType="email-address"
            className="border border-gray-300 rounded-lg p-3 mb-4"
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer */}
      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
        <Footer />
      </View>
    </SafeAreaView>
  );
}
