import Footer from '../components/customer/Footer';
import { useRouter } from 'expo-router';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

export default function CustomerSettings() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          // handle logout logic (e.g. clear token)
          router.replace('/auth/login_customer'); // redirect to login screen
        },
      },
    ]);
  };

  return (
    <View className="flex-1 justify-between bg-white p-4 mb-4">
        <View className="flex-1 bg-white p-6">
            <Text className="text-2xl font-bold mb-6">Customer Settings</Text>

            <TouchableOpacity
                className="bg-gray-100 p-4 rounded-lg mb-4"
                onPress={() => router.push('/Customer/CustomerProfile')}
            >
                <Text className="text-lg">Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-gray-100 p-4 rounded-lg mb-4">
                <Text className="text-lg">Notifications</Text>
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
