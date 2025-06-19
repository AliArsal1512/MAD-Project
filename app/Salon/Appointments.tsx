import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, BackHandler, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getActiveSalonAppointments,
  updateAppointmentStatus,
} from "../apis/appointmentApi";
import Footer from "../components/salon/Footer";
import { useThemeContext } from "../contexts/ThemeContext";

export default function Appointments() {
  const router = useRouter();
  const { colors } = useThemeContext();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

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
    const interval = setInterval(() => {
      const nowUTC = new Date(new Date().toISOString());
      setNow(nowUTC);
    }, 1000);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const fetchAppointments = async () => {
      const { appointments, error } = await getActiveSalonAppointments();
      if (error) {
        console.error("Error fetching appointments:", error);
      } else {
        console.log(appointments);
        setAppointments(appointments || []);
      }
      setLoading(false); // ← THIS WAS MISSING
    };

    fetchAppointments();
  }, []);

  const handleAppointment = async (id: string, action: "accept" | "reject") => {
    const newStatus = action === "accept" ? "confirmed" : "cancelled";

    // Optimistic UI update
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );

    // Send update to DB
    const { error } = await updateAppointmentStatus(id, newStatus);

    if (error) {
      console.error("Failed to update appointment:", error);

      // Optional: revert status if error
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "pending" } : a))
      );
    }
  };


  // const getTimeRemaining = (expiresAt: string, now: Date) => {
  //   if (!expiresAt) return "Invalid date";
  
  //   const expiry = new Date(expiresAt);
  //   const nowUTC = new Date(now.toISOString());
  
  //   if (isNaN(expiry.getTime())) {
  //     return "Invalid date";
  //   }
  
  //   const diff = Math.max(0, expiry.getTime() - nowUTC.getTime());
  //   const minutes = Math.floor(diff / 1000 / 60);
  //   const seconds = Math.floor((diff / 1000) % 60);
  
  //   if (minutes === 0 && seconds === 0) {
  //     return "Expired";
  //   }
  
  //   return `${minutes} min ${seconds} sec`;
  // };

  const showexpiretime=(expiresAt: string)=>{
    if (!expiresAt) return "Invalid time";

    try {
      // Parse the time (handles both "2025-06-17 09:58:09" and ISO format)
      const date = new Date(expiresAt.includes(" ") ? expiresAt.replace(" ", "T") : expiresAt);
      const adjustedTime = new Date(date.getTime() + 5 * 60 * 60 * 1000); // Add 5 hours
      // console.log("Adjusted Time:", adjustedTime);
      // console.log("date:", date)
      // Extract hours, minutes, seconds
      const hours = adjustedTime.getHours().toString().padStart(2, '0');
      const minutes = adjustedTime.getMinutes().toString().padStart(2, '0');
      const seconds = adjustedTime.getSeconds().toString().padStart(2, '0');
  
      return `${hours}:${minutes}:${seconds}`;
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Invalid time";
    }
  }

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: colors.background
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.card,
      }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{
          color: colors.text,
          fontSize: 20,
          fontWeight: 'bold',
          marginRight: 16
        }}>
          Appointments
        </Text>

        <TouchableOpacity 
          onPress={() => router.replace("/Salon/confirmedAppoinments")} 
          style={{ marginLeft: 'auto' }}
        >
          <Text style={{
            color: colors.text,
            fontSize: 14,
            fontWeight: 'bold',
            backgroundColor: colors.surface,
            borderRadius: 8,
            padding: 8,
            borderWidth: 1,
            borderColor: colors.border,
          }}>
            confirmed Appoinments
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
        {loading ? (
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 40
          }}>
            <Text style={{ color: colors.text }}>Loading...</Text>
          </View>
        ) : appointments.length === 0 ? (
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 40
          }}>
            <Text style={{ color: colors.textSecondary }}>No upcoming requests.</Text>
          </View>
        ) : (
          appointments.map((appointment) => {
            const customer = appointment.customer;
            const services =
              appointment.services
                ?.map((s: any) => s.service.name)
                .join(", ") || "";
            const price = appointment.services?.reduce(
              (sum: any, s: any) => sum + s.service.price,
              0
            );
            const duration = appointment.services?.reduce(
              (sum: any, s: any) => sum + s.service.duration_minutes,
              0
            );

            return (
              <View
                key={appointment.id}
                style={{
                  margin: 16,
                  padding: 16,
                  backgroundColor: colors.card,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 16
                }}>
                  <Image
                    source={{
                      uri:
                        appointment.profiles?.avatar_url ||
                        "https://placehold.co/100x100",
                    }}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24
                    }}
                  />
                  <View style={{ marginLeft: 12 }}>
                    <Text style={{
                      color: colors.text,
                      fontSize: 18,
                      fontWeight: '600'
                    }}>
                      {appointment.profiles?.full_name || "Customer"}
                    </Text>
                    <Text style={{
                      color: colors.textSecondary
                    }}>
                      {appointment.appointment_services
                        ?.map((s: any) => s.service.name)
                        .join(", ")}
                    </Text>
                  </View>
                </View>

                <View style={{ marginBottom: 16 }}>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 8
                  }}>
                    <Ionicons name="calendar" size={20} color={colors.textSecondary} />
                    <Text style={{
                      color: colors.textSecondary,
                      marginLeft: 8
                    }}>
                      {appointment.appointment_date}
                    </Text>
                  </View>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 8
                  }}>
                    <Ionicons name="time" size={20} color={colors.textSecondary} />
                    <Text style={{
                      color: colors.textSecondary,
                      marginLeft: 8
                    }}>
                      {appointment.start_time} - {appointment.end_time}
                    </Text>
                  </View>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 8
                  }}>
                    <Ionicons name="cash" size={20} color={colors.textSecondary} />
                    <Text style={{
                      color: colors.textSecondary,
                      marginLeft: 8
                    }}>
                      ${price}
                    </Text>
                  </View>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 8
                  }}>
                    <Ionicons name="timer" size={20} color={colors.textSecondary} />
                    <Text style={{
                      color: colors.textSecondary,
                      marginLeft: 8
                    }}>
                      {duration} minutes
                    </Text>
                  </View>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}>
                    <Ionicons name="warning" size={20} color={colors.warning} />
                    <Text style={{
                      color: colors.warning,
                      marginLeft: 8,
                      fontWeight: '600'
                    }}>
                      Expires: {showexpiretime(appointment.expires_at)}
                    </Text>
                  </View>
                </View>

                <View style={{
                  flexDirection: 'row',
                  gap: 12
                }}>
                  <TouchableOpacity
                    onPress={() => handleAppointment(appointment.id, "accept")}
                    style={{
                      flex: 1,
                      backgroundColor: colors.success,
                      padding: 12,
                      borderRadius: 8,
                      alignItems: 'center'
                    }}
                  >
                    <Text style={{
                      color: 'white',
                      fontWeight: '600'
                    }}>
                      Accept
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleAppointment(appointment.id, "reject")}
                    style={{
                      flex: 1,
                      backgroundColor: colors.error,
                      padding: 12,
                      borderRadius: 8,
                      alignItems: 'center'
                    }}
                  >
                    <Text style={{
                      color: 'white',
                      fontWeight: '600'
                    }}>
                      Reject
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
}
