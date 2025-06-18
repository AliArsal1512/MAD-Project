import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { addService } from "../apis/salonApi";

export default function Services() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

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
    }

    Alert.alert("Success", "Service added successfully");

    // Reset form
    setName("");
    setDescription("");
    setDuration("");
    setPrice("");
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-bold mb-4">Add New Service</Text>

        <Text className="text-lg font-medium mb-1">Service Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g., Haircut"
          className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
        />

        <Text className="text-lg font-medium mb-1">Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Describe the service"
          multiline
          numberOfLines={4}
          className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-base"
        />

        <Text className="text-lg font-medium mb-1">Duration (minutes)</Text>
        <TextInput
          value={duration}
          onChangeText={setDuration}
          placeholder="e.g., 30"
          keyboardType="numeric"
          className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
        />

        <Text className="text-lg font-medium mb-1">Price (PKR)</Text>
        <TextInput
          value={price}
          onChangeText={setPrice}
          placeholder="e.g., 1000"
          keyboardType="numeric"
          className="border border-gray-300 rounded-lg px-3 py-2 mb-6"
        />

        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-blue-500 rounded-xl py-3 flex-row justify-center items-center"
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center text-lg font-semibold">
              Add Service
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
