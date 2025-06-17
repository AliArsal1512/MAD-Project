import Footer from '../components/customer/Footer';
import { FontAwesome } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { fetchCustomerAppointments } from '../apis/customerApi';

export default function MyAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    setLoading(true);
    const { data, error } = await fetchCustomerAppointments();
    if (error) {
      Alert.alert("Error", error);
    } else {
      setAppointments(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleCancel = (id: string) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            setAppointments((prev) => prev.filter((a) => a.id !== id));
            // Optional: Call API to delete/cancel from backend
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: typeof appointments[0] }) => {
    const now = new Date();
    const expiresAt = new Date(item.expiresAt);
    const isExpired = expiresAt < now;
    const isConfirmedOrCompleted = item.status === "confirmed" || item.status === "completed";
    const canCancel = !isExpired && !isConfirmedOrCompleted;
  
    let buttonLabel = "Cancel";
    if (item.status === "confirmed") buttonLabel = "Confirmed";
    else if (item.status === "completed") buttonLabel = "Completed";
    else if (isExpired) buttonLabel = "Expired";
  
    return (
      <View className="bg-white p-4 mb-4 rounded shadow">
        <Text className="text-lg font-bold mb-1">{item.barberName}</Text>
        <Text className="text-gray-700 mb-1">⏰ {item.time}</Text>
        <Text className="text-gray-700 mb-1">📍 {item.address}, {item.city}</Text>
        <View className="flex-row items-center mb-3">
          <Text className="text-gray-700 mr-2">⭐ {item.rating}</Text>
          <FontAwesome name="star" size={16} color="#FFD700" />
        </View>
  
        <TouchableOpacity
          onPress={() => canCancel && handleCancel(item.id)}
          disabled={!canCancel}
          className={`${canCancel ? "bg-red-500" : "bg-gray-400"} px-4 py-2 rounded`}
        >
          <Text className="text-white text-center font-semibold">
            {buttonLabel}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  

  return (
    <View className="flex-1 justify-between bg-white p-4 mb-4">
      <View className="flex-1 bg-gray-100 p-4">
        <Text className="text-2xl font-bold mb-4 text-center">My Appointments</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#000" className="mt-20" />
        ) : appointments.length === 0 ? (
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
