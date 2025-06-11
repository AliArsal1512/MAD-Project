import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Footer from '@/components/customer/Footer';

const initialAppointments = [
  {
    id: '1',
    barberName: 'Ali Barber',
    time: '10:00 AM, June 12, 2025',
    location: 'Main Market, Lahore',
    rating: 4.5,
  },
  {
    id: '2',
    barberName: 'Usman Fade Master',
    time: '02:30 PM, June 15, 2025',
    location: 'Gulberg, Lahore',
    rating: 4.8,
  },
  {
    id: '3',
    barberName: 'Tariq Clippers',
    time: '12:00 PM, June 18, 2025',
    location: 'DHA Phase 3, Lahore',
    rating: 4.2,
  },
];

export default function MyAppointments() {
  const [appointments, setAppointments] = useState(initialAppointments);

  const handleCancel = (id: string) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            setAppointments((prev) => prev.filter((a) => a.id !== id));
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: typeof appointments[0] }) => (
    <View className="bg-white p-4 mb-4 rounded shadow">
      <Text className="text-lg font-bold mb-1">{item.barberName}</Text>
      <Text className="text-gray-700 mb-1">⏰ {item.time}</Text>
      <Text className="text-gray-700 mb-1">📍 {item.location}</Text>
      <View className="flex-row items-center mb-3">
        <Text className="text-gray-700 mr-2">⭐ {item.rating}</Text>
        <FontAwesome name="star" size={16} color="#FFD700" />
      </View>
      <TouchableOpacity
        onPress={() => handleCancel(item.id)}
        className="bg-red-500 px-4 py-2 rounded"
      >
        <Text className="text-white text-center font-semibold">Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 justify-between bg-white p-4 mb-4">
      <View className="flex-1 bg-gray-100 p-4">
        <Text className="text-2xl font-bold mb-4 text-center">My Appointments</Text>
        {appointments.length === 0 ? (
          <Text className="text-center text-gray-600 mt-20">No appointments found.</Text>
        ) : (
          <FlatList
            data={appointments}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      <Footer />
    </View>
  );
}
