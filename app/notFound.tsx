import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ButtonCustom from "@/components/button";
import { Colors } from "@/constants/Colors";
import NotFound from "@/assets/images/error/notFound";

const error = require("@/assets/images/error/notFound.svg");

export default function notFound() {  
  const back = () => {
    router.push("/search");
  };

  return (
    <SafeAreaView style={styles.baseColor}>
      <View style={styles.mainLayout}>
        <NotFound width={300} height={300}/>

        <Text style={styles.title}>Data not found</Text>
        <Text style={styles.subText}>No such data found in the database</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
    marginBottom: 2, 
    marginTop: 5
  },
  subText: {
    fontSize: 16,
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
