import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, BackHandler, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getConfirmedSalonAppointments, updateAppointmentStatus } from "../apis/appointmentApi";
import Footer from "../components/salon/Footer";
import { useThemeContext } from "../contexts/ThemeContext";

export default function ConfirmedAppointments() {
  const router = useRouter();
  const { colors } = useThemeContext();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const onBackPress = () => {
      router.push('/Salon/Appointments'); // Replace '/Role' with your target route path
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => backHandler.remove();
  }, [router]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const result = await getConfirmedSalonAppointments();
      if (result.error) {
        Alert.alert("Error", result.error);
      } else {
        setAppointments(result.appointments || []);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId: string, newStatus: 'completed' | 'cancelled') => {
    try {
      const result = await updateAppointmentStatus(appointmentId, newStatus);
      if (result.error) {
        Alert.alert("Error", result.error);
      } else {
        Alert.alert("Success", `Appointment ${newStatus} successfully`);
        fetchAppointments(); // Refresh the list
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update appointment status");
    }
  };

  const renderItem = useCallback(({ item }: { item: any }) => (
    <View
      style={{
        backgroundColor: colors.surface,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: 12
      }}>
        <View style={{ flex: 1 }}>
          <Text style={{ 
            color: colors.text,
            fontSize: 18, 
            fontWeight: '600', 
            marginBottom: 4 
          }}>
            {item.profiles?.full_name || 'Customer Name'}
          </Text>
          <Text style={{ 
            color: colors.textSecondary,
            fontSize: 14,
            marginBottom: 4
          }}>
            Phone: {item.profiles?.phone || 'N/A'}
          </Text>
          <Text style={{ 
            color: colors.textSecondary,
            fontSize: 14,
            marginBottom: 4
          }}>
            Date: {item.appointment_date}
          </Text>
          <Text style={{ 
            color: colors.textSecondary,
            fontSize: 14,
            marginBottom: 8
          }}>
            Time: {item.start_time} - {item.end_time}
          </Text>
          
          {item.appointment_services && item.appointment_services.length > 0 && (
            <View style={{ marginBottom: 8 }}>
              <Text style={{ 
                color: colors.text,
                fontSize: 14, 
                fontWeight: '600',
                marginBottom: 4
              }}>
                Services:
              </Text>
              {item.appointment_services.map((serviceItem: any, index: number) => (
                <Text key={index} style={{ 
                  color: colors.textSecondary,
                  fontSize: 12,
                  marginLeft: 8
                }}>
                  • {serviceItem.service?.name} - ${serviceItem.service?.price}
                </Text>
              ))}
            </View>
          )}
        </View>
        
        <View style={{ 
          backgroundColor: item.status === 'confirmed' ? colors.primary + '20' : colors.success + '20',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: item.status === 'confirmed' ? colors.primary + '40' : colors.success + '40',
        }}>
          <Text style={{ 
            color: item.status === 'confirmed' ? colors.primary : colors.success,
            fontSize: 12, 
            fontWeight: '600',
            textTransform: 'capitalize'
          }}>
            {item.status}
          </Text>
        </View>
      </View>

      {item.status === 'confirmed' && (
        <View style={{ 
          flexDirection: 'row', 
          gap: 8 
        }}>
          <TouchableOpacity
            onPress={() => handleStatusUpdate(item.id, 'completed')}
            style={{
              backgroundColor: colors.success,
              padding: 12,
              borderRadius: 8,
              flex: 1,
              alignItems: 'center',
            }}
          >
            <Text style={{ 
              color: colors.surface,
              fontSize: 14, 
              fontWeight: '600' 
            }}>
              Mark Complete
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => handleStatusUpdate(item.id, 'cancelled')}
            style={{
              backgroundColor: colors.error,
              padding: 12,
              borderRadius: 8,
              flex: 1,
              alignItems: 'center',
            }}
          >
            <Text style={{ 
              color: colors.surface,
              fontSize: 14, 
              fontWeight: '600' 
            }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  ), [colors]);

  return (
    <SafeAreaView style={{ 
      flex: 1, 
      backgroundColor: colors.background 
    }}>
      <View style={{ 
        flex: 1, 
        backgroundColor: colors.background,
        padding: 24,
        paddingTop: 60, // Safe area for status bar
        paddingBottom: 100, // Safe area for footer
      }}>
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 24 
        }}>
          <Text style={{ 
            color: colors.text,
            fontSize: 16, 
            fontWeight: 'bold' 
          }}>
            Confirmed Appointments
          </Text>
          <TouchableOpacity 
            onPress={() => router.push("/Salon/Appointments")}
            style={{
              backgroundColor: colors.surface,
              padding: 12,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text style={{ 
              color: colors.text,
              fontSize: 14, 
              fontWeight: '600' 
            }}>
              All Appointments
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={{ 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: 40 
          }}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ 
              color: colors.text,
              fontSize: 16,
              marginTop: 16
            }}>
              Loading appointments...
            </Text>
          </View>
        ) : appointments.length === 0 ? (
          <View style={{ 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: 40 
          }}>
            <Text style={{ 
              color: colors.textSecondary,
              fontSize: 16 
            }}>
              No confirmed appointments
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
