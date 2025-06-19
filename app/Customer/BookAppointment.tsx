import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, BackHandler, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllSalons } from "../apis/salonApi";
import Footer from "../components/customer/Footer";
import { useThemeContext } from "../contexts/ThemeContext";

export default function BookAppointment() {
  const router = useRouter();
  const { colors } = useThemeContext();
  const [salons, setSalons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(
      useCallback(() => {
        const onBackPress = () => {
          Alert.alert(
            "Exit App",
            "Are you sure you want to exit?",
            [
              {
                text: "Cancel",
                onPress: () => null,
                style: "cancel",
              },
              {
                text: "Yes",
                onPress: () => BackHandler.exitApp(),
              },
            ],
            { cancelable: false }
          );
          return true; // prevent default behavior
        };
  
        const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          onBackPress
        );
  
        return () => backHandler.remove();
      }, [])
    );

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        const result = await getAllSalons();
        if (result.error) {
          Alert.alert("Error", result.error);
        } else {
          setSalons(result.salons || []);
        }
      } catch (error) {
        console.error("Error fetching salons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalons();
  }, []);

  const handleBook = (salonName: string) => {
    router.replace({
      pathname: "/Customer/RequestBooking",
      params: { salonName },
    });
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
      <Text style={{ 
        color: colors.text,
        fontSize: 18, 
        fontWeight: '600', 
        marginBottom: 8 
      }}>
        {item.salon_name}
      </Text>
      <Text style={{ 
        color: colors.textSecondary,
        fontSize: 14,
        marginBottom: 8
      }}>
        {item.address}
      </Text>
      <Text style={{ 
        color: colors.textSecondary,
        fontSize: 14,
        marginBottom: 12
      }}>
        {item.city}
      </Text>
      <TouchableOpacity
        onPress={() => handleBook(item.salon_name)}
        style={{
          backgroundColor: colors.primary,
          padding: 12,
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ 
          color: colors.surface,
          fontSize: 14, 
          fontWeight: '600' 
        }}>
          Book Appointment
        </Text>
      </TouchableOpacity>
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
      }}>
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 24 
        }}>
          <Text style={{ 
            color: colors.text,
            fontSize: 22, 
            fontWeight: 'bold' 
          }}>
            Available Salons
          </Text>
          <TouchableOpacity 
            onPress={() => router.push("/Customer/MyAppointments")}
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
              My Appointments
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
              Loading salons...
            </Text>
          </View>
        ) : salons.length === 0 ? (
          <View style={{ 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: 40 
          }}>
            <Text style={{ 
              color: colors.textSecondary,
              fontSize: 16 
            }}>
              No salons available
            </Text>
          </View>
        ) : (
          <FlatList
            data={salons}
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
