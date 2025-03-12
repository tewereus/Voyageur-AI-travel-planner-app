import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Share,
  Animated,
  ScrollView,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../../configs/firebaseConfig";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";

const { width } = Dimensions.get("window");

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser({
          fullName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.replace("/auth/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message:
          "Check out Voyageur - Your AI-powered travel companion! [App Link]",
      });
    } catch (error) {
      console.error("Error sharing the app:", error);
    }
  };

  const ProfileOption = ({
    icon,
    title,
    onPress,
    color = Colors.raw.primary,
  }) => (
    <TouchableOpacity style={styles.optionButton} onPress={onPress}>
      <View style={[styles.optionIcon, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.optionText}>{title}</Text>
      <Ionicons name="chevron-forward" size={20} color={Colors.raw.tertiary} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <LinearGradient
          colors={[Colors.raw.primary, Colors.raw.secondary]}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            {user && (
              <>
                <Image
                  source={
                    user.photoURL
                      ? { uri: user.photoURL }
                      : require("./../../assets/images/pl.jpg")
                  }
                  style={styles.userImage}
                />
                <Text style={styles.userName}>{user.fullName}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
              </>
            )}
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Trips</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4</Text>
              <Text style={styles.statLabel}>Countries</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>32</Text>
              <Text style={styles.statLabel}>Places</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Settings</Text>
            <ProfileOption
              icon="notifications-outline"
              title="Notifications"
              onPress={() => {}}
            />
            <ProfileOption
              icon="lock-closed-outline"
              title="Privacy"
              onPress={() => {}}
            />
            <ProfileOption
              icon="share-outline"
              title="Share App"
              onPress={handleShare}
              color={Colors.raw.accent}
            />
            <ProfileOption
              icon="log-out-outline"
              title="Sign Out"
              onPress={handleSignOut}
              color={Colors.raw.error}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <ProfileOption
              icon="information-circle-outline"
              title="Help & Support"
              onPress={() => {}}
            />
            <ProfileOption
              icon="star-outline"
              title="Rate Us"
              onPress={() => {}}
            />
          </View>

          <Text style={styles.footer}>Voyageur v1.0.0</Text>
          <Text style={styles.footerCredit}>
            Developed by Tewolde Gebreyesus
          </Text>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.raw.background,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: "center",
  },
  userImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.2)",
  },
  userName: {
    fontSize: 24,
    fontFamily: "outfit-bold",
    color: "#fff",
    marginTop: 15,
  },
  userEmail: {
    fontSize: 16,
    fontFamily: "outfit",
    color: "rgba(255,255,255,0.8)",
    marginTop: 5,
  },
  content: {
    padding: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginTop: -30,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  statNumber: {
    fontSize: 24,
    fontFamily: "outfit-bold",
    color: Colors.raw.primary,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: "outfit",
    color: Colors.raw.tertiary,
    marginTop: 5,
  },
  section: {
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    color: Colors.raw.primary,
    marginBottom: 15,
    marginLeft: 5,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: "outfit-medium",
    color: Colors.raw.primary,
  },
  footer: {
    fontFamily: "outfit-medium",
    fontSize: 14,
    textAlign: "center",
    marginTop: 30,
    color: Colors.raw.tertiary,
  },
  footerCredit: {
    fontFamily: "outfit",
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
    color: Colors.raw.tertiary,
    marginBottom: 20,
  },
});

export default Profile;
