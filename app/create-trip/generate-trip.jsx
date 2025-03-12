import { View, Text, Image, Animated, Easing } from "react-native";
import React, { useContext, useEffect, useState, useRef } from "react";
import { CreateTripContext } from "../../context/CreateTripContext";
import { AI_PROMPT } from "../../constants/Options";
import { chatSession } from "../../configs/AiModal";
import { useRouter } from "expo-router";
import { auth, db } from "./../../configs/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function GenerateTrip() {
  const { tripData, setTripData } = useContext(CreateTripContext);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const user = auth.currentUser;

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Continuous rotation animation
    const startSpinAnimation = () => {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    };

    startSpinAnimation();
    GenerateAiTrip();
  }, []);

  // Create the rotation interpolation
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const GenerateAiTrip = async () => {
    try {
      setLoading(true);
      setProgress(0);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 0.2, 0.9));
      }, 1000);

      const FINAL_PROMPT = AI_PROMPT.replace(
        "{location}",
        tripData?.locationInfo?.name
      )
        .replace("{totalDays}", tripData.totalNoOfDays)
        .replace("{totalNight}", tripData.totalNoOfDays - 1)
        .replace("{traveler}", tripData.traveler?.title)
        .replace("{budget}", tripData.budget)
        .replace("{totalDays}", tripData.totalNoOfDays)
        .replace("{totalNight}", tripData.totalNoOfDays - 1);

      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const responseText = result.response.text();
      const tripResp = JSON.parse(responseText);
      const docId = Date.now().toString();

      await setDoc(doc(db, "UserTrips", docId), {
        userEmail: user.email,
        tripPlan: tripResp,
        tripData: JSON.stringify(tripData),
        docId: docId,
      });

      clearInterval(progressInterval);
      setProgress(1);
      setLoading(false);
      router.replace("(tabs)/mytrip");
    } catch (error) {
      console.error("Error generating trip:", error);
      setLoading(false);
    }
  };

  const getProgressMessage = () => {
    if (progress < 0.3) return "Exploring amazing destinations...";
    if (progress < 0.6) return "Crafting your perfect itinerary...";
    if (progress < 0.9) return "Adding final magical touches...";
    return "Almost there!";
  };

  return (
    <LinearGradient colors={["#6C63FF", "#5A52E5"]} style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <MaterialCommunityIcons
                name="airplane"
                size={40}
                color="#6C63FF"
              />
            </Animated.View>
          </View>

          <Text style={styles.title}>Creating Your Dream Trip</Text>

          <Text style={styles.destination}>
            {tripData?.locationInfo?.name || "Amazing Destination"}
          </Text>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View
                style={[styles.progressFill, { width: `${progress * 100}%` }]}
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round(progress * 100)}%
            </Text>
          </View>

          <Text style={styles.statusMessage}>{getProgressMessage()}</Text>

          <View style={styles.tripDetails}>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons
                name="calendar-range"
                size={24}
                color="#6C63FF"
              />
              <Text style={styles.detailText}>
                {tripData.totalNoOfDays} Days
              </Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons
                name="account-group"
                size={24}
                color="#6C63FF"
              />
              <Text style={styles.detailText}>{tripData.traveler?.title}</Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="wallet" size={24} color="#6C63FF" />
              <Text style={styles.detailText}>{tripData.budget} Budget</Text>
            </View>
          </View>

          <Text style={styles.warning}>
            Please don't close the app while we prepare your perfect trip
          </Text>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#f8f9ff",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: "outfit-bold",
    color: "#1a1a1a",
    marginBottom: 8,
    textAlign: "center",
  },
  destination: {
    fontSize: 18,
    fontFamily: "outfit-medium",
    color: "#6C63FF",
    marginBottom: 32,
    textAlign: "center",
  },
  progressContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6C63FF",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    fontFamily: "outfit-bold",
    color: "#6C63FF",
    width: 48,
    textAlign: "right",
  },
  statusMessage: {
    fontSize: 16,
    fontFamily: "outfit",
    color: "#666",
    marginBottom: 32,
    textAlign: "center",
  },
  tripDetails: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 32,
  },
  detailItem: {
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    fontFamily: "outfit-medium",
    color: "#666",
  },
  warning: {
    fontSize: 14,
    fontFamily: "outfit",
    color: "#ff6b6b",
    textAlign: "center",
    paddingHorizontal: 20,
  },
};
