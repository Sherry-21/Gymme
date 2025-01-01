import CustomSearchHistory from "@/components/customSearchHistory";
import { Colors } from "@/constants/Colors";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { equipmentHelper, searchResultHelper } from "@/helper/pathUtils";
import { MaterialIcons } from "@expo/vector-icons";
import {
  deleteSearchHistory,
  getPageBySearch,
  getSearchHistory,
} from "../API/searchApi";
import { FlatList } from "react-native-gesture-handler";
import Loading from "@/components/loading";

const aiImage = require("@/assets/images/search/aiImage.png");
const dummy = require("@/assets/images/home/dummy img.png");

type SearchItem = {
  user_id: string;
  search_key: string;
  date_search: string;
  equipment_search_history_id: number;
};

export default function SearchScreen() {
  const [value, setValue] = useState("");
  const [tempValue, setTempValue] = useState("");
  const [search, setSearch] = useState<SearchItem[]>([]);
  const [searchItem, setSearchItem]: any = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchSearchHistory();
    }, [])
  );

  useEffect(() => {
    fetchSearchHistory();
  }, []);

  const fetchSearchHistory = async () => {
    try {
      setIsLoading(true);
      const response = await getSearchHistory();
      setIsLoading(false);
      if (response.success == false) {
        throw new Error("Error get history");
      }
      const data = response.data;
      setSearch(data);
    } catch (error) {
      console.error(error);
      router.push("/errorPage");
    }
  };

  const getSearchValue = async (value: string) => {
    try {
      setIsLoading(true);
      const response = await getPageBySearch(value);
      setIsLoading(false);
      console.log(response);
      if (response.success == false) {
        throw new Error("Error get history");
      }
      const data = response.data;
      setSearchItem(data);
    } catch (error) {
      console.error(error);
      router.push("/errorPage");
    }
  };

  const aiLens = () => {
    router.push("/aiLens");
  };

  const handleSubmit = async () => {
    setValue(tempValue);
    if (tempValue.length === 0) {
      await fetchSearchHistory();
    } else {
      await getSearchValue(tempValue);
    }
  };

  const historyPressed = async (valueHistory: string) => {
    setTempValue(valueHistory);
    setValue(valueHistory);
    await getSearchValue(valueHistory);
  };

  const equipmentPressed = (idEq: number) => {
    router.push(equipmentHelper({ id: idEq }) as any);
  };

  const deleteHistory = async (itemToDelete: number) => {
    setSearch((prevSearch) =>
      prevSearch.filter(
        (item) => item.equipment_search_history_id !== itemToDelete
      )
    );
    const response = await deleteSearchHistory(itemToDelete);
  };

  return (
    <SafeAreaView style={styles.saveArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView style={styles.mainLayout}>
        <View style={styles.container}>
          <View style={styles.textField}>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <MaterialIcons name="search" size={24} />
            </View>
            <TextInput
              style={styles.textInput}
              value={tempValue}
              onChangeText={setTempValue}
              placeholder={"Enter equipment name"}
              placeholderTextColor={Colors.gymme.placeholder}
              onSubmitEditing={handleSubmit}
              underlineColorAndroid="transparent"
            ></TextInput>
          </View>
          <Pressable onPress={aiLens}>
            <Image style={styles.aiImage} source={aiImage}></Image>
          </Pressable>
        </View>

        <View style={styles.historyContainer}>
          {value ? (
            searchItem.map((item: any) => (
              <Pressable
                key = {item.EquipmentId}
                style={styles.box}
                onPress={() => equipmentPressed(item.EquipmentId)}
              >
                <Image style={styles.image} source={dummy}></Image>
                <Text style={styles.textSearch}>{item.EquipmentName}</Text>
              </Pressable>
            ))
          ) : (
            <View>
              <Text style={styles.headerSearch}>Recent Search</Text>
              {search.map((item: any) => {
                if (item.search_key.length === 0) {
                  return;
                }
                return (
                  <Pressable key={item.equipment_search_history_id} onPress={() => historyPressed(item.search_key)}>
                    <View style={styles.historyField}>
                      <View style={styles.leftItem}>
                        <MaterialIcons
                          style={{ margin: 5 }}
                          name="schedule"
                          size={22}
                        />
                        <Text style={styles.text}>{item.search_key}</Text>
                      </View>

                      <Pressable
                        onPress={() =>
                          deleteHistory(item.equipment_search_history_id)
                        }
                      >
                        <MaterialIcons name="close" size={22} />
                      </Pressable>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
      {isLoading ? <Loading /> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  saveArea: {
    flex: 1,
    backgroundColor: Colors.gymme.background,
  },
  image: {
    width: 70,
    height: 70,
    marginRight: 15,
  },
  textSearch: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontFamily: "Poppins",
  },
  box: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: Colors.gymme.background,
    alignItems: "center",
    borderRadius: 15,
    marginBottom: 15,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 5,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mainLayout: {
    marginHorizontal: 25,
    marginTop: 30
  },
  textField: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
    width: "80%",
  },
  searchImage: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    padding: 8,
    fontSize: 12,
    alignItems: "center",
    fontFamily: "Poppins",
  },
  aiImage: {
    width: 45,
    height: 45,
  },
  headerSearch: {
    marginTop: 5,
    fontSize: 18,
    fontFamily: "PoppinsBold",
  },
  historyContainer: {
    marginTop: 15,
  },

  //searchHistory
  historyField: {
    flexDirection: "row",
    borderBottomColor: Colors.gymme.placeholder,
    borderBottomWidth: 1,
    width: "100%",
    flex: 1,
    backgroundColor: Colors.gymme.background,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  leftItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    padding: 5,
    fontSize: 14,
    alignItems: "center",
    fontFamily: "Poppins",
  },
});
