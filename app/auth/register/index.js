import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ToastAndroid,
  Platform,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../configs/firebaseConfig";
import { Colors } from "../../../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const onCreateAccount = async () => {
    if (!email || !password || !fullName) {
      ToastAndroid.show("Please fill in all fields", ToastAndroid.BOTTOM);
      return;
    }

    if (password.length < 8) {
      ToastAndroid.show(
        "Password must be at least 8 characters long",
        ToastAndroid.BOTTOM
      );
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      router.replace("/mytrip");
    } catch (error) {
      const errorMessage = error.message;
      ToastAndroid.show(errorMessage, ToastAndroid.BOTTOM);
    } finally {
      setLoading(false);
    }
  };

  const CustomInput = ({
    icon,
    placeholder,
    value,
    onChangeText,
    secureTextEntry,
    keyboardType = "default",
    autoCapitalize = "none",
  }) => (
    <View
      style={[
        styles.inputWrapper,
        focusedInput === placeholder && styles.inputWrapperFocused,
      ]}
    >
      <Ionicons
        name={icon}
        size={20}
        color={
          focusedInput === placeholder ? Colors.raw.accent : Colors.raw.tertiary
        }
        style={styles.inputIcon}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.raw.tertiary}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        onFocus={() => setFocusedInput(placeholder)}
        onBlur={() => setFocusedInput(null)}
      />
      {placeholder === "Create a password" && (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color={Colors.raw.tertiary}
          />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <LinearGradient
        colors={[Colors.raw.accent, Colors.raw.primary]}
        style={styles.headerGradient}
      >
        <SafeAreaView style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/auth/sign-in")}
          >
            <Ionicons
              name="arrow-back-outline"
              size={24}
              color={Colors.raw.white}
            />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.logoText}>Voyageur</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Create New Account</Text>
          <Text style={styles.subtitle}>
            Join our community of travelers and start planning your next
            adventure
          </Text>
        </View>

        <View style={styles.formContainer}>
          <CustomInput
            icon="person-outline"
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />

          <CustomInput
            icon="mail-outline"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <View>
            <CustomInput
              icon="lock-closed-outline"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <Text style={styles.passwordHint}>
              Password must be at least 8 characters long
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.createAccountButton,
              loading && styles.buttonDisabled,
            ]}
            onPress={onCreateAccount}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.raw.white} />
            ) : (
              <Text style={styles.createAccountButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <LinearGradient
                colors={["#DB4437", "#EA4335"]}
                style={styles.socialButtonGradient}
              >
                <Ionicons
                  name="logo-google"
                  size={24}
                  color={Colors.raw.white}
                />
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <LinearGradient
                colors={["#000000", "#1A1A1A"]}
                style={styles.socialButtonGradient}
              >
                <Ionicons
                  name="logo-apple"
                  size={24}
                  color={Colors.raw.white}
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.replace("auth/sign-in")}>
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.raw.background,
  },
  headerGradient: {
    height: height * 0.28,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 50 : StatusBar.currentHeight + 20,
    paddingHorizontal: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  headerTextContainer: {
    alignItems: "center",
    // marginTop: 20,
  },
  welcomeHeaderText: {
    fontFamily: "outfit",
    fontSize: 18,
    color: Colors.raw.white,
    opacity: 0.9,
  },
  logoText: {
    fontFamily: "outfit-bold",
    fontSize: 36,
    color: Colors.raw.white,
  },
  content: {
    flex: 1,
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: Colors.raw.background,
    padding: 24,
  },
  titleContainer: {
    marginBottom: 32,
  },
  title: {
    fontFamily: "outfit-bold",
    fontSize: 28,
    color: Colors.raw.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.raw.tertiary,
    lineHeight: 24,
  },
  formContainer: {
    gap: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.raw.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: Colors.raw.inputBorder,
  },
  inputWrapperFocused: {
    borderColor: Colors.raw.accent,
    borderWidth: 2,
    shadowColor: Colors.raw.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.raw.primary,
  },
  passwordHint: {
    fontFamily: "outfit",
    fontSize: 12,
    color: Colors.raw.tertiary,
    marginTop: 8,
    marginLeft: 4,
  },
  createAccountButton: {
    backgroundColor: Colors.raw.accent,
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    shadowColor: Colors.raw.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  createAccountButtonText: {
    fontFamily: "outfit-bold",
    fontSize: 16,
    color: Colors.raw.white,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.raw.inputBorder,
  },
  dividerText: {
    fontFamily: "outfit",
    fontSize: 14,
    color: Colors.raw.tertiary,
    marginHorizontal: 16,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    overflow: "hidden",
  },
  socialButtonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
    gap: 8,
  },
  footerText: {
    fontFamily: "outfit",
    fontSize: 14,
    color: Colors.raw.tertiary,
  },
  signInText: {
    fontFamily: "outfit-bold",
    fontSize: 14,
    color: Colors.raw.accent,
  },
});
