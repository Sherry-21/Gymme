import CustomSearchHistory from "@/components/customSearchHistory";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { searchResultHelper } from "@/helper/pathUtils";

const searchImage = require("@/assets/images/search/search.png");
const aiImage = require("@/assets/images/search/aiImage.png");
const dummy = require("@/assets/images/home/dummy img.png");

export default function SearchScreen() {
  const [value, setValue] = useState("");
  const [tempValue, setTempValue] = useState("");
  const [search, setSearch] = useState<string[]>([]);
  const [searchItem, setSearchItem]: any = useState([]);

  useEffect(() => {
    console.log(value);

    setSearch(["hello", "test", "wkkw"]);
    return () => {
      console.log("UNMOUNT");
    };
  }, []);

  const aiLens = () => {
    router.push("/aiLens");
  };

  const handleSubmit = () => {
    setValue(tempValue);
    setSearchItem(["benchpress", "test2", "test3"]);
  };

  const historyPressed = (valueHistory: string) => {
    setTempValue(valueHistory)
    setValue(valueHistory);
    setSearchItem(["test"]);
  };

  const deleteSearch = (itemToDelete: string) => {
    setSearch((prevSearch) =>
      prevSearch.filter((item) => item !== itemToDelete)
    );
  };

  const movePage = () => {
    router.push(
      searchResultHelper({ path: "searchResult", name: "lolzzz" }) as any
    );
  };

  return (
    <SafeAreaView style={styles.saveArea}>
      <ScrollView style={styles.mainLayout}>
        <View style={styles.container}>
          <View style={styles.textField}>
            <Image style={styles.searchImage} source={searchImage}></Image>
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
              <Pressable style={styles.box} onPress={() => {}}>
                <Image style={styles.image} source={dummy}></Image>
                <Text style={styles.textSearch}>{item}</Text>
              </Pressable>
            ))
          ) : (
            <>
              <Text style={styles.headerSearch}>Recent Search</Text>
              {search.map((item: any) => (
                <Pressable onPress={() => historyPressed(item)}>
                  <CustomSearchHistory
                    key={item}
                    parent={deleteSearch}
                    text={item}
                  />
                </Pressable>
              ))}
            </>
          )}
        </View>
      </ScrollView>
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
    resizeMode: "contain",
    marginRight: 15,
  },
  textSearch: {
    marginLeft: 10,
    fontSize: 18,
    fontFamily: "Poppins",
  },
  box: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 20,
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
    marginVertical: 40,
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
    fontFamily: "Poppins",
    flex: 1,
    padding: 10,
  },
  aiImage: {
    width: 45,
    height: 45,
  },
  headerSearch: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Poppins",
  },
  historyContainer: {
    marginTop: 15,
  },
});
