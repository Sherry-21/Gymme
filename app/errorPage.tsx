import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ButtonCustom from "@/components/button";
import { Colors } from "@/constants/Colors";
import ErrorComponent from "@/assets/images/error/error";

const error = require("@/assets/images/error/error.svg");

export default function errorPage() {  
  const back = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.baseColor}>
      <View style={styles.mainLayout}>
        <ErrorComponent width={250} height={250}/>
        <Text style={styles.title}>INTERNAL SERVER ERROR</Text>
        <Text style={styles.subText}>Please try again later</Text>
        <ButtonCustom
          parent={back}
          width={258}
          padding={15}
          text={"Try again"}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  baseColor: {
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontFamily: 'PoppinsBold',
    marginBottom: 2
  },
  subText: {
    fontSize: 16,
    fontFamily: 'Poppins',
    color: Colors.gymme.placeholder,
    marginBottom: 30
  },
  mainLayout: {
    marginHorizontal: 25,
    marginVertical: 40,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loginLogo: {
    resizeMode: "contain",
    width: 250,
    height: 250,
    marginBottom: 15,
    display: 'flex'
  },
});
