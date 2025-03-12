import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from "react-native";
import axios from "axios";
import * as WebBrowser from "expo-web-browser";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.7;

const categories = [
  { id: 1, name: "Popular", icon: "star" },
  { id: 2, name: "Nature", icon: "leaf" },
  { id: 3, name: "Cities", icon: "business" },
  { id: 4, name: "Culture", icon: "color-palette" },
  { id: 5, name: "Adventure", icon: "compass" },
];

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
    return response.data.hits[0]?.largeImageURL;
  } catch (error) {
    console.error("Error fetching image from Pixabay:", error);
    return null;
  }
};

const fetchPOIFromMapTiler = async (bbox, countryName) => {
  const apiKey = process.env.REACT_MAPTILER_API_KEY;
  try {
    const response = await axios.get(
      "https://api.maptiler.com/geocoding/poi.json",
      {
        params: {
          key: apiKey,
          bbox: bbox,
          limit: 1,
        },
      }
    );
    const feature = response.data.features[0];
    if (feature) {
      return {
        name: feature.properties.name,
        brief: feature.properties.description || "A popular place to visit.",
        location: `${feature.geometry.coordinates[1]},${feature.geometry.coordinates[0]}`,
        country: countryName,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching POI from MapTiler:", error);
    return null;
  }
};

const fetchPOIsFromContinents = async () => {
  const bboxes = {
    Africa: ["-18.679253,34.559989,51.414942,37.340738", "Africa"],
    Asia: ["24.396308,54.229087,153.986672,81.137995", "Asia"],
    Europe: ["-31.464799,34.815924,39.477907,71.185476", "Europe"],
    NorthAmerica: [
      "-168.000123,5.499550,-52.233040,83.162102",
      "North America",
    ],
    SouthAmerica: [
      "-93.167592,-56.526054,-28.650543,12.524147",
      "South America",
    ],
    Australia: ["112.921114,-54.750690,159.278992,-10.062805", "Australia"],
    Antarctica: ["-180.000000,-90.000000,180.000000,-60.000000", "Antarctica"],
  };

  const placesPromises = Object.keys(bboxes).map(async (continent) => {
    const place = await fetchPOIFromMapTiler(
      bboxes[continent][0],
      bboxes[continent][1]
    );
    if (place) {
      place.continent = continent;
      const imageUrl = await fetchImage(place.name);
      place.image = imageUrl;
    }
    return place;
  });

  return Promise.all(placesPromises).then((places) =>
    places.filter((place) => place !== null)
  );
};

const Discover = () => {
  const [trendingPlaces, setTrendingPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedPlace, setSearchedPlace] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Popular");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTrendingPlaces();
  }, []);

  const loadTrendingPlaces = async () => {
    try {
      const places = await fetchPOIsFromContinents();
      setTrendingPlaces(places);
      setLoading(false);
    } catch (error) {
      console.error("Error loading trending places:", error);
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadTrendingPlaces().then(() => setRefreshing(false));
  }, []);

  const searchNewPlace = async () => {
    if (!searchQuery.trim()) return;

    try {
      const imageUrl = await fetchImage(searchQuery);
      if (imageUrl) {
        setSearchedPlace({
          name: searchQuery,
          image: imageUrl,
          country: searchQuery,
          brief: "A place you searched for.",
          continent: "Unknown",
          rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3-5
          reviews: Math.floor(Math.random() * 1000) + 100, // Random review count
        });
      } else {
        setSearchedPlace(null);
      }
    } catch (error) {
      console.error("Error searching new place:", error);
    }
  };

  const renderCategoryItem = (category) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryItem,
        selectedCategory === category.name && styles.categoryItemSelected,
      ]}
      onPress={() => setSelectedCategory(category.name)}
    >
      <Ionicons
        name={category.icon}
        size={20}
        color={selectedCategory === category.name ? "#fff" : "#6C63FF"}
      />
      <Text
        style={[
          styles.categoryText,
          selectedCategory === category.name && styles.categoryTextSelected,
        ]}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  const renderPlaceCard = (place, index) => (
    <TouchableOpacity
      key={`${place.name}-${index}`}
      style={styles.placeCard}
      onPress={() => handleCardPress(place.name)}
    >
      <Image
        source={
          place.image
            ? { uri: `${place.image}?${new Date().getTime()}` }
            : require("./../../assets/images/pl.jpg")
        }
        style={styles.placeImage}
      />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={styles.cardOverlay}
      >
        <View style={styles.cardContent}>
          <Text style={styles.placeName}>{place.name}</Text>
          <Text style={styles.placeLocation}>
            <Ionicons name="location" size={14} color="#fff" /> {place.country}
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>
              {(Math.random() * 2 + 3).toFixed(1)}
            </Text>
            <Text style={styles.reviews}>
              ({Math.floor(Math.random() * 1000) + 100} reviews)
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#6C63FF", "#5A52E5"]}
        style={styles.headerGradient}
      >
        <Text style={styles.headerTitle}>Discover</Text>
        <Text style={styles.headerSubtitle}>Explore the world's wonders</Text>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search destinations..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={searchNewPlace}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery("");
                setSearchedPlace(null);
              }}
            >
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.categoriesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          >
            {categories.map(renderCategoryItem)}
          </ScrollView>
        </View>

        {searchedPlace && (
          <View style={styles.searchResultContainer}>
            <Text style={styles.sectionTitle}>Search Result</Text>
            {renderPlaceCard(searchedPlace, "search")}
          </View>
        )}

        <View style={styles.trendingContainer}>
          <Text style={styles.sectionTitle}>Trending Places</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trendingList}
          >
            {trendingPlaces.map(renderPlaceCard)}
          </ScrollView>
        </View>

        <View style={styles.popularContainer}>
          <Text style={styles.sectionTitle}>Popular Destinations</Text>
          <View style={styles.popularGrid}>
            {trendingPlaces.slice(0, 4).map((place, index) => (
              <TouchableOpacity
                key={`popular-${index}`}
                style={styles.popularCard}
                onPress={() => handleCardPress(place.name)}
              >
                <Image
                  source={
                    place.image
                      ? { uri: place.image }
                      : require("./../../assets/images/pl.jpg")
                  }
                  style={styles.popularImage}
                />
                <BlurView intensity={80} style={styles.popularOverlay}>
                  <Text style={styles.popularName}>{place.name}</Text>
                </BlurView>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FF",
  },
  headerGradient: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#ffffff90",
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  categoriesContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryItemSelected: {
    backgroundColor: "#6C63FF",
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#6C63FF",
    fontWeight: "600",
  },
  categoryTextSelected: {
    color: "#fff",
  },
  trendingContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  trendingList: {
    paddingRight: 20,
  },
  placeCard: {
    width: CARD_WIDTH,
    height: 250,
    marginRight: 15,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  placeImage: {
    width: "100%",
    height: "100%",
  },
  cardOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    padding: 15,
    justifyContent: "flex-end",
  },
  cardContent: {
    gap: 5,
  },
  placeName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  placeLocation: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  rating: {
    color: "#fff",
    marginLeft: 5,
    fontWeight: "bold",
  },
  reviews: {
    color: "#fff",
    opacity: 0.8,
    marginLeft: 5,
  },
  popularContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  popularGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  popularCard: {
    width: "48%",
    height: 150,
    marginBottom: 15,
    borderRadius: 15,
    overflow: "hidden",
  },
  popularImage: {
    width: "100%",
    height: "100%",
  },
  popularOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  popularName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchResultContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
});

export default Discover;
