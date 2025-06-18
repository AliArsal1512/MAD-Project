import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getConfirmedSalonAppointments,
  updateAppointmentStatus,
} from "../apis/appointmentApi";
import Footer from "../components/salon/Footer";
import moment from "moment";

export default function ConfirmedAppointments() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      const { appointments, error } = await getConfirmedSalonAppointments();
      if (error) {
        console.error("Error fetching appointments:", error);
      } else {
        setAppointments(appointments || []);
      }
      setLoading(false);
    };

    fetchAppointments();
  }, []);

  const isPastEndTime = (appointment: any) => {
    const endDateTime = moment(
      `${appointment.appointment_date}T${appointment.end_time}`
    );
    return moment().isAfter(endDateTime);
  };

  const handleMarkCompleted = async (id: string) => {
    setUpdatingId(id);
    const { error } = await updateAppointmentStatus(id, "completed");

    if (!error) {
      // Update appointment status locally
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, status: "completed" } : a
        )
      );
    }
    setUpdatingId(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold">Confirmed Appointments</Text>
      </View>

      <ScrollView className="flex-1">
        {loading ? (
          <Text className="text-center mt-10">Loading...</Text>
        ) : appointments.length === 0 ? (
          <Text className="text-center mt-10">No confirmed appointments.</Text>
        ) : (
          appointments.map((appointment) => {
            const isCompleteAllowed =
              isPastEndTime(appointment) &&
              appointment.status !== "completed";

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

                <View className="mb-2">
                  <View className="flex-row items-center mb-1">
                    <Ionicons name="calendar" size={20} color="#666" />
                    <Text className="text-gray-600 ml-2">Date:</Text>
                    <Text className="text-gray-600 ml-2">
                      {appointment.appointment_date}
                    </Text>
                  </View>
                  <View className="flex-row items-center mb-1">
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
                </View>

                <TouchableOpacity
                  disabled={!isCompleteAllowed || updatingId === appointment.id}
                  onPress={() => handleMarkCompleted(appointment.id)}
                  className={`mt-3 p-2 rounded-lg ${
                    !isCompleteAllowed || updatingId === appointment.id
                      ? "bg-gray-300 opacity-70"
                      : "bg-green-600"
                  }`}
                >
                  <Text className="text-center text-white font-semibold">
                    {appointment.status === "completed"
                      ? "Completed"
                      : updatingId === appointment.id
                      ? "Updating..."
                      : "Mark as Completed"}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>

      <Footer />
    </SafeAreaView>
  );
}
