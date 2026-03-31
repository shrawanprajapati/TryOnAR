import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";


const { height } = Dimensions.get("window");

export default function Onboarding2() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>

    
      <View style={styles.animationWrapper}>

        
        <LottieView
          source={require("../assets/animations/onboarding2_eye.json")}
          autoPlay
          loop
          style={styles.eye}
        />

        
        <LottieView
          source={require("../assets/animations/hud_circle.json")}
          autoPlay
          loop
          speed={0.6}
          style={styles.hud}
        />

      </View>

      
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          See it before you wear it. 👓
        </Text>
      </View>

      
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.navigate("login")}
      >
        <Text style={styles.nextText}>Next</Text>
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

  glow: {
    position: "absolute",
    width: 350,
    height: 350,
    borderRadius: 200,
    alignSelf: "center",
    opacity: 0.25,
  },

  animationWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },

  eye: {
    width: 220,
    height: 220,
    opacity: 0.7,
  },

  hud: {
    position: "absolute",
    width: 300,
    height: 300,
    opacity: 0.9,
  },

  textContainer: {
    position: "absolute",
    bottom: height * 0.18,
    paddingHorizontal: 30,
  },

  text: {
    color: "#FFFFFF",
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Poppins-bold",
    fontWeight: "500",

    
    textShadowColor:  '#9966CC',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
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