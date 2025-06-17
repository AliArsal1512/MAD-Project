import Footer from '../components/customer/Footer';
import { useState } from 'react';
import {
    Image,
    Linking,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const initialCustomerInfo = {
  image:
    'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?auto=format&fit=crop&w=400&q=80',
  name: 'Ahmed Khan',
  phone: '+92 345 9876543',
  email: 'ahmed.khan@example.com',
  address: 'House #10, Street 7, DHA Phase 5, Lahore',
};

export default function CustomerProfile() {
  const [customerInfo, setCustomerInfo] = useState(initialCustomerInfo);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (field: keyof typeof customerInfo, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleCall = () => {
    if (!isEditing) Linking.openURL(`tel:${customerInfo.phone}`);
  };

  return (
    <View className="flex-1 justify-between bg-white p-4 mb-4">
        <ScrollView className="flex-row bg-gray-300 px-10">
        <View className="flex justify-center items-start">

            {/* Edit/Save Toggle */}
            <TouchableOpacity
            className="absolute top-6 right-6 bg-blue-500 px-4 py-1 rounded"
            onPress={() => setIsEditing((prev) => !prev)}
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

            {/* Address */}
            <View className="mb-10">
            <Text className="text-lg font-semibold mb-1">🏠 Address</Text>
            {isEditing ? (
                <TextInput
                value={customerInfo.address}
                onChangeText={(text) => handleChange('address', text)}
                className="border border-gray-300 rounded px-3 py-2 text-gray-700"
                />
            ) : (
                <Text className="text-gray-700">{customerInfo.address}</Text>
            )}
            </View>
        </View>
        </ScrollView>
        <Footer />
    </View>
  );
}
