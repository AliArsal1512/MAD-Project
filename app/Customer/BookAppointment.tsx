import React from 'react';
import { useRouter } from "expo-router";
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';


const dummyBarbers = [
  {
    id: '1',
    name: 'Ali Barber',
    availableSlots: ['10:00 AM', '12:30 PM', '03:00 PM'],
  },
  {
    id: '2',
    name: 'Usman Fade Master',
    availableSlots: ['09:00 AM', '11:00 AM'],
  },
  {
    id: '3',
    name: 'Tariq Clippers',
    availableSlots: ['01:00 PM', '04:00 PM', '06:30 PM'],
  },
];

// Flatten barbers into a list of {barberName, timeSlot}
const slotList = dummyBarbers.flatMap((barber) =>
  barber.availableSlots.map((slot) => ({
    id: `${barber.id}-${slot}`,
    barberName: barber.name,
    timeSlot: slot,
  }))
);

export default function BookAppointment() {
    const router = useRouter();

  const handleBook = (barberName: string, timeSlot: string) => {
    Alert.alert('Appointment Booked', `With ${barberName} at ${timeSlot}`);
    // Later: Send this to your backend
  };

  const renderItem = ({ item }: { item: typeof slotList[0] }) => (
    <View className="flex-row justify-between bg-white p-4 mb-2 rounded shadow ">
      <View>
        <Text className="font-semibold">{item.barberName}</Text>
        <Text className="text-gray-600">{item.timeSlot}</Text>
      </View>
      <TouchableOpacity
        onPress={() => handleBook(item.barberName, item.timeSlot)}
        className="bg-zinc-900 px-4 py-2 rounded"
      >
        <Text className="text-white font-medium">Book</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 justify-between bg-gray-300 p-4 mb-4 ">
        <View className='flex-row  justify-between'>
        <Text className="text-2xl font-bold text-center mb-4">Available Slots</Text>
        <TouchableOpacity onPress={() => router.push("/Customer/MyAppointments")}><Text className='text-sm font-bold text-center rounded-md p-2 bg-slate-500'>my Appoinments</Text></TouchableOpacity>
        </View>
      <FlatList
        data={slotList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
