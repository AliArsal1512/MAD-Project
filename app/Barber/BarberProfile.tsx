import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';

const initialBarberInfo = {
  image:
    'https://images.unsplash.com/photo-1606046604972-77cc76aee944?auto=format&fit=crop&w=400&q=80',
  shopName: 'Fade & Blade Barbershop',
  barberName: 'Ali Barber',
  phone: '+92 300 1234567',
  location: 'Main Market, Lahore',
  address: 'Shop #5, Plaza A, Main Blvd, Lahore',
};

export default function BarberProfile() {
  const [barberInfo, setBarberInfo] = useState(initialBarberInfo);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (field: keyof typeof barberInfo, value: string) => {
    setBarberInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleCall = () => {
    if (!isEditing) Linking.openURL(`tel:${barberInfo.phone}`);
  };

  return (
    <ScrollView className="flex-row bg-gray-300 px-10">
        <View className='flex justify-center items-start'>
      {/* Edit/Save Toggle */}
      <TouchableOpacity
        className="absolute top-6 right-6 bg-blue-500 px-4 py-1 rounded"
        onPress={() => setIsEditing((prev) => !prev)}
      >
        <Text className="text-white font-semibold">
          {isEditing ? 'Save' : 'Edit'}
        </Text>
      </TouchableOpacity>

      {/* Profile Image and Title */}
      <View className="items-center mb-6 mt-10">
        <Image
          source={{ uri: barberInfo.image }}
          className="w-32 h-32 rounded-full mb-4"
        />
        {isEditing ? (
          <>
            <TextInput
              value={barberInfo.shopName}
              onChangeText={(text) => handleChange('shopName', text)}
              className="border border-gray-300 rounded px-3 py-1 w-full text-center text-xl font-bold"
            />
            <TextInput
              value={barberInfo.barberName}
              onChangeText={(text) => handleChange('barberName', text)}
              className="border border-gray-300 rounded px-3 py-1 w-full text-center mt-1 text-gray-600"
            />
          </>
        ) : (
          <>
            <Text className="text-2xl font-bold">{barberInfo.shopName}</Text>
            <Text className="text-gray-600 mt-1">by {barberInfo.barberName}</Text>
          </>
        )}
      </View>

      {/* Location */}
      <View className="mb-4">
        <Text className="text-lg font-semibold mb-1">📍 Location</Text>
        {isEditing ? (
          <TextInput
            value={barberInfo.location}
            onChangeText={(text) => handleChange('location', text)}
            className="border border-gray-300 rounded px-3 py-2 text-gray-700"
          />
        ) : (
          <Text className="text-gray-700">{barberInfo.location}</Text>
        )}
      </View>

      {/* Phone */}
      <View className="mb-4">
        <Text className="text-lg font-semibold mb-1">📞 Phone</Text>
        {isEditing ? (
          <TextInput
            value={barberInfo.phone}
            onChangeText={(text) => handleChange('phone', text)}
            className="border border-gray-300 rounded px-3 py-2 text-gray-700"
          />
        ) : (
          <TouchableOpacity onPress={handleCall}>
            <Text className="text-blue-500 underline">{barberInfo.phone}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Address */}
      <View className="mb-4">
        <Text className="text-lg font-semibold mb-1">🏠 Address</Text>
        {isEditing ? (
          <TextInput
            value={barberInfo.address}
            onChangeText={(text) => handleChange('address', text)}
            className="border border-gray-300 rounded px-3 py-2 text-gray-700"
          />
        ) : (
          <Text className="text-gray-700">{barberInfo.address}</Text>
        )}
      </View>
      </View>
    </ScrollView>
  );
}
