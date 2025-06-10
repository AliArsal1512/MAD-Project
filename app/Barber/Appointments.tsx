import { useRouter } from "expo-router";
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Footer from "@/components/barber/Footer";


interface Appointment {
  id: string;
  customerName: string;
  time: string;
  service: string;
  status: 'pending' | 'completed' | 'cancelled';
}

const dummyAppointments: Appointment[] = [
  {
    id: '1',
    customerName: 'Umar Khan',
    time: '10:00 AM - 10:30 AM',
    service: 'Haircut',
    status: 'pending',
  },
  {
    id: '2',
    customerName: 'Ali Raza',
    time: '11:00 AM - 11:45 AM',
    service: 'Beard Trim',
    status: 'pending',
  },
  {
    id: '3',
    customerName: 'Ahsan Tariq',
    time: '12:30 PM - 1:00 PM',
    service: 'Haircut + Beard',
    status: 'completed',
  },
];

export default function Appointments() {
    const router = useRouter();
  const [appointments, setAppointments] = useState(dummyAppointments);

  const handleStatusChange = (id: string, newStatus: Appointment['status']) => {
    setAppointments((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  const renderItem = ({ item }: { item: Appointment }) => (
    <View className="bg-white p-4 rounded-xl shadow mb-4">
      <Text className="text-lg font-bold">{item.customerName}</Text>
      <Text className="text-gray-700">⏰ {item.time}</Text>
      <Text className="text-gray-700">💈 Service: {item.service}</Text>
      <Text className="text-sm mt-1 text-gray-500">Status: {item.status}</Text>

      {item.status === 'pending' && (
        <View className="flex-row mt-3 space-x-4">
          <TouchableOpacity
            className="bg-green-500 px-4 py-2 rounded"
            onPress={() => handleStatusChange(item.id, 'completed')}
          >
            <Text className="text-white font-semibold">Mark as Done</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-red-500 px-4 py-2 rounded"
            onPress={() => {
              Alert.alert(
                'Cancel Appointment',
                'Are you sure you want to cancel this appointment?',
                [
                  { text: 'No' },
                  {
                    text: 'Yes',
                    onPress: () => handleStatusChange(item.id, 'cancelled'),
                  },
                ]
              );
            }}
          >
            <Text className="text-white font-semibold">Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {item.status !== 'pending' && (
        <Text className="mt-2 text-xs text-gray-400 italic">
          Appointment {item.status}
        </Text>
      )}
    </View>
  );

  return (
    <View className="flex-1 justify-between bg-white p-4 mb-4">
      <View className='flex-row justify-between mb-2'>
      <Text className="text-2xl font-bold mb-4">My Appointments</Text>
      <TouchableOpacity onPress={() => router.push("/Barber/BarberProfile")}
      className='bg-zinc-400 rounded-md px-2 py-3'><Text className=''>Porfile</Text></TouchableOpacity>
        </View>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No appointments yet.</Text>}
      />
      <Footer />
    </View>
  );
}
