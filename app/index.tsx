import { Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BarberIcon from "../assets/icons/BarberIcon";
import CustomerIcon from "../assets/icons/CustomerIcon";


export default function Index() {

  return (
    <SafeAreaView className="flex-1 bg-white justify-center">
      {/* Header Section */}
      <View className="items-center mb-16">
        <Text className="text-4xl font-bold text-black">DigiBarber</Text>
        <Text className="text-xl text-gray-600 mt-2">Select Your Role</Text>
      </View>

      {/* Role Selection Cards */}
      <View className="flex-row justify-center w-full mb-12">
        {/* Barber Card */}
        <TouchableOpacity 
          className="items-center mx-2 px-2 py-4 rounded-2xl w-[44%] h-48  bg-gray-100"
          activeOpacity={0.7}
        >
          <BarberIcon size={60} color="black" />
          <Text className="mt-6 text-xl font-semibold">Barber</Text>
        </TouchableOpacity>

        {/* Customer Card */}
        <TouchableOpacity 
          className="items-center mx-2 px-2 py-4 rounded-2xl bg-gray-100 w-[44%] h-48"
          activeOpacity={0.7}
        >
          <CustomerIcon size={60} color="black" />
          <Text className="mt-6 text-xl font-semibold">Customer</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
