import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import homeUi from "../assets/images/home.png";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();
  return (
    <View>
      <Image
        source={homeUi}
        style={{
          width: "100%",
          height: 350,
        }}
      />
      <View style={styles.container}>
        <Text style={styles.title}>AI Travel Planner</Text>
        <Text style={styles.desciption}>
          Discover your next adventure efforlessely. Personalized itineraries at
          your fingertips. Travel smarter with AI-driven insights
        </Text>
        <TouchableOpacity
          onPress={() => router.push("auth/sign-in")}
          style={styles.button}
        >
          <Text
            style={{
              color: "#fff",
              textAlign: "center",
              fontFamily: "outfit",
              fontSize: 17,
            }}
          >
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: -20,
    height: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "#fff",
    padding: 15,
  },
  title: {
    fontFamily: "outfit-bold",
    fontSize: 24,
    color: "#000",
    textAlign: "center",
  },
  desciption: {
    textAlign: "center",
    fontFamily: "outfit",
    fontSize: 20,
    color: "#7d7d7d",
  },
  button: {
    padding: 15,
    backgroundColor: "#000",
    borderRadius: 99,
    marginTop: "25%",
  },
});
