import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import React, { useContext, useEffect, useRef } from "react";
import { useNavigation, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CreateTripContext } from "../../context/CreateTripContext";
import moment from "moment";
import { LinearGradient } from "expo-linear-gradient";

export default function ReviewTrip() {
  const navigation = useNavigation();
  const { tripData, setTripData } = useContext(CreateTripContext);
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
      headerTintColor: "#000",
    });

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const getTripHighlights = () => {
    const highlights = [
      {
        title: "Weather",
        icon: "☀️",
        desc: "Perfect time to visit with moderate temperatures",
      },
      {
        title: "Peak Season",
        icon: "📊",
        desc:
          tripData?.budget === "Cheap"
            ? "Off-peak season for better deals"
            : "Peak season with best experiences",
      },
      {
        title: "Local Events",
        icon: "🎉",
        desc: "Cultural festivals and events during your stay",
      },
    ];
    return highlights;
  };

  return (
    <LinearGradient colors={["#ffffff", "#f8f9ff"]} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          }}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Review Your Trip</Text>
            <Text style={styles.subtitle}>
              We've crafted your perfect itinerary. Please review the details
              below.
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardSection}>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>📍</Text>
              </View>
              <View style={styles.detailsContainer}>
                <Text style={styles.label}>Destination</Text>
                <Text style={styles.value}>{tripData.locationInfo?.name}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.cardSection}>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>📅</Text>
              </View>
              <View style={styles.detailsContainer}>
                <Text style={styles.label}>Travel Dates</Text>
                <Text style={styles.value}>
                  {moment(tripData?.startDate).format("DD MMM")} -{" "}
                  {moment(tripData?.endDate).format("DD MMM, YYYY")}
                </Text>
                <Text style={styles.duration}>
                  Duration: {tripData?.totalNoOfDays} days
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.cardSection}>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>👥</Text>
              </View>
              <View style={styles.detailsContainer}>
                <Text style={styles.label}>Travelers</Text>
                <Text style={styles.value}>{tripData?.traveler?.title}</Text>
                <Text style={styles.subvalue}>{tripData?.traveler?.desc}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.cardSection}>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>💰</Text>
              </View>
              <View style={styles.detailsContainer}>
                <Text style={styles.label}>Budget Category</Text>
                <Text style={styles.value}>{tripData?.budget}</Text>
                <Text style={styles.subvalue}>
                  {tripData?.budget === "Cheap"
                    ? "Budget-friendly options"
                    : tripData?.budget === "Moderate"
                    ? "Mid-range comfort"
                    : "Luxury experience"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.highlightsContainer}>
            <Text style={styles.highlightsTitle}>Trip Highlights</Text>
            {getTripHighlights().map((highlight, index) => (
              <View key={index} style={styles.highlightCard}>
                <Text style={styles.highlightIcon}>{highlight.icon}</Text>
                <View>
                  <Text style={styles.highlightTitle}>{highlight.title}</Text>
                  <Text style={styles.highlightDesc}>{highlight.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity
            onPress={() => router.replace("/create-trip/generate-trip")}
            style={styles.button}
          >
            <LinearGradient
              colors={["#6C63FF", "#5A52E5"]}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>Build My Trip</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 80,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontFamily: "outfit-bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "outfit",
    color: "#666",
    lineHeight: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "#f8f9ff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  icon: {
    fontSize: 24,
  },
  detailsContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontFamily: "outfit",
    color: "#666",
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    color: "#1a1a1a",
  },
  subvalue: {
    fontSize: 14,
    fontFamily: "outfit",
    color: "#666",
    marginTop: 2,
  },
  duration: {
    fontSize: 14,
    fontFamily: "outfit-medium",
    color: "#6C63FF",
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 8,
  },
  highlightsContainer: {
    marginTop: 24,
    marginBottom: 24,
  },
  highlightsTitle: {
    fontSize: 20,
    fontFamily: "outfit-bold",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  highlightCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  highlightIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  highlightTitle: {
    fontSize: 16,
    fontFamily: "outfit-bold",
    color: "#1a1a1a",
  },
  highlightDesc: {
    fontSize: 14,
    fontFamily: "outfit",
    color: "#666",
    marginTop: 2,
  },
  button: {
    marginBottom: 24,
  },
  gradient: {
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "outfit-bold",
    textAlign: "center",
  },
};
