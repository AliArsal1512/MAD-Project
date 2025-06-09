import { Text, View, TextInput, TouchableOpacity, FlatList } from "react-native";
import Footer from "@/components/customer_components/Footer";
import { SafeAreaView } from "react-native-safe-area-context";

const promotedShops = [
  { id: 'p1', name: "Premium Barber A", deal: "20% off" },
  { id: 'p2', name: "Exclusive Cuts", deal: "Buy 1 Get 1" },
  { id: 'p3', name: "Luxury Grooming", deal: "Free shave" },
];

const barberShops = [
  { id: '1', name: "Barber Shop A", location: "Downtown" },
  { id: '2', name: "Cuts & Styles", location: "Uptown" },
  { id: '3', name: "Gentlemen's Grooming", location: "Midtown" },
  { id: '4', name: "The Barber's Den", location: "Eastside" },
  { id: '5', name: "Classic Cuts", location: "West End" },
  // Add more shops here or fetch from API later
];

export default function Index() {

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="w-full">
        {/* Header directly in Home screen */}
        <View className="px-4 py-4">
          <Text className="text-2xl font-bold text-black mb-3">DigiBarber</Text>
          <TextInput
            placeholder="Search for barbers or services..."
            className="bg-gray-100 px-4 py-2 rounded-xl text-base"
            placeholderTextColor="#888"
          />
        </View>
      </View>

      {/* Horizontal promoted shops list */}
      <View className="px-4 bg-gray-100 py-6 my-8 rounded-xl">
        <Text className="text-3xl font-semibold mb-4">Exclusive Deals</Text>
        <FlatList
          data={promotedShops}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View className="w-4" />}
          renderItem={({ item }) => (
            <View className="bg-yellow-100 p-4 rounded-xl shadow-md" style={{ width: 200 }}>
              <Text className="font-semibold text-black">{item.name}</Text>
              <Text className="text-yellow-700 mt-1">{item.deal}</Text>
            </View>
          )}
        />
      </View>

      {/* Barber shops list */}
      <FlatList
        data={barberShops}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
        renderItem={({ item }) => (
          <View className="bg-gray-100 rounded-xl p-4 mb-6">
            <Text className="text-lg font-semibold text-black">{item.name}</Text>
            <Text className="text-gray-600">{item.location}</Text>
          </View>
        )}
      />

      {/* Footer navigation bar */}
      <Footer />
    </SafeAreaView>
  );
}
