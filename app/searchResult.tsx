import { router, useFocusEffect } from "expo-router";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { eqDetailResultHelper } from "@/helper/pathUtils";
import { useLocalSearchParams } from "expo-router";
import Loading from "@/components/loading";
import { MaterialIcons } from "@expo/vector-icons";
import { getAllCourse } from "./API/equipmentApi";
import { Colors } from "@/constants/Colors";

export default function searchResult() {
  const [equipment, setEquipment]: any = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { equipmentId } = useLocalSearchParams();

  useEffect(() => {
    fetchEquipment();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchEquipment();
    }, [])
  );

  const fetchEquipment = async () => {
    try {
      setIsLoading(true);
      const response = await getAllCourse(parseInt(equipmentId.toString(), 10));
      if (response.success == "false") {
        throw new Error("ERROR");
      }
      const data = response.data;
      if (data.equipment_mapping_data == null) {
        data.equipment_mapping_data = [];
      }
      console.log(data);
      setEquipment(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const backButton = () => {
    router.push("/search");
  };

  const moveToEquipmentGuidePage = (id: number) => {
    router.push(eqDetailResultHelper({ muscleId: id }) as any);
  };

  return (
    <SafeAreaView style={styles.baseLayout}>
      {isLoading ? (
        <Loading />
      ) : (
        <ScrollView style={{ marginHorizontal: 25, marginVertical: 40 }}>
          <Pressable style={styles.backgroundArrow} onPress={backButton}>
            <MaterialIcons name={"arrow-back-ios-new"} size={24} />
          </Pressable>

          <View style={styles.mainLayout}>
            <Image
              style={styles.eqImage}
              source={{
                uri: equipment ? equipment.equipment_photo_path : "photo path",
              }}
            />
            <Text style={styles.headerText}>
              {equipment ? equipment.equipment_name : "equipment name"}
            </Text>
            <Text style={styles.subText}>
              Which muscle would you like to build?
            </Text>
            {equipment?.equipment_mapping_data?.map(
              (
                muscle: {
                  equipment_mapping_id: number;
                  equipment_mapping_name: string;
                },
                index: number
              ) => (
                <Pressable
                  key={index}
                  style={styles.buttonMuscle}
                  onPress={() =>
                    moveToEquipmentGuidePage(muscle.equipment_mapping_id)
                  }
                >
                  <Text style={styles.muscleOption}>
                    {muscle.equipment_mapping_name}
                  </Text>
                </Pressable>
              )
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  baseLayout: {
    flex: 1,
    backgroundColor: "#fff",
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
    borderWidth: 1,
    borderColor: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    backgroundColor: "#fff",
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
    marginTop: 20,
    marginBottom: 5,
  },
  subText: {
    fontSize: 19,
    marginBottom: 15,
    fontFamily: "Poppins",
    textAlign: "center",
  },
  buttonMuscle: {
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 15,
    width: "100%",
    borderColor: "#fff",
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 5,
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
