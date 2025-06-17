import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getSalonWithServices } from "../apis/salonApi";
import { createAppointment } from "../apis/appointmentApi";
import { format } from "date-fns";

interface Service {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
}

interface Salon {
  salon_name: string;
  address: string;
  city: string;
  open_time: string;
  close_time: string;
}

export default function RequestBooking() {
  const { salonName } = useLocalSearchParams();
  const [salon, setSalon] = useState<Salon | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);

  useEffect(() => {
    const generateTimeSlots = () => {
      if (!salon) return;
  
      const slots: string[] = [];
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinutes = now.getMinutes();
  
      // Parse salon working hours
      const [openHour, openMinute] = salon.open_time.split(":").map(Number);
      const [closeHour, closeMinute] = salon.close_time.split(":").map(Number);
  
      // Calculate next available slot (1 hour from now)
      let startHour = currentHour + 1;
      let startMinute = 0;
  
      // Handle overnight closing times (like 3 AM)
      const isOvernight = closeHour < openHour;
      
      // Check if current time is outside working hours
      const isBeforeOpening = isOvernight 
        ? (currentHour < openHour && currentHour >= closeHour)
        : (currentHour < openHour || currentHour >= closeHour);
      
      const isAfterClosing = isOvernight
        ? (currentHour >= closeHour && currentHour < openHour)
        : (currentHour >= closeHour);
  
      // If we're before opening time, first slot is opening time
      if (isBeforeOpening) {
        startHour = openHour;
        startMinute = openMinute;
      }
      // If we're after closing time, no slots available
      else if (isAfterClosing) {
        setTimeSlots([]);
        setSelectedTime("No available slots");
        return;
      }
  
      // Generate slots
      let currentSlotHour = startHour;
      let currentSlotMinute = startMinute;
      let safetyCounter = 0;
      const maxSlots = 24;
  
      while (safetyCounter < maxSlots) {
        safetyCounter++;
        
        // Check if we've passed closing time
        if (!isOvernight && currentSlotHour >= closeHour && 
            (currentSlotHour > closeHour || currentSlotMinute >= closeMinute)) {
          break;
        }
        // Special handling for overnight closing
        if (isOvernight && currentSlotHour >= closeHour && 
            currentSlotHour < openHour) {
          break;
        }
  
        // Corrected AM/PM conversion
        let ampm = "AM";
        let displayHour = currentSlotHour;
        
        if (currentSlotHour === 0) {
          displayHour = 12; // Midnight (12 AM)
          ampm = "AM";
        } else if (currentSlotHour < 12) {
          ampm = "AM";
        } else if (currentSlotHour === 12) {
          ampm = "PM"; // Noon (12 PM)
        } else {
          displayHour = currentSlotHour % 12;
          ampm = "PM";
        }
  
        const timeString = `${displayHour}:${currentSlotMinute
          .toString()
          .padStart(2, "0")} ${ampm}`;
        slots.push(timeString);
  
        // Move to next hour
        currentSlotHour += 1;
        currentSlotMinute = 0;
  
        // Handle midnight rollover
        if (currentSlotHour >= 24) {
          currentSlotHour = 0;
        }
      }
  
      setTimeSlots(slots);
      if (slots.length > 0) {
        setSelectedTime(slots[0]);
      } else {
        setSelectedTime("No available slots");
      }
    };
  
    generateTimeSlots();
  }, [salon]);

  useEffect(() => {
    const fetchSalonData = async () => {
      setLoading(true);
      console.log(salonName);
      const result = await getSalonWithServices(salonName as string); // passed from previous screen
      console.log(result);
      if (result.error) {
        Alert.alert("Error", result.error);
      } else {
        setSalon(result.salon as Salon);
        setServices(result.services as Service[]);
      }
      setLoading(false);
    };

    fetchSalonData();
  }, []);

  const handleBookService = (service: Service) => {
    setSelectedService(service);
    // Add service to selected services if not already added
    if (!selectedServices.find((s) => s.id === service.id)) {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const removeService = (serviceId: string) => {
    setSelectedServices(selectedServices.filter((s) => s.id !== serviceId));
  };

  const calculateTotal = () => {
    return selectedServices.reduce(
      (total, service) => total + service.price,
      0
    );
  };

  const calculateTotalDuration = () => {
    return selectedServices.reduce(
      (total, service) => total + service.duration_minutes,
      0
    );
  };

//   const handleRequestBooking = () => {
//     if (selectedServices.length === 0) {
//       Alert.alert("Error", "Please add at least one service");
//       return;
//     }
//     Alert.alert(
//       "Confirm Booking",
//       `Would you like to book ${
//         selectedServices.length
//       } service(s) at ${selectedTime}?\nTotal Duration: ${calculateTotalDuration()} minutes\nTotal Amount: Rs. ${calculateTotal()}`,
//       [
//         {
//           text: "Cancel",
//           style: "cancel",
//         },
//         {
//           text: "Book Now",
//           onPress: () => {
//             // Add your booking logic here
//             Alert.alert("Success", "Booking confirmed!");
//           },
//         },
//       ]
//     );
//   };
const handleRequestBooking = async () => {
    if (selectedServices.length === 0) {
      Alert.alert("Error", "Please add at least one service");
      return;
    }
  
    Alert.alert(
      "Confirm Booking",
      `Would you like to book ${
        selectedServices.length
      } service(s) at ${selectedTime}?\nTotal Duration: ${calculateTotalDuration()} minutes\nTotal Amount: Rs. ${calculateTotal()}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Book Now",
          onPress: async () => {
            try {
              const today = new Date();
              const appointmentDate = today.toISOString().split("T")[0]; // format YYYY-MM-DD
  
              // Parse selected time like "3:00 PM"
              const [time, period] = selectedTime.split(" ");
              let [hour, minute] = time.split(":").map(Number);
  
              if (period === "PM" && hour !== 12) hour += 12;
              if (period === "AM" && hour === 12) hour = 0;
  
              const start = new Date();
              start.setHours(hour);
              start.setMinutes(minute);
              start.setSeconds(0);
  
              const duration = calculateTotalDuration();
              const end = new Date(start.getTime() + duration * 60000); // Add duration in ms
  
              const startTime = start.toTimeString().split(" ")[0]; // "HH:MM:SS"
              const endTime = end.toTimeString().split(" ")[0];
  
              const result = await createAppointment({
                salonId: salon?.id || "", // Make sure `salon` has an `id` property
                serviceIds: selectedServices.map((s) => s.id),
                appointmentDate,
                startTime,
                endTime,
              });
  
              if (result.error) {
                Alert.alert("Booking Failed", result.error);
              } else {
                Alert.alert("Success", "Your booking has been confirmed!");
                setSelectedServices([]);
              }
            } catch (error) {
              Alert.alert("Error", "Something went wrong while booking.");
            }
          },
        },
      ]
    );
  };


  if (loading) {
    return <ActivityIndicator className="mt-20" />;
  }

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-2">{salon?.salon_name}</Text>
      <Text className="text-gray-600 mb-2">{salon?.address}</Text>
      <Text className="text-gray-600 mb-4">{salon?.city}</Text>
      <Text className="text-gray-600 mb-2">Working Hours</Text>
      <Text className="text-gray-600 mb-4">
        {salon?.open_time} - {salon?.close_time}
      </Text>

      <Text className="text-xl font-bold mb-2">Available Services:</Text>
      {services.length > 0 ? (
        services.map((service) => (
          <View
            key={service.id}
            className="border border-gray-200 rounded-lg p-4 mb-4 bg-white shadow-sm"
          >
            <Text className="text-lg font-medium">{service.name}</Text>
            <Text className="text-gray-500">Price: Rs. {service.price}</Text>
            <Text className="text-gray-500 mb-3">
              Duration: {service.duration_minutes} min
            </Text>
            <TouchableOpacity
              onPress={() => handleBookService(service)}
              className="bg-blue-500 py-2 px-4 rounded-lg self-start"
            >
              <Text className="text-white font-semibold">add now</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text className="text-gray-500">No services listed yet.</Text>
      )}

      {/* Time Slot Selection */}
      <View className="mt-6 mb-8">
        <Text className="text-xl font-bold mb-4">Select Time Slot:</Text>
        <View className="border border-gray-300 rounded-lg overflow-hidden">
          <Picker
            selectedValue={selectedTime}
            onValueChange={(itemValue) => setSelectedTime(itemValue)}
          >
            {timeSlots.length > 0 ? (
              timeSlots.map((time) => (
                <Picker.Item key={time} label={time} value={time} />
              ))
            ) : (
              <Picker.Item
                label="No available slots today"
                value="No available slots"
              />
            )}
          </Picker>
        </View>
      </View>

      {/* Selected Services Section */}
      <Text className="text-xl font-bold">Selected Services:</Text>
      <View className="mt-4 mb-20">
        {selectedServices.length > 0 ? (
          <>
            {selectedServices.map((service) => (
              <View
                key={service.id}
                className="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-200"
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-lg font-medium">{service.name}</Text>
                    <Text className="text-gray-500">
                      Price: Rs. {service.price}
                    </Text>
                    <Text className="text-gray-500">
                      Duration: {service.duration_minutes} min
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => removeService(service.id)}
                    className="ml-4 p-2"
                  >
                    <Ionicons name="close-circle" size={24} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            <View className="bg-blue-50 p-4 rounded-lg mt-2">
              <Text className="text-lg font-semibold">
                Total Duration: {calculateTotalDuration()} minutes
              </Text>
              <Text className="text-lg font-semibold">
                Total Amount: Rs. {calculateTotal()}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleRequestBooking}
              className="bg-blue-500 py-3 px-6 rounded-lg mt-4 self-center"
            >
              <Text className="text-white font-semibold text-lg">
                Request Booking
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <View className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <Text className="text-gray-500 text-center">No services added</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
