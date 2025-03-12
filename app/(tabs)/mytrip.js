import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import StartNewTripCard from "../../components/MyTrips/StartNewTripCard";
import { auth, db } from "./../../configs/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import UserTripList from "./../../components/MyTrips/UserTripList";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function MyTrip() {
  const [userTrips, setUserTrips] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
  });
  const user = auth.currentUser;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    user && GetMyTrips();
  }, [user]);

  const GetMyTrips = async () => {
    setLoading(true);
    setUserTrips([]);
    const q = query(
      collection(db, "UserTrips"),
      where("userEmail", "==", user?.email)
    );
    const querySnapshot = await getDocs(q);

    const trips = [];
    querySnapshot.forEach((doc) => {
      trips.push(doc.data());
    });

    // Calculate stats
    const now = new Date();
    const upcoming = trips.filter(
      (trip) => new Date(JSON.parse(trip.tripData).startDate) > now
    ).length;
    const completed = trips.filter(
      (trip) => new Date(JSON.parse(trip.tripData).endDate) < now
    ).length;

    setStats({
      total: trips.length,
      upcoming,
      completed,
    });

    setUserTrips(trips);
    setLoading(false);
  };

  const handleAddNewTrip = () => {
    router.push("/create-trip/search-place");
  };

  const StatCard = ({ icon, title, value, color }) => (
    <View style={styles.statCard}>
      <View
        style={[styles.statIconContainer, { backgroundColor: `${color}15` }]}
      >
        <MaterialCommunityIcons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={["#6C63FF", "#5A52E5"]}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.userName}>Tewolde</Text>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddNewTrip}
            >
              <MaterialCommunityIcons name="plus" size={24} color="#6C63FF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.statsContainer}>
            <StatCard
              icon="airplane"
              title="Total Trips"
              value={stats.total}
              color="#6C63FF"
            />
            <StatCard
              icon="calendar-clock"
              title="Upcoming"
              value={stats.upcoming}
              color="#00C853"
            />
            <StatCard
              icon="check-circle"
              title="Completed"
              value={stats.completed}
              color="#FF6B6B"
            />
          </View>

          <View style={styles.tripsSection}>
            <Text style={styles.sectionTitle}>Your Trips</Text>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6C63FF" />
              </View>
            ) : userTrips?.length === 0 ? (
              <StartNewTripCard />
            ) : (
              <UserTripList userTrips={userTrips} />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#F8F9FF",
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  welcomeText: {
    fontSize: 16,
    color: "#ffffff90",
    fontFamily: "outfit-medium",
  },
  userName: {
    fontSize: 24,
    color: "#fff",
    fontFamily: "outfit-bold",
    textTransform: "capitalize",
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    flex: 1,
    marginTop: -20,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    width: "31%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontFamily: "outfit-bold",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    fontFamily: "outfit-medium",
    color: "#666",
    textAlign: "center",
  },
  tripsSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "outfit-bold",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
};
