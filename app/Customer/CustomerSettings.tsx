import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Alert, BackHandler, Text, TouchableOpacity, View } from 'react-native';
import Footer from '../components/customer/Footer';

export default function BarberSettings() {
  const router = useRouter();

  // Handle hardware back to exit app
  useEffect(() => {
    const onBackPress = () => {
      Alert.alert(
        "Exit App",
        "Are you sure you want to exit?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Yes", onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: false }
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => backHandler.remove();
  }, []);

  // Logout handler
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          // handle logout logic
          router.replace('/auth/login_customer');
        },
      },
    ]);
  };

  return (
    <View className="flex-1 justify-between bg-white p-4 mb-4">
      <View className="flex-1 bg-white p-6">
        <Text className="text-2xl font-bold mb-6">Settings</Text>

        <TouchableOpacity
          className="bg-gray-100 p-4 rounded-lg mb-4"
          onPress={() => router.push('/Customer/edit-profile')}
        >
          <Text className="text-lg">Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-gray-100 p-4 rounded-lg mb-4"
          onPress={() => router.push('/Customer/BookAppointment')}>
          <Text className="text-lg">Manage Appointments</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-gray-100 p-4 rounded-lg mb-4"
          onPress={() => router.push('/Customer/CustomerProfile')}>
          <Text className="text-lg">Manage Services</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-gray-100 p-4 rounded-lg mb-4">
          <Text className="text-lg">Privacy Policy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-red-100 p-4 rounded-lg mt-6"
          onPress={handleLogout}
        >
          <Text className="text-lg text-red-600 font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>
      <Footer />
    </View>
  );
}