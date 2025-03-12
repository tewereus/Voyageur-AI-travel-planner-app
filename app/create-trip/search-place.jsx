import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "expo-router";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const SearchPlace = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Search",
      headerTransparent: true,
    });
  }, []);
  return (
    <View className="p-12" style={{ padding: 25, paddingTop: 75 }}>
      <GooglePlacesAutocomplete
        placeholder="search"
        onPress={(data, details = null) => {
          console.log(data, details);
        }}
        query={{
          key: "Api",
          language: "en",
        }}
      />
    </View>
  );
};

export default SearchPlace;

const styles = StyleSheet.create({});
