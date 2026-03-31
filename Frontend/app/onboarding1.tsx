
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { height } = Dimensions.get("window");

export default function Onboarding1() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      
    
      <View style={styles.animationContainer}>
        <LottieView
          source={require("../assets/animations/sparkles.json")} // ✅ fixed path
          autoPlay
          loop
          style={styles.animation}
        />
      </View>

      
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          Detect objects using AI. 🤖
        </Text>
      </View>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.navigate('onboarding2' as never)}
      >
        <Text style={styles.nextText}> Next</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
    justifyContent: "center",
    alignItems: "center",
  },

  animationContainer: {
    position: "absolute",
    top: height * 0.18,
  },

  animation: {
    width: 450,
    height: 450,
    opacity: 0.7,
  },

  textContainer: {
    position: "absolute",
    bottom: 150,
    paddingHorizontal: 30,
  },

  text: {
    color: "#FFFFFF",
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Poppins-bold",
    fontWeight: "500",
    textShadowColor: '#9966CC', // purple glow
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 10,
  },

  nextButton: {
    position: "absolute",
    bottom: 40,
    right: 25,
    backgroundColor: "#0A0A0A",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 30,
  },

  nextText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});