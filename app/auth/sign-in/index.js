import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ToastAndroid,
  Platform,
  Dimensions,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./../../../configs/firebaseConfig";
import { Colors } from "../../../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

const { width, height } = Dimensions.get("window");

export default function SignIn() {
  const navigation = useNavigation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const onSignIn = async () => {
    if (!email && !password) {
      ToastAndroid.show("Please enter Email and Password", ToastAndroid.LONG);
      return;
    }
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      router.replace("/mytrip");
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        ToastAndroid.show("Invalid Credentials", ToastAndroid.LONG);
      }
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
      {placeholder === "Enter your password" && (
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
        colors={[Colors.raw.primary, Colors.raw.accent]}
        style={styles.headerGradient}
      >
        <SafeAreaView style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back-outline"
              size={24}
              color={Colors.raw.white}
            />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Voyageur</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome back</Text>
          <Text style={styles.headerText}>Sign in to your account</Text>
        </View>

        <View style={styles.formContainer}>
          <CustomInput
            icon="mail-outline"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <CustomInput
            icon="lock-closed-outline"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.signInButton,
              loading && styles.signInButtonDisabled,
            ]}
            onPress={onSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.raw.white} />
            ) : (
              <Text style={styles.signInButtonText}>Sign In</Text>
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
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.replace("auth/register")}>
            <Text style={styles.createAccountText}>Create Account</Text>
          </TouchableOpacity>
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
    height: height * 0.25,
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
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  logoText: {
    fontFamily: "outfit-bold",
    fontSize: 32,
    color: Colors.raw.white,
    marginBottom: 8,
  },
  content: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: Colors.raw.background,
    padding: 24,
  },
  welcomeContainer: {
    marginBottom: 30,
  },
  welcomeText: {
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.raw.secondary,
    marginBottom: 8,
  },
  headerText: {
    fontFamily: "outfit-bold",
    fontSize: 28,
    color: Colors.raw.primary,
  },
  formContainer: {
    gap: 16,
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
  forgotPassword: {
    alignSelf: "flex-end",
  },
  forgotPasswordText: {
    fontFamily: "outfit",
    fontSize: 14,
    color: Colors.raw.accent,
  },
  signInButton: {
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
  signInButtonDisabled: {
    opacity: 0.7,
  },
  signInButtonText: {
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
  createAccountText: {
    fontFamily: "outfit-bold",
    fontSize: 14,
    color: Colors.raw.accent,
  },
});
