import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { addService } from "../apis/salonApi";
import Footer from "../components/salon/Footer";
import { useThemeContext } from "../contexts/ThemeContext";

export default function Services() {
  const { colors } = useThemeContext();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
        const onBackPress = () => {
          router.replace('/Salon/Settings'); // Replace '/Role' with your target route path
          return true;
        };
    
        const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    
        return () => backHandler.remove();
      }, [router]);

  const handleSubmit = async () => {
    if (!name || !description || !duration || !price) {
      Alert.alert("Error", "Please fill out all fields");
      return;
    }

    // Ensure numeric values are parsed correctly
    const parsedDuration = parseInt(duration);
    const parsedPrice = parseFloat(price);

    if (isNaN(parsedDuration) || isNaN(parsedPrice)) {
      Alert.alert("Error", "Duration and price must be valid numbers");
      return;
    }

    setLoading(true);

    const result = await addService({
      name,
      description,
      duration_minutes: parsedDuration,
      price: parsedPrice,
    });

    setLoading(false);
    if (result.error) {
      Alert.alert("Error", result.error);
    } else {
      Alert.alert("Success", "Service added successfully!");
      // Reset form
      setName("");
      setDescription("");
      setDuration("");
      setPrice("");
    }
  };

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
          paddingTop: 60, // Safe area for status bar
          paddingBottom: 120, // Safe area for footer
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ 
          color: colors.text,
          fontSize: 28, 
          fontWeight: 'bold', 
          marginBottom: 24 
        }}>
          Add New Service
        </Text>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ 
            color: colors.text,
            fontSize: 16, 
            fontWeight: '600', 
            marginBottom: 8 
          }}>
            Service Name
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g., Haircut"
            placeholderTextColor={colors.textSecondary}
            style={{
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 12,
              padding: 16,
              fontSize: 16,
              color: colors.text,
            }}
          />
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ 
            color: colors.text,
            fontSize: 16, 
            fontWeight: '600', 
            marginBottom: 8 
          }}>
            Description
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Describe the service"
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
            style={{
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 12,
              padding: 16,
              fontSize: 16,
              color: colors.text,
              height: 100,
              textAlignVertical: 'top',
            }}
          />
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ 
            color: colors.text,
            fontSize: 16, 
            fontWeight: '600', 
            marginBottom: 8 
          }}>
            Duration (minutes)
          </Text>
          <TextInput
            value={duration}
            onChangeText={setDuration}
            placeholder="e.g., 30"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
            style={{
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 12,
              padding: 16,
              fontSize: 16,
              color: colors.text,
            }}
          />
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text style={{ 
            color: colors.text,
            fontSize: 16, 
            fontWeight: '600', 
            marginBottom: 8 
          }}>
            Price (PKR)
          </Text>
          <TextInput
            value={price}
            onChangeText={setPrice}
            placeholder="e.g., 1000"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
            style={{
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 12,
              padding: 16,
              fontSize: 16,
              color: colors.text,
            }}
          />
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          style={{
            backgroundColor: loading ? colors.border : colors.primary,
            borderRadius: 12,
            padding: 16,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? (
            <ActivityIndicator color={colors.surface} />
          ) : (
            <Text style={{ 
              color: colors.surface,
              fontSize: 16, 
              fontWeight: '600' 
            }}>
              Add Service
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
}
