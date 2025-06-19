import { FontAwesome } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchCustomerAppointments } from '../apis/customerApi';
import Footer from '../components/customer/Footer';
import { useThemeContext } from '../contexts/ThemeContext';

export default function MyAppointments() {
  const { colors } = useThemeContext();
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
      <View style={{
        backgroundColor: colors.card,
        padding: 16,
        marginBottom: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}>
        <Text style={{
          color: colors.text,
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 4
        }}>
          {item.barberName}
        </Text>
        <Text style={{
          color: colors.textSecondary,
          marginBottom: 4
        }}>
          ⏰ {item.time}
        </Text>
        <Text style={{
          color: colors.textSecondary,
          marginBottom: 4
        }}>
          📍 {item.address}, {item.city}
        </Text>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 12
        }}>
          <Text style={{
            color: colors.textSecondary,
            marginRight: 8
          }}>
            ⭐ {item.rating}
          </Text>
          <FontAwesome name="star" size={16} color="#FFD700" />
        </View>
  
        <TouchableOpacity
          onPress={() => canCancel && handleCancel(item.id)}
          disabled={!canCancel}
          style={{
            backgroundColor: canCancel ? colors.error : colors.textSecondary,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
            opacity: canCancel ? 1 : 0.6,
          }}
        >
          <Text style={{
            color: 'white',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            {buttonLabel}
          </Text>
        </TouchableOpacity>
      </View>
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
        padding: 16
      }}>
        <Text style={{
          color: colors.text,
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 16,
          textAlign: 'center'
        }}>
          My Appointments
        </Text>

        {loading ? (
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : appointments.length === 0 ? (
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Text style={{
              color: colors.textSecondary,
              textAlign: 'center'
            }}>
              No appointments found.
            </Text>
          </View>
        ) : (
          <FlatList
            data={appointments}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
      <Footer />
    </SafeAreaView>
  );
}
