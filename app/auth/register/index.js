import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../../../config/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router"; // Import useRouter

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // Initialize the router

  const onCreateUser = () => {
    if (!fullName || !email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("User created:", user);
        Alert.alert("Success", "Account created successfully!");
        // Navigate to a different screen or reset the form
        router.push("/auth/sign-in"); // Use router.push to navigate
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error creating user:", errorCode, errorMessage);
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
      <TouchableOpacity onPress={() => router.back()}>
        {" "}
        {/* Use router.back() */}
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 30,
          marginTop: 20,
        }}
      >
        Create Your Account
      </Text>

      <View style={{ marginTop: 30 }}>
        <Text
          style={{
            fontFamily: "outfit",
          }}
        >
          Full Name
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Full Name"
          value={fullName}
          onChangeText={setFullName}
        />
      </View>
      <View style={{ marginTop: 30 }}>
        <Text
          style={{
            fontFamily: "outfit",
          }}
        >
          Email
        </Text>
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
        <Text
          style={{
            fontFamily: "outfit",
          }}
        >
          Password
        </Text>
        <TextInput
          secureTextEntry={true}
          style={styles.input}
          placeholder="Enter Password"
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={onCreateUser}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push("/auth/login")} // Use router.push
        style={{ marginTop: 10 }}
      >
        <Text style={{ textAlign: "center", fontFamily: "outfit" }}>
          Already have an account? <Text style={{ color: "blue" }}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Register;

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
