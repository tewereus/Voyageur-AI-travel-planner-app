import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import moment from "moment";
import axios from "axios";
import UserTripCard from "./UserTripCard";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";

const fetchImage = async (locationName) => {
  const apiKey = process.env.REACT_PIXABAY_API_KEY; // Pixabay API key
  try {
    const response = await axios.get("https://pixabay.com/api/", {
      params: {
        key: apiKey,
        q: locationName,
        image_type: "photo",
      },
    });
    return response.data.hits[0].largeImageURL;
  } catch (error) {
    console.error("Error fetching image from Pixabay:", error);
    throw error; // Throw the error to handle it in the caller function
  }
};

export default function UserTripList({ userTrips }) {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log("Rendering UserTripList with userTrips:", userTrips);
    if (userTrips && userTrips.length > 0) {
      const firstTripLocation = JSON.parse(userTrips[0].tripData).locationInfo
        .name;
      fetchImage(firstTripLocation)
        .then((url) => {
          setImageUrl(url);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching image:", error);
          setLoading(false);
        });
    }
  }, [userTrips]);

  if (!userTrips || userTrips.length === 0) {
    return <Text>No trips available</Text>;
  }

  // Parse the tripData JSON string for the first trip
  const firstTrip = {
    ...userTrips[0],
    tripData: JSON.parse(userTrips[0].tripData),
  };

  // Parse the tripData JSON string for the rest of the trips
  const otherTrips = userTrips.slice(1).map((trip) => ({
    ...trip,
    tripData: JSON.parse(trip.tripData),
  }));

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.bigTripCard}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.raw.accent} />
            </View>
          ) : (
            <View style={styles.imageContainer}>
              <Image
                source={
                  imageUrl
                    ? { uri: imageUrl }
                    : require("./../../assets/images/pl.jpg")
                }
                style={styles.image}
              />
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.7)"]}
                style={styles.gradient}
              />
            </View>
          )}
          <View style={styles.infoContainer}>
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={24} color={Colors.raw.accent} />
              <Text style={styles.location}>
                {firstTrip.tripData.locationInfo.name}
              </Text>
            </View>

            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={Colors.raw.tertiary}
                />
                <Text style={styles.dates}>
                  {moment(firstTrip.startDate).format("MMM Do")} -{" "}
                  {moment(firstTrip.endDate).format("MMM Do, YYYY")}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Ionicons
                  name="people-outline"
                  size={20}
                  color={Colors.raw.tertiary}
                />
                <Text style={styles.travelers}>
                  {firstTrip.tripData.traveler.title}
                </Text>
              </View>
            </View>

            <Text style={styles.description}>
              {firstTrip.tripData.traveler.desc}
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                router.push({
                  pathname: "/trip-detail",
                  params: { trip: JSON.stringify(userTrips[0]) },
                })
              }
            >
              <Text style={styles.buttonText}>View Trip Details</Text>
              <Ionicons
                name="arrow-forward"
                size={20}
                color={Colors.raw.white}
              />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Other Trips</Text>

        <View style={styles.otherTripsContainer}>
          {otherTrips.map((trip, index) => (
            <UserTripCard trip={trip} key={index} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 16,
    backgroundColor: Colors.raw.background,
  },
  bigTripCard: {
    backgroundColor: Colors.raw.white,
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: Colors.raw.cardShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  imageContainer: {
    position: "relative",
    height: 150,
  },
  loadingContainer: {
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.raw.background,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
  },
  infoContainer: {
    padding: 20,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  location: {
    fontSize: 24,
    fontFamily: "outfit-bold",
    color: Colors.raw.primary,
    marginLeft: 8,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dates: {
    fontSize: 14,
    fontFamily: "outfit-medium",
    color: Colors.raw.tertiary,
  },
  travelers: {
    fontSize: 14,
    fontFamily: "outfit-medium",
    color: Colors.raw.tertiary,
  },
  description: {
    fontSize: 16,
    fontFamily: "outfit",
    color: Colors.raw.secondary,
    marginBottom: 20,
    lineHeight: 24,
  },
  button: {
    backgroundColor: Colors.raw.accent,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: {
    color: Colors.raw.white,
    fontSize: 16,
    fontFamily: "outfit-bold",
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "outfit-bold",
    color: Colors.raw.primary,
    marginBottom: 16,
    marginTop: 8,
  },
  otherTripsContainer: {
    gap: 16,
  },
});
