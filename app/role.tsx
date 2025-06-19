import { useRouter } from "expo-router";
import { useEffect } from "react";
import { BackHandler, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BarberIcon from "../assets/icons/BarberIcon";
import CustomerIcon from "../assets/icons/CustomerIcon";
import { useThemeContext } from "./contexts/ThemeContext";

export default function Index() {
    const router = useRouter();
    const { colors } = useThemeContext();

    useEffect(() => {
        const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            router.replace("/");
            return true;
        });

        return () => backHandler.remove();
    }, []);

  return (
    <SafeAreaView style={{ 
      flex: 1, 
      backgroundColor: colors.background, 
      justifyContent: 'center' 
    }}>
      {/* Header Section */}
      <View style={{ alignItems: 'center', marginBottom: 64 }}>
        <Text style={{ 
          color: colors.text,
          fontSize: 40, 
          fontWeight: 'bold' 
        }}>
          DigiBarber
        </Text>
        <Text style={{ 
          color: colors.textSecondary,
          fontSize: 20, 
          marginTop: 8 
        }}>
          Select Your Role
        </Text>
      </View>

      {/* Role Selection Cards */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'center', 
        width: '100%', 
        marginBottom: 48 
      }}>
        {/* Barber Card */}
        <TouchableOpacity
          onPress={() => router.push("/auth/login_salon")} 
          style={{
            alignItems: 'center',
            marginHorizontal: 8,
            paddingHorizontal: 8,
            paddingVertical: 16,
            borderRadius: 16,
            width: '44%',
            height: 192,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
          }}
          activeOpacity={0.7}
        >
          <BarberIcon size={60} color={colors.text} />
          <Text style={{ 
            color: colors.text,
            marginTop: 24, 
            fontSize: 20, 
            fontWeight: '600' 
          }}>
            Salon
          </Text>
        </TouchableOpacity>

        {/* Customer Card */}
        <TouchableOpacity
          onPress={() => router.push("/auth/login_customer")}  
          style={{
            alignItems: 'center',
            marginHorizontal: 8,
            paddingHorizontal: 8,
            paddingVertical: 16,
            borderRadius: 16,
            backgroundColor: colors.surface,
            width: '44%',
            height: 192,
            borderWidth: 1,
            borderColor: colors.border,
          }}
          activeOpacity={0.7}
        >
          <CustomerIcon size={60} color={colors.text} />
          <Text style={{ 
            color: colors.text,
            marginTop: 24, 
            fontSize: 20, 
            fontWeight: '600' 
          }}>
            Customer
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
