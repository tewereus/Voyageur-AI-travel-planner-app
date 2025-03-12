import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ToastAndroid,
  Animated,
} from "react-native";
import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigation, useRouter } from "expo-router";
import { SelectBudgetOptions } from "../../constants/Options";
import OptionCard from "../../components/CreateTrip/OptionCard";
import { CreateTripContext } from "../../context/CreateTripContext";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function SelectBudget() {
  const navigation = useNavigation();
  const [selectedOption, setSelectedOption] = useState();
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

  useEffect(() => {
    selectedOption &&
      setTripData({
        ...tripData,
        budget: selectedOption?.title,
      });
  }, [selectedOption]);

  const getBudgetTips = (budgetType) => {
    const tips = {
      Cheap: [
        "Look for free walking tours",
        "Stay in hostels or budget hotels",
        "Use public transportation",
        "Cook your own meals when possible",
      ],
      Moderate: [
        "Mix of budget and luxury experiences",
        "Mid-range hotels and restaurants",
        "Occasional splurge activities",
        "Balance between comfort and cost",
      ],
      Luxuary: [
        "5-star hotels and resorts",
        "Fine dining experiences",
        "Private tours and guides",
        "Premium transportation options",
      ],
    };
    return tips[budgetType] || [];
  };

  const getEstimatedCost = (budgetType) => {
    const costs = {
      Cheap: "$30-50 per day",
      Moderate: "$100-200 per day",
      Luxuary: "$300+ per day",
    };
    return costs[budgetType];
  };

  const onClickContinue = () => {
    if (!selectedOption) {
      ToastAndroid.show("Please select a budget option", ToastAndroid.LONG);
      return;
    }
    router.push("/create-trip/review-trip");
  };

  const renderBudgetCard = ({ item }) => (
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
      <TouchableOpacity
        onPress={() => setSelectedOption(item)}
        style={styles.budgetCardContainer}
      >
        <View
          style={[
            styles.budgetCard,
            selectedOption?.id === item.id && styles.selectedBudgetCard,
          ]}
        >
          <View style={styles.budgetHeader}>
            <Text style={styles.budgetIcon}>{item.icon}</Text>
            <View>
              <Text style={styles.budgetTitle}>{item.title}</Text>
              <Text style={styles.budgetDesc}>{item.desc}</Text>
            </View>
          </View>

          <View style={styles.budgetDetails}>
            <Text style={styles.estimatedCost}>
              Estimated Cost: {getEstimatedCost(item.title)}
            </Text>
            <View style={styles.tipsContainer}>
              {getBudgetTips(item.title).map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#6C63FF" />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <LinearGradient colors={["#ffffff", "#f8f9ff"]} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Set Your Budget</Text>
          <Text style={styles.subtitle}>
            Choose your preferred spending level for a comfortable journey
          </Text>
        </View>

        <FlatList
          data={SelectBudgetOptions}
          renderItem={renderBudgetCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.budgetList}
          showsVerticalScrollIndicator={false}
        />

        <TouchableOpacity
          onPress={onClickContinue}
          style={[
            styles.continueButton,
            !selectedOption && styles.disabledButton,
          ]}
          disabled={!selectedOption}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = {
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
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
  budgetList: {
    paddingBottom: 20,
  },
  budgetCardContainer: {
    marginBottom: 20,
  },
  budgetCard: {
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
  selectedBudgetCard: {
    borderWidth: 2,
    borderColor: "#6C63FF",
    backgroundColor: "#f8f9ff",
  },
  budgetHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  budgetIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  budgetTitle: {
    fontSize: 24,
    fontFamily: "outfit-bold",
    color: "#1a1a1a",
  },
  budgetDesc: {
    fontSize: 14,
    fontFamily: "outfit",
    color: "#666",
    marginTop: 4,
  },
  budgetDetails: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 15,
    marginTop: 15,
  },
  estimatedCost: {
    fontSize: 16,
    fontFamily: "outfit-medium",
    color: "#6C63FF",
    marginBottom: 10,
  },
  tipsContainer: {
    gap: 8,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tipText: {
    fontSize: 14,
    fontFamily: "outfit",
    color: "#666",
  },
  continueButton: {
    backgroundColor: "#6C63FF",
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 20,
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
