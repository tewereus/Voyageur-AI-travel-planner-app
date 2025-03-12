import {
  View,
  Text,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import CalendarPicker from "react-native-calendar-picker";
import moment from "moment";
import { CreateTripContext } from "../../context/CreateTripContext";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function SelectDates() {
  const navigation = useNavigation();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
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

  const onDateChange = (date, type) => {
    if (type == "START_DATE") {
      setStartDate(moment(date));
    } else {
      setEndDate(moment(date));
    }
  };

  const getTripDuration = () => {
    if (!startDate || !endDate) return null;
    const days = endDate.diff(startDate, "days") + 1;
    const nights = days - 1;
    return { days, nights };
  };

  const getSeasonInfo = () => {
    if (!startDate) return null;
    const month = startDate.month();
    const seasons = {
      winter: [11, 0, 1],
      spring: [2, 3, 4],
      summer: [5, 6, 7],
      autumn: [8, 9, 10],
    };

    for (const [season, months] of Object.entries(seasons)) {
      if (months.includes(month)) {
        return {
          season,
          icon:
            season === "winter"
              ? "❄️"
              : season === "spring"
              ? "🌸"
              : season === "summer"
              ? "☀️"
              : "🍂",
          tip:
            season === "winter"
              ? "Pack warm clothes and check for winter activities!"
              : season === "spring"
              ? "Great time for sightseeing and outdoor activities!"
              : season === "summer"
              ? "Remember sunscreen and plan for outdoor adventures!"
              : "Perfect weather for photography and nature walks!",
        };
      }
    }
  };

  const OnDateSelectionContinue = () => {
    if (!startDate || !endDate) {
      ToastAndroid.show("Please Select Dates", ToastAndroid.SHORT);
      return;
    }
    const totalNoOfDays = endDate.diff(startDate, "days");
    setTripData({
      ...tripData,
      startDate: startDate,
      endDate: endDate,
      totalNoOfDays: totalNoOfDays + 1,
    });
    router.push("/create-trip/select-budget");
  };

  const duration = getTripDuration();
  const seasonInfo = getSeasonInfo();

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={["#ffffff", "#f8f9ff"]} style={styles.gradient}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Choose Your Dates</Text>
            <Text style={styles.subtitle}>
              Select the perfect timing for your adventure
            </Text>
          </View>

          <View style={styles.calendarContainer}>
            <CalendarPicker
              onDateChange={onDateChange}
              allowRangeSelection={true}
              minDate={new Date()}
              maxRangeDuration={10}
              selectedRangeStyle={{
                backgroundColor: "#6C63FF",
              }}
              selectedDayTextStyle={{
                color: "#fff",
              }}
              todayBackgroundColor="#f3f3f3"
              todayTextStyle={{
                color: "#6C63FF",
              }}
              textStyle={{
                fontFamily: "outfit",
                color: "#333",
              }}
            />
          </View>

          {duration && (
            <View style={styles.durationCard}>
              <View style={styles.durationItem}>
                <Ionicons name="calendar" size={24} color="#6C63FF" />
                <Text style={styles.durationText}>{duration.days} days</Text>
              </View>
              <View style={styles.durationItem}>
                <Ionicons name="moon" size={24} color="#6C63FF" />
                <Text style={styles.durationText}>
                  {duration.nights} nights
                </Text>
              </View>
            </View>
          )}

          {seasonInfo && (
            <View style={styles.seasonCard}>
              <View style={styles.seasonHeader}>
                <Text style={styles.seasonTitle}>
                  {seasonInfo.icon}{" "}
                  {seasonInfo.season.charAt(0).toUpperCase() +
                    seasonInfo.season.slice(1)}{" "}
                  Season
                </Text>
              </View>
              <Text style={styles.seasonTip}>{seasonInfo.tip}</Text>
            </View>
          )}

          <TouchableOpacity
            onPress={OnDateSelectionContinue}
            style={[
              styles.continueButton,
              (!startDate || !endDate) && styles.disabledButton,
            ]}
            disabled={!startDate || !endDate}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  gradient: {
    flex: 1,
    minHeight: "100%",
  },
  content: {
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
  calendarContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  durationCard: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  durationItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  durationText: {
    fontSize: 16,
    fontFamily: "outfit-medium",
    color: "#333",
  },
  seasonCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  seasonHeader: {
    marginBottom: 10,
  },
  seasonTitle: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    color: "#333",
  },
  seasonTip: {
    fontSize: 14,
    fontFamily: "outfit",
    color: "#666",
    lineHeight: 20,
  },
  continueButton: {
    backgroundColor: "#6C63FF",
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 24,
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
