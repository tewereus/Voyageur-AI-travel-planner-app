import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import { SelectTravelersList } from "./../../constants/Options";
import OptionCard from "../../components/CreateTrip/OptionCard";
import { CreateTripContext } from "../../context/CreateTripContext";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function SelectTraveler() {
  const navigation = useNavigation();
  const [selectedTraveler, setSelectedTraveler] = useState();
  const { tripData, setTripData } = useContext(CreateTripContext);
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
      headerTintColor: "#000",
    });
  }, []);

  useEffect(() => {
    setTripData({ ...tripData, traveler: selectedTraveler });
  }, [selectedTraveler]);

  const handleContinue = () => {
    if (!selectedTraveler) {
      // You might want to add some feedback here
      return;
    }
    router.push("./select-dates");
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#ffffff", "#f8f9ff"]} style={styles.gradient}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Who's Travelling?</Text>
            <Text style={styles.subtitle}>
              Choose who will join you on this adventure
            </Text>
          </View>

          <View style={styles.mainContent}>
            <FlatList
              data={SelectTravelersList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => setSelectedTraveler(item)}
                  style={styles.optionCardContainer}
                >
                  <View
                    style={[
                      styles.card,
                      selectedTraveler?.id === item.id && styles.selectedCard,
                    ]}
                  >
                    <View style={styles.cardContent}>
                      <Text style={styles.emoji}>{item.icon}</Text>
                      <View style={styles.textContainer}>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        <Text style={styles.cardDesc}>{item.desc}</Text>
                        <Text style={styles.peopleCount}>
                          <Ionicons name="people" size={16} color="#666" />{" "}
                          {item.people}{" "}
                          {item.people === "1" ? "person" : "people"}
                        </Text>
                      </View>
                      {selectedTraveler?.id === item.id && (
                        <View style={styles.checkmark}>
                          <Ionicons
                            name="checkmark-circle"
                            size={24}
                            color="#6C63FF"
                          />
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          </View>

          <TouchableOpacity
            onPress={handleContinue}
            style={[
              styles.continueButton,
              !selectedTraveler && styles.disabledButton,
            ]}
            disabled={!selectedTraveler}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
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
  content: {
    flex: 1,
    padding: 14,
  },
  header: {
    marginTop: 40,
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
  mainContent: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 20,
  },
  optionCardContainer: {
    marginBottom: 16,
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
  selectedCard: {
    borderWidth: 2,
    borderColor: "#6C63FF",
    backgroundColor: "#f8f9ff",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  emoji: {
    fontSize: 40,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: "outfit-bold",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14,
    fontFamily: "outfit",
    color: "#666",
    marginBottom: 8,
  },
  peopleCount: {
    fontSize: 14,
    fontFamily: "outfit-medium",
    color: "#666",
    flexDirection: "row",
    alignItems: "center",
  },
  checkmark: {
    marginLeft: "auto",
  },
  continueButton: {
    backgroundColor: "#6C63FF",
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "outfit-bold",
    textAlign: "center",
  },
};
