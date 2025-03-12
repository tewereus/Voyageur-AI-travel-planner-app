import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Colors } from "../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function Login() {
  const router = useRouter();

  const features = [
    {
      icon: "map-outline",
      title: "Smart Itineraries",
      description: "AI-powered travel plans tailored just for you",
    },
    {
      icon: "compass-outline",
      title: "Local Insights",
      description: "Discover hidden gems and authentic experiences",
    },
    {
      icon: "shield-checkmark-outline",
      title: "Travel Safe",
      description: "Real-time safety updates and travel advisories",
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <Image
        source={require("./../assets/images/home.png")}
        style={styles.heroImage}
      />

      <LinearGradient
        colors={[
          "rgba(45, 50, 80, 0.95)", // Colors.raw.primary with opacity
          "rgba(0, 0, 0, 0.98)",
        ]}
        style={styles.overlay}
      />

      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.title}>Voyageur</Text>
          <Text style={styles.subtitle}>Your AI-Powered Travel Companion</Text>
        </View>

        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureIconContainer}>
                <Ionicons
                  name={feature.icon}
                  size={24}
                  color={Colors.raw.accent}
                />
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => router.push("auth/sign-in")}
          >
            <LinearGradient
              colors={[Colors.raw.accent, Colors.raw.primary]}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.signInButtonText}>Get Started</Text>
              <Ionicons
                name="arrow-forward"
                size={20}
                color={Colors.raw.white}
                style={styles.buttonIcon}
              />
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.raw.primary,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.75, // Increased overlay opacity
  },
  heroImage: {
    width: "100%",
    height: height * 0.5,
    resizeMode: "cover",
  },
  contentContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    paddingTop: Platform.OS === "ios" ? 60 : StatusBar.currentHeight + 20,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  headerContainer: {
    alignItems: "center",
  },
  welcomeText: {
    fontFamily: "outfit",
    fontSize: 20,
    color: Colors.raw.white,
    opacity: 1, // Increased opacity for better visibility
    textShadowColor: "rgba(0, 0, 0, 0.75)", // Added text shadow
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  title: {
    fontSize: 48,
    fontFamily: "outfit-bold",
    color: Colors.raw.white,
    marginVertical: 8,
    textShadowColor: "rgba(0, 0, 0, 0.75)", // Added text shadow
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontFamily: "outfit",
    fontSize: 18,
    color: Colors.raw.white,
    opacity: 1, // Increased opacity for better visibility
    textShadowColor: "rgba(0, 0, 0, 0.75)", // Added text shadow
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  featuresContainer: {
    gap: 20,
    paddingVertical: 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.98)", // Increased opacity for better contrast
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.raw.accent,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15, // Increased shadow opacity
    shadowRadius: 8,
    elevation: 5,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    shadowColor: Colors.raw.accent,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: "outfit-bold",
    fontSize: 16,
    color: Colors.raw.primary,
    marginBottom: 4,
  },
  featureDescription: {
    fontFamily: "outfit",
    fontSize: 14,
    color: Colors.raw.tertiary,
    lineHeight: 20,
  },
  buttonContainer: {
    paddingBottom: 40,
  },
  signInButton: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: Colors.raw.accent,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  gradientButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  signInButtonText: {
    color: Colors.raw.white,
    textAlign: "center",
    fontFamily: "outfit-bold",
    fontSize: 18,
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  termsText: {
    fontFamily: "outfit",
    fontSize: 12,
    color: Colors.raw.white,
    opacity: 0.7,
    textAlign: "center",
    marginTop: 16,
  },
});
