import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import { CreateTripContext } from "./../../context/CreateTripContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const MAPTILER_API_KEY = process.env.REACT_MAPTILER_API_KEY;

export default function SearchPlace() {
  const navigation = useNavigation();
  const { tripData, setTripData } = useContext(CreateTripContext);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
      headerTintColor: "#000",
    });
  }, []);

  const searchPlaces = async (query) => {
    if (query.length > 2) {
      try {
        const response = await fetch(
          `https://api.maptiler.com/geocoding/${encodeURIComponent(
            query
          )}.json?key=${MAPTILER_API_KEY}`
        );
        const text = await response.text();
        try {
          const data = JSON.parse(text);
          setSearchResults(data.features);
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
        }
      } catch (error) {
        console.error("Error searching places:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handlePlaceSelect = (place) => {
    setTripData({
      locationInfo: {
        name: place.place_name,
        coordinates: {
          lat: place.center[1],
          lng: place.center[0],
        },
        photoRef: null,
        url: null,
      },
    });
    router.push("/create-trip/select-traveler");
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#ffffff", "#f8f9ff"]} style={styles.gradient}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Where to?</Text>
            <Text style={styles.subtitle}>
              Search for cities, regions, or countries you'd like to explore
            </Text>
          </View>

          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Ionicons
                name="search"
                size={24}
                color="#666"
                style={styles.searchIcon}
              />
              <TextInput
                placeholder="Search destinations..."
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  searchPlaces(text);
                }}
                style={styles.searchInput}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  style={styles.clearButton}
                >
                  <Ionicons name="close-circle" size={20} color="#666" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {searchResults.length === 0 && searchQuery.length === 0 && (
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsTitle}>Popular Destinations</Text>
              <View style={styles.popularPlaces}>
                {["Paris", "Tokyo", "New York", "London", "Rome", "Sydney"].map(
                  (city) => (
                    <TouchableOpacity
                      key={city}
                      style={styles.popularPlace}
                      onPress={() => {
                        setSearchQuery(city);
                        searchPlaces(city);
                      }}
                    >
                      <Text style={styles.popularPlaceText}>{city}</Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>
          )}

          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            style={styles.resultsList}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handlePlaceSelect(item)}
                style={styles.resultItem}
              >
                <View style={styles.resultContent}>
                  <Ionicons name="location" size={24} color="#6C63FF" />
                  <View style={styles.resultTextContainer}>
                    <Text style={styles.placeName}>
                      {item.place_name.split(",")[0]}
                    </Text>
                    <Text style={styles.placeDetail}>
                      {item.place_name.split(",").slice(1).join(",").trim()}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  gradient: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    marginTop: 40,
    marginBottom: 24,
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
  searchContainer: {
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "outfit",
    color: "#1a1a1a",
  },
  clearButton: {
    padding: 4,
  },
  suggestionsContainer: {
    marginTop: 20,
  },
  suggestionsTitle: {
    fontSize: 18,
    fontFamily: "outfit-medium",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  popularPlaces: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  popularPlace: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  popularPlaceText: {
    fontSize: 14,
    fontFamily: "outfit-medium",
    color: "#666",
  },
  resultsList: {
    marginTop: 20,
  },
  resultItem: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  resultTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  placeName: {
    fontSize: 16,
    fontFamily: "outfit-medium",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  placeDetail: {
    fontSize: 14,
    fontFamily: "outfit",
    color: "#666",
  },
};
