import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { getSalonProfile, getServices } from "../apis/salonApi";
import Footer from "../components/salon/Footer";
import { AppDispatch } from "../store";
import { setSalonProfile } from "../store/slices/salonProfileSlice";

export default function Profile() {
  const router = useRouter();
  const [salonData, setSalonData] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(
      useCallback(() => {
        const onBackPress = () => {
          Alert.alert(
            "Exit App",
            "Are you sure you want to exit?",
            [
              {
                text: "Cancel",
                onPress: () => null,
                style: "cancel",
              },
              {
                text: "Yes",
                onPress: () => BackHandler.exitApp(),
              },
            ],
            { cancelable: false }
          );
          return true; // prevent default behavior
        };
  
        const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          onBackPress
        );
  
        return () => backHandler.remove();
      }, [])
    );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const salonResult = await getSalonProfile();
        if (salonResult.error) throw new Error(salonResult.error);
        setSalonData(salonResult.profile);
        dispatch(setSalonProfile(salonResult.profile)); // ✅ Dispatching to Redux

        const serviceResult = await getServices();
        if (serviceResult.error) throw new Error(serviceResult.error);
        setServices(serviceResult.services);

        // console.log("Salon:", salonResult.profile);
        // console.log("Services:", serviceResult.services);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !salonData) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#007bff" />
        <Text className="text-lg text-gray-500 mt-2">Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header with Back Button */}
        <View className="flex-row items-center p-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold">Profile</Text>
        </View>

        {/* Profile Image Section */}
        <View className="items-center mt-4">
          <View className="relative">
            <Image
              source={
                salonData.image
                  ? { uri: salonData.image }
                  : require("../../assets/images/adaptive-icon.png")
              }
              className="w-40 h-40 rounded-2xl"
            />
            <TouchableOpacity
              onPress={() => router.push("/Salon/edit-profile")}
              className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md"
            >
              <Ionicons name="camera" size={20} color="black" />
            </TouchableOpacity>
          </View>
          <Text className="text-2xl font-bold mt-4">
            {salonData.salon_name}
          </Text>
          <Text className="text-lg font-semibold ml-1">
            {salonData.average_rating?.toFixed(1) ?? "N/A"}
          </Text>

          {/* Rating Section */}
          <View className="flex-row items-center mt-2">
            <Ionicons name="star" size={20} color="#FFD700" />
            {/* <Text className="text-lg font-semibold ml-1">{salonData.rating}</Text> */}
            <Text className="text-gray-500 ml-1">
              ({salonData.total_reviews} reviews)
            </Text>
          </View>
        </View>

        {/* Edit Profile Button */}
        <TouchableOpacity
          onPress={() => router.push("/Salon/edit-profile")}
          className="mx-4 mt-4 bg-blue-500 p-3 rounded-xl"
        >
          <Text className="text-white text-center font-semibold">
            Edit Profile
          </Text>
        </TouchableOpacity>

        {/* Information Section */}
        <View className="p-4 mt-4">
          {/* Description */}
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-2">About</Text>
            <Text className="text-gray-600">{salonData.description}</Text>
          </View>

          {/* Location & Address */}
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-2">Location</Text>
            <View className="flex-row items-center mb-2">
              <Ionicons name="location" size={20} color="#666" />
              <Text className="text-gray-600 ml-2">{salonData.address}</Text>
            </View>
            <Text className="text-gray-600 ml-6">{salonData.address}</Text>
          </View>

          {/* Contact */}
          {/* <View className="mb-6">
            <Text className="text-lg font-semibold mb-2">Contact</Text>
            <View className="flex-row items-center mb-2">
              <Ionicons name="call" size={20} color="#666" />
              <Text className="text-gray-600 ml-2">{salonData.phone}</Text>
            </View>
          </View> */}

          {/* Working Hours */}
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-2">Working Hours</Text>
            <View className="flex-row items-center">
              <Ionicons name="time" size={20} color="#666" />
              <Text className="text-gray-600 ml-2">
                {salonData.open_time} to {salonData.close_time}
              </Text>
            </View>
          </View>

          {/* Services */}
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-2">Services</Text>
            <View className="flex-row flex-wrap">
              {services.length === 0 ? (
                <Text className="text-gray-500">No services added yet.</Text>
              ) : (
                services.map((service) => (
                  <View
                    key={service.id}
                    className="border border-gray-300 p-4 mb-3 rounded-lg"
                  >
                    <Text className="font-bold text-lg">{service.name}</Text>
                    <Text className="text-sm text-gray-600">
                      {service.description}
                    </Text>
                    <Text className="text-sm">
                      Duration: {service.duration_minutes} mins
                    </Text>
                    <Text className="text-sm">Price: Rs. {service.price}</Text>
                  </View>
                ))
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
}
