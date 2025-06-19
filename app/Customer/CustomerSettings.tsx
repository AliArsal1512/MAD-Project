import { useRouter } from 'expo-router';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logoutUser } from "../apis/authApi";
import Footer from '../components/customer/Footer';
import { ThemeToggle } from "../components/ThemeToggle";
import { useThemeContext } from "../contexts/ThemeContext";

export default function CustomerSettings() {
  const router = useRouter();
  const { colors } = useThemeContext();

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              const result = await logoutUser();
              if (result.success) {
                router.replace("/role");
              } else {
                Alert.alert("Error", result.error || "Failed to logout");
              }
            } catch (error) {
              Alert.alert("Error", "Something went wrong");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ 
      flex: 1, 
      backgroundColor: colors.background 
    }}>
      <View style={{ 
        flex: 1, 
        backgroundColor: colors.background, 
        padding: 24,
      }}>
        <Text style={{ 
          color: colors.text,
          fontSize: 28, 
          fontWeight: 'bold', 
          marginBottom: 24 
        }}>
          Settings
        </Text>

        {/* Theme Toggle */}
        <View style={{ marginBottom: 24 }}>
          <ThemeToggle showSyncStatus={true} />
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: colors.surface,
            padding: 16,
            borderRadius: 12,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colors.border,
          }}
          onPress={() => router.push('/Customer/edit-profile')}
        >
          <Text style={{ 
            color: colors.text,
            fontSize: 16 
          }}>
            Edit Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={{
            backgroundColor: colors.surface,
            padding: 16,
            borderRadius: 12,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colors.border,
          }}
          onPress={() => router.push('/Customer/BookAppointment')}
        >
          <Text style={{ 
            color: colors.text,
            fontSize: 16 
          }}>
            Manage Appointments
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={{
            backgroundColor: colors.surface,
            padding: 16,
            borderRadius: 12,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colors.border,
          }}
          onPress={() => router.push('/Customer/CustomerProfile')}
        >
          <Text style={{ 
            color: colors.text,
            fontSize: 16 
          }}>
            Manage Services
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={{
            backgroundColor: colors.surface,
            padding: 16,
            borderRadius: 12,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text style={{ 
            color: colors.text,
            fontSize: 16 
          }}>
            Privacy Policy
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: colors.error + '20',
            padding: 16,
            borderRadius: 12,
            marginTop: 24,
            borderWidth: 1,
            borderColor: colors.error + '40',
          }}
          onPress={handleLogout}
        >
          <Text style={{ 
            color: colors.error,
            fontSize: 16, 
            fontWeight: '600',
            textAlign: 'center'
          }}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
      <Footer />
    </SafeAreaView>
  );
}