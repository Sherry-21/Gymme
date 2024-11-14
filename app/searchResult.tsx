import { router } from "expo-router";
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { eqDetailResultHelper } from "@/helper/pathUtils";
import { useLocalSearchParams } from "expo-router";

const loading = require("@/assets/images/searchResult/loading.gif");

export default function searchResult() {
  const [equipment, setEquipment]: any = useState(null);
  const { name } = useLocalSearchParams();

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch(`/searchResult?name=${name}`);
        const json = await response.json();
        setEquipment(json.equipment);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchEquipment();
  }, []);

  const backButton = () => {
    router.push("/search");
  };

  const moveToEquipmentGuidePage = (props: any) => {
    router.push(eqDetailResultHelper({path:"equipmentDetail", name:equipment.name, muscle:props.muscle}) as any)
  };

  return (
    <SafeAreaView style={styles.baseLayout}>
      {equipment ? (
        <View>
          <Pressable style={styles.backgroundArrow} onPress={backButton}>
            <Image
              style={styles.arrowBack}
              source={require("@/assets/images/newsDetail/arrow-back.png")}
            ></Image>
          </Pressable>

          <View style={styles.mainLayout}>
            <Image style={styles.eqImage} source={{ uri: equipment.image }} />
            <Text style={styles.headerText}>{equipment.name}</Text>
            <Text style={styles.subText}>
              Which muscle would you like to build?
            </Text>
            {equipment.muscleCategory.map((muscle: any, index: number) => (
              <Pressable
                key={index}
                style={styles.buttonMuscle}
                onPress={() => moveToEquipmentGuidePage(muscle)}
              >
                <Text style={styles.muscleOption}>{muscle}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.mainLoading}>
          <Image style={styles.loadImage} source={loading} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  baseLayout: {
    flex: 1,
    marginHorizontal: 25,
    marginVertical: 30,
  },
  arrowBack: {
    width: 30,
    height: 30,
  },
  backgroundArrow: {
    position: "absolute",
    marginTop: 13,
    zIndex: 5,
  },
  eqImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
  },
  loadImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  mainLayout: {
    display: "flex",
    alignItems: "center",
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "Poppins",
    marginVertical: 15,
  },
  subText: {
    fontSize: 22,
    marginBottom: 15,
    fontFamily: "Poppins",
    textAlign: "center",
  },
  buttonMuscle: {
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 15,
    width: "100%",
  },
  mainLoading: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  muscleOption: {
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Poppins",
  },
});
