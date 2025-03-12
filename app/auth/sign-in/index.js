import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../config/firebaseConfig";
import { useRouter } from "expo-router";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const onSignIn = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("User signed in:", user);
        Alert.alert("Success", "Signed in successfully!");
        // Navigate to home or other protected page
        router.replace("/mytrip"); // Replace "/home" with your desired route
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error signing in:", errorCode, errorMessage);
        Alert.alert("Error", errorMessage);
      });
  };

  return (
    <View
      style={{
        padding: 25,
        paddingTop: 50,
        backgroundColor: "#fff",
        height: "100%",
      }}
    >
      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 30,
        }}
      >
        Let's Sign You In
      </Text>
      <Text
        style={{
          fontFamily: "outfit",
          fontSize: 20,
          color: "#7d7d7d",
          marginTop: 10,
        }}
      >
        Welcome Back
      </Text>
      <Text
        style={{
          fontFamily: "outfit",
          fontSize: 20,
          marginTop: 5,
          color: "#7d7d7d",
        }}
      >
        You've been missed!
      </Text>
      <View style={{ marginTop: 30 }}>
        <Text style={{ fontFamily: "outfit" }}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={{ marginTop: 30 }}>
        <Text style={{ fontFamily: "outfit" }}>Password</Text>
        <TextInput
          secureTextEntry={true}
          style={styles.input}
          placeholder="Enter Password"
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={onSignIn}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("auth/register")}
        style={{ marginTop: 10 }}
      >
        <Text style={{ textAlign: "center", fontFamily: "outfit" }}>
          Don't have an account?{" "}
          <Text style={{ color: "blue" }}>Create account</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  input: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: "#7d7d7d",
    fontFamily: "outfit",
  },
  button: {
    backgroundColor: "#007bff", // Example blue color
    padding: 15,
    borderRadius: 15,
    marginTop: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontFamily: "outfit-bold",
    fontSize: 16,
  },
});
