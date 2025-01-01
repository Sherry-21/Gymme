import { router, useFocusEffect } from "expo-router";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
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
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
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
    width: 180,
    height: 180,
    borderRadius: 100,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
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
    fontSize:24,
    fontFamily: "PoppinsBold",
    marginTop: 20,
    marginBottom: 3,
  },
  subText: {
    fontSize: 16,
    marginBottom: 15,
    fontFamily: "Poppins",
    textAlign: "center",
  },
  buttonMuscle: {
    flex: 1,
    width: "100%",
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
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
    fontSize: 16,
    fontFamily: "Poppins",
  },
});
