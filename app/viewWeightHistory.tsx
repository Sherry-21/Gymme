import React, { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Items from "ajv/lib/vocabularies/applicator/items";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { getWeight } from "./API/weightApi";

const backButton = () => {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.push("/other");
  }
};

const updateTime = (user_weight_time:any) => {
    let date = new Date(user_weight_time)
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Jakarta',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    const formatter = new Intl.DateTimeFormat('en-GB', options);
    const formattedDate = formatter.format(date);

    return formattedDate
}

const viewWeightHistory = () => {
  const [historyData, SetHistoryData]: any = useState([]);

  useEffect(() => {
    const fetchWeightHistory = async () => {
      try {
        const response = await getWeight();
        console.log(response);
        let row = response.data.rows;        
        const updatedRows = row.map((item:any) => ({
          ...item,
          user_weight_time: updateTime(item.user_weight_time),
        }));
        console.log(updatedRows)
        SetHistoryData((prev: any) => [...prev, ...updatedRows]);
        console.log(historyData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchWeightHistory();

    console.log(historyData);
  }, []);

  return (
    <ScrollView style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Pressable style={styles.backgroundArrow} onPress={() => backButton()}>
          <MaterialIcons name="arrow-back-ios-new" size={24} color="#fff" />
        </Pressable>

        <Text style={styles.headerTitle}>Weight History</Text>
      </View>

      {historyData.map((item: any, index: number) => (
        <Pressable key={index}>
          <View style={styles.entryContainer}>
            <Text style={styles.icon}>🏋️</Text>
            <View style={styles.detail}>
              <Text style={styles.Weight}>{item.user_weight}</Text>
              <Text style={styles.Date}>{item.user_weight_time}</Text>
            </View>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#fff",
  },
  headerContainer: {
    justifyContent: "center",
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: Colors.gymme.orange,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backgroundArrow: {
    position: "absolute",
    borderRadius: 40,
    marginVertical: 30,
    marginHorizontal: 25,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    flex: 1,
    fontFamily: "Poppins",
  },
  entryContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 25
  },
  icon: {
    fontSize: 40,
    marginRight: 10,
  },
  detail: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  Weight: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
  Date: {
    marginRight: 15,
    fontSize: 18,
    color: "#666",
  },
  divider: {
    height: 1,
    backgroundColor: "#fff",
    marginHorizontal: 20,
  },
});

export default viewWeightHistory;
