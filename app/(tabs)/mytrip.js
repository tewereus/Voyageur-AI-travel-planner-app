import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import NewTripCard from "../../components/MyTrips/NewTripCard";

const MyTrip = () => {
  const [userTrips, setUserTrips] = useState([]);
  return (
    <View>
      <Text className="text-3xl bg-black p-5 text-white">MyTrip</Text>
      <Ionicons name="add-circle" size={24} color="black" />
      {userTrips > 0 ? null : <NewTripCard />}
    </View>
  );
};

export default MyTrip;

const styles = StyleSheet.create({});
