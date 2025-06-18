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

export default function Appointments() {
  const router = useRouter();
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
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold mr-4">Appointments</Text>

        <TouchableOpacity onPress={() => router.replace("/Salon/confirmedAppoinments")} className="mr-2">
        <Text className="text-sm font-bold bg-slate-400 rounded-md p-2">confirmed Appoinments</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {loading ? (
          <Text className="text-center mt-10">Loading...</Text>
        ) : appointments.length === 0 ? (
          <Text className="text-center mt-10">No upcoming requests.</Text>
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
                className="m-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100"
              >
                <View className="flex-row items-center mb-4">
                  <Image
                    source={{
                      uri:
                        appointment.profiles?.avatar_url ||
                        "https://placehold.co/100x100",
                    }}
                    className="w-12 h-12 rounded-full"
                  />
                  <View className="ml-3">
                    <Text className="text-lg font-semibold">
                      {appointment.profiles?.full_name || "Customer"}
                    </Text>
                    <Text className="text-gray-500">
                      {appointment.appointment_services
                        ?.map((s: any) => s.service.name)
                        .join(", ")}
                    </Text>
                  </View>
                </View>

                <View className="mb-4">
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="calendar" size={20} color="#666" />
                    <Text className="text-gray-600 ml-2">Date:</Text>
                    <Text className="text-gray-600 ml-2">
                      {appointment.appointment_date}
                    </Text>
                  </View>
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="time" size={20} color="#666" />
                    <Text className="text-gray-600 ml-2">Time:</Text>
                    <Text className="text-gray-600 ml-2">
                      {appointment.start_time}
                    </Text>
                    <Text className="text-gray-500 ml-2">
                      (
                      {appointment.appointment_services?.reduce(
                        (sum: number, s: any) =>
                          sum + s.service.duration_minutes,
                        0
                      )}{" "}
                      min)
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="cash" size={20} color="#666" />
                    <Text className="text-gray-600 ml-2">Total Bill:</Text>
                    <Text className="text-gray-600 ml-2">
                      Rs.{" "}
                      {appointment.appointment_services?.reduce(
                        (sum: number, s: any) => sum + s.service.price,
                        0
                      )}
                    </Text>
                  </View>
<View className="flex-row items-center" >
  
  <Ionicons name="cash" size={20} color="#666" />
  <Text className="text-gray-600 ml-2">Expire in:</Text>
  <Text className="text-gray-600 ml-2">
  {showexpiretime(appointment.expires_at)}
</Text>
</View>
                </View>

                {appointment.status === "pending" ? (
                  <View className="flex-row justify-end space-x-3">
                    <TouchableOpacity
                      onPress={() =>
                        handleAppointment(appointment.id, "reject")
                      }
                      className="px-4 py-2 border border-red-500 rounded-lg"
                    >
                      <Text className="text-red-500 font-semibold">Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        handleAppointment(appointment.id, "accept")
                      }
                      className="px-4 py-2 bg-blue-500 rounded-lg"
                    >
                      <Text className="text-white font-semibold">Accept</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View
                    className={`mt-2 p-2 rounded-lg ${
                      appointment.status === "confirmed"
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    <Text
                      className={`text-center font-semibold ${
                        appointment.status === "confirmed"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {appointment.status === "confirmed"
                        ? "Accepted"
                        : "Rejected"}
                    </Text>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      <Footer />
    </SafeAreaView>
  );
}
