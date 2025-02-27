import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { StyleSheet, View } from "react-native";

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Poppins: require("../assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
    PoppinsExtraBold: require("../assets/fonts/Poppins-ExtraBold.ttf")
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="registerSuccess" options={{ headerShown: false }} />
        <Stack.Screen name="newsDetail" options={{ headerShown: false }} />
        <Stack.Screen name="aiLens" options={{ headerShown: false }} />
        <Stack.Screen name="searchResult" options={{ headerShown: false }} />
        <Stack.Screen name="equipmentDetail" options={{ headerShown: false }} />
        <Stack.Screen name="bookmarkList" options={{ headerShown: false }} />
        <Stack.Screen name="test" options={{ headerShown: false }} />
        <Stack.Screen name="Timer" options={{ headerShown: false }} />
        <Stack.Screen name="CalenderScreen" options={{ headerShown: false }} />
        <Stack.Screen name="timerList" options={{ headerShown: false }} />
        <Stack.Screen name="viewWeightHistory" options={{ headerShown: false }} />
        <Stack.Screen name="viewProfile" options={{ headerShown: false }} />
        <Stack.Screen name="errorPage" options={{ headerShown: false }} />
        <Stack.Screen name="notFound" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
