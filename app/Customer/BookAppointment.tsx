import { useEffect, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import Footer from "../components/customer/Footer";
import { getAllSalons } from "../apis/salonApi";

export default function BookAppointment() {
  const router = useRouter();
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalons = async () => {
      const result = await getAllSalons();
      console.log(result)
      if (result.error) {
        Alert.alert("Error", result.error);
      } else {
        setSalons(result.salons);
      }
      setLoading(false);
    };
    fetchSalons();
  }, []);


  const handleBook = (salonName: string) => {
    router.push({
      pathname: "/Customer/RequestBooking",
      params: { salonName },
    });
  };

  const renderItem = ({ item }: { item: any }) => (
    <View className="flex-row justify-between bg-white p-4 mb-2 rounded shadow">
      <View>
        <Text className="font-semibold text-lg">{item.salon_name}</Text>
        <Text className="text-gray-600">City: {item.city}</Text>
        <Text className="text-gray-600">Address: {item.address}</Text>
        <Text className="text-gray-600">Timing: {item.open_time} - {item.close_time}</Text>
      </View>
      <TouchableOpacity
        onPress={() => handleBook(item.salon_name)}
        className="bg-zinc-900 px-4 py-2 rounded self-center"
      >
        <Text className="text-white font-medium">Booking</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 justify-between bg-gray-300 p-4 mb-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-bold">Available Salons</Text>
        <TouchableOpacity onPress={() => router.push("/Customer/MyAppointments")}>
          <Text className="text-sm font-bold text-white bg-slate-500 p-2 rounded-md">
            My Appointments
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#000" className="mt-4" />
      ) : (
        <FlatList
          data={salons}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Footer />
    </View>
  );
}
