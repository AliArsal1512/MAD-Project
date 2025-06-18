import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  BackHandler,
  Image,
  Linking,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Footer from '../components/customer/Footer';
import { useRouter } from 'expo-router';
import { getCurrentCustomerProfile } from '../apis/customerApi';

const initialCustomerInfo = {
  image:
    'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?auto=format&fit=crop&w=400&q=80',
  name: '',
  phone: '',
  email: '',
  gender: '',
};

export default function CustomerProfile() {
  const [customerInfo, setCustomerInfo] = useState(initialCustomerInfo);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
    const router = useRouter();

  const handleChange = (field: keyof typeof customerInfo, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleCall = () => {
    if (!isEditing) Linking.openURL(`tel:${customerInfo.phone}`);
  };

  useEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert("Exit App", "Are you sure you want to exit?", [
          { text: "Cancel", onPress: () => null, style: "cancel" },
          { text: "Yes", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );
      return () => backHandler.remove();
    }, [])
  );

  useEffect(() => {
    const fetchProfile = async () => {
      const { profile, error } = await getCurrentCustomerProfile();
      if (error) {
        Alert.alert("Error", error);
      } else {
        setCustomerInfo({
          image:
            'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?auto=format&fit=crop&w=400&q=80',
          name: profile.full_name || '',
          phone: profile.phone || '',
          gender: profile.gender || '',
          email: profile.email || '',
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-between bg-white p-4 mb-4">
      <ScrollView className="flex-row bg-gray-300 px-10">
        <View className="flex justify-center items-start">
          {/* Edit/Save Toggle */}
          <TouchableOpacity
            className="absolute top-6 right-6 bg-blue-500 px-4 py-1 rounded"
            onPress={() => router.push('/Customer/edit-profile')}
          >
            <Text className="text-white font-semibold">
              {isEditing ? 'Save' : 'Edit'}
            </Text>
          </TouchableOpacity>

          {/* Profile Image and Name */}
          <View className="items-center mb-6 mt-10">
            <Image
              source={{ uri: customerInfo.image }}
              className="w-32 h-32 rounded-full mb-4"
            />
            {isEditing ? (
              <TextInput
                value={customerInfo.name}
                onChangeText={(text) => handleChange('name', text)}
                className="border border-gray-300 rounded px-3 py-1 w-full text-center text-xl font-bold"
              />
            ) : (
              <Text className="text-2xl font-bold">{customerInfo.name}</Text>
            )}
          </View>

          {/* Phone */}
          <View className="mb-4">
            <Text className="text-lg font-semibold mb-1">📞 Phone</Text>
            {isEditing ? (
              <TextInput
                value={customerInfo.phone}
                onChangeText={(text) => handleChange('phone', text)}
                className="border border-gray-300 rounded px-3 py-2 text-gray-700"
              />
            ) : (
              <TouchableOpacity onPress={handleCall}>
                <Text className="text-blue-500 underline">{customerInfo.phone}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Email */}
          <View className="mb-4">
            <Text className="text-lg font-semibold mb-1">📧 Email</Text>
            {isEditing ? (
              <TextInput
                value={customerInfo.email}
                onChangeText={(text) => handleChange('email', text)}
                keyboardType="email-address"
                className="border border-gray-300 rounded px-3 py-2 text-gray-700"
              />
            ) : (
              <Text className="text-gray-700">{customerInfo.email}</Text>
            )}
          </View>

          {/* Gender */}
          <View className="mb-10">
            <Text className="text-lg font-semibold mb-1">⚧ Gender</Text>
            {isEditing ? (
              <TextInput
                value={customerInfo.gender}
                onChangeText={(text) => handleChange('gender', text)}
                className="border border-gray-300 rounded px-3 py-2 text-gray-700"
              />
            ) : (
              <Text className="text-gray-700">{customerInfo.gender}</Text>
            )}
          </View>
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
}
