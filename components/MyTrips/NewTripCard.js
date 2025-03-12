import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const NewTripCard = () => {
  const router = useRouter();
  return (
    <View className="p-5 font-bold">
      <Ionicons name="location-sharp" size={24} color="black" />
      <Text className="text-3xl">No trips planned yet</Text>
      <Text>
        Looks like its time to plan a new travel experience. get started below
      </Text>
      <TouchableOpacity
        onPress={() => router.push("/create-trip/search-place")}
      >
        <Text>Start a new Trip</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NewTripCard;

const styles = StyleSheet.create({});
