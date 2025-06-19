import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { format } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createAppointment } from "../apis/appointmentApi";
import { getSalonWithServices } from "../apis/salonApi";
import Footer from "../components/customer/Footer";
import { useThemeContext } from "../contexts/ThemeContext";

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
  const router = useRouter();
  const { colors } = useThemeContext();
  const [salon, setSalon] = useState<Salon | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);

  useEffect(() => {
      const onBackPress = () => {
        router.push('/Customer/BookAppointment'); // Replace '/Role' with your target route path
        return true;
      };
  
      const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
  
      return () => backHandler.remove();
    }, [router]);

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

  const handleRequestBooking = async () => {
    if (selectedServices.length === 0) {
      Alert.alert("Error", "Please add at least one service");
      return;
    }

    if (selectedTime === "No available slots") {
      Alert.alert("Error", "No available time slots");
      return;
    }

    try {
      // Convert selected time to 24-hour format for API
      const time24 = convertTo24Hour(selectedTime);
      const today = format(new Date(), "yyyy-MM-dd");
      
      // Calculate end time based on total duration
      const [hours, minutes] = time24.split(":").map(Number);
      const endTime = new Date();
      endTime.setHours(hours, minutes + calculateTotalDuration());
      const endTime24 = format(endTime, "HH:mm:ss");

      const appointmentData = {
        salonId: salon?.id || "",
        serviceIds: selectedServices.map(s => s.id),
        appointmentDate: today,
        startTime: time24 + ":00",
        endTime: endTime24,
      };

      const result = await createAppointment(appointmentData);
      if (result.error) {
        Alert.alert("Error", result.error);
      } else {
        Alert.alert(
          "Success",
          "Appointment requested successfully!",
          [
            {
              text: "OK",
              onPress: () => router.push("/Customer/MyAppointments"),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to create appointment");
    }
  };

  const convertTo24Hour = (time12: string): string => {
    const [time, period] = time12.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    
    let hour24 = hours;
    if (period === "PM" && hours !== 12) {
      hour24 = hours + 12;
    } else if (period === "AM" && hours === 12) {
      hour24 = 0;
    }
    
    return `${hour24.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <View style={{ 
        flex: 1, 
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ 
          color: colors.text,
          fontSize: 16,
          marginTop: 16
        }}>
          Loading salon details...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ 
      flex: 1, 
      backgroundColor: colors.background 
    }}>
      <ScrollView 
        style={{ 
          flex: 1, 
          backgroundColor: colors.background 
        }}
        contentContainerStyle={{
          padding: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ 
          color: colors.text,
          fontSize: 28, 
          fontWeight: 'bold', 
          marginBottom: 24 
        }}>
          Book Appointment
        </Text>

        {salon && (
          <View style={{
            backgroundColor: colors.surface,
            padding: 16,
            borderRadius: 12,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: colors.border,
          }}>
            <Text style={{ 
              color: colors.text,
              fontSize: 20, 
              fontWeight: '600', 
              marginBottom: 8 
            }}>
              {salon.salon_name}
            </Text>
            <Text style={{ 
              color: colors.textSecondary,
              fontSize: 14,
              marginBottom: 4
            }}>
              {salon.address}
            </Text>
            <Text style={{ 
              color: colors.textSecondary,
              fontSize: 14,
              marginBottom: 4
            }}>
              {salon.city}
            </Text>
            <Text style={{ 
              color: colors.textSecondary,
              fontSize: 14
            }}>
              Hours: {salon.open_time} - {salon.close_time}
            </Text>
          </View>
        )}

        <View style={{ marginBottom: 24 }}>
          <Text style={{ 
            color: colors.text,
            fontSize: 18, 
            fontWeight: '600', 
            marginBottom: 12 
          }}>
            Select Time
          </Text>
          <View style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            overflow: 'hidden'
          }}>
            <Picker
              selectedValue={selectedTime}
              onValueChange={(itemValue) => setSelectedTime(itemValue)}
              style={{
                color: colors.text,
                backgroundColor: colors.surface,
              }}
            >
              {timeSlots.map((slot) => (
                <Picker.Item 
                  key={slot} 
                  label={slot} 
                  value={slot}
                  color={colors.text}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text style={{ 
            color: colors.text,
            fontSize: 18, 
            fontWeight: '600', 
            marginBottom: 12 
          }}>
            Available Services
          </Text>
          {services.map((service) => (
            <TouchableOpacity
              key={service.id}
              onPress={() => handleBookService(service)}
              style={{
                backgroundColor: colors.surface,
                padding: 16,
                borderRadius: 12,
                marginBottom: 8,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ 
                    color: colors.text,
                    fontSize: 16, 
                    fontWeight: '600', 
                    marginBottom: 4 
                  }}>
                    {service.name}
                  </Text>
                  <Text style={{ 
                    color: colors.textSecondary,
                    fontSize: 14 
                  }}>
                    {service.duration_minutes} minutes
                  </Text>
                </View>
                <Text style={{ 
                  color: colors.primary,
                  fontSize: 16, 
                  fontWeight: '600' 
                }}>
                  Rs. {service.price}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {selectedServices.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <Text style={{ 
              color: colors.text,
              fontSize: 18, 
              fontWeight: '600', 
              marginBottom: 12 
            }}>
              Selected Services
            </Text>
            {selectedServices.map((service) => (
              <View
                key={service.id}
                style={{
                  backgroundColor: colors.surface,
                  padding: 16,
                  borderRadius: 12,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: colors.border,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ 
                    color: colors.text,
                    fontSize: 16, 
                    fontWeight: '600' 
                  }}>
                    {service.name}
                  </Text>
                  <Text style={{ 
                    color: colors.textSecondary,
                    fontSize: 14 
                  }}>
                    Rs. {service.price}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => removeService(service.id)}
                  style={{
                    backgroundColor: colors.error,
                    padding: 8,
                    borderRadius: 6,
                  }}
                >
                  <Ionicons name="close" size={16} color={colors.surface} />
                </TouchableOpacity>
              </View>
            ))}
            
            <View style={{
              backgroundColor: colors.surface,
              padding: 16,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
            }}>
              <Text style={{ 
                color: colors.text,
                fontSize: 16, 
                fontWeight: '600', 
                marginBottom: 4 
              }}>
                Total Duration: {calculateTotalDuration()} minutes
              </Text>
              <Text style={{ 
                color: colors.primary,
                fontSize: 18, 
                fontWeight: 'bold' 
              }}>
                Total Amount: Rs. {calculateTotal()}
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          onPress={handleRequestBooking}
          disabled={selectedServices.length === 0}
          style={{
            backgroundColor: selectedServices.length === 0 ? colors.border : colors.primary,
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
            opacity: selectedServices.length === 0 ? 0.6 : 1,
          }}
        >
          <Text style={{ 
            color: colors.text,
            fontSize: 16, 
            fontWeight: '600' 
          }}>
            Request Booking
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
}
