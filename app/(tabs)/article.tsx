import {
  Image,
  StyleSheet,
  Platform,
  View,
  Text,
  TextInput,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Pressable,
  StatusBar,
} from "react-native";
import {
  IOScrollView,
  IOScrollViewController,
  InView,
} from "react-native-intersection-observer";
import NewsButton from "@/components/homeNews";
import { useCallback, useEffect, useRef, useState } from "react";
import { Colors } from "@/constants/Colors";
import { getAllInformationBySearch } from "../API/GetInformationApi";
import { parseDate } from "../helper/dateFormatter";
import Loading from "@/components/loading";
import { router, useFocusEffect } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { FlatList } from "react-native";

const dummy = require("@/assets/images/home/dummy img.png");

export default function HomeScreen() {
  const [value, setValue] = useState("");
  const [finalValue, setFinalValue] = useState("");
  const [news, setNews] = useState<any[]>([]);
  const [page, setPage] = useState("0");
  const [isLoading, setIsLoading] = useState(false);

  const limit: string = "15";

  const mainRef = useRef(null);

  const scrollViewRef = useRef<IOScrollViewController>(null);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  useEffect(() => {
    fetchData();
  }, [finalValue]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const responseSearch = await getAllInformationBySearch(
        "0",
        limit,
        finalValue
      );
      console.log(responseSearch);
      if (responseSearch == null || responseSearch.success == false) {
        throw new Error("Data not found");
      } else {
        const dataRow = responseSearch.data.rows;
        if (dataRow != null) {
          console.log(page);
          setNews(dataRow);
          setPage((1).toString());
        }
      }
      setIsLoading(false);
    } catch (error) {
      router.push("/errorPage");
    }
  };

  const fetchApi = async () => {
    try {
      const responseObserver = await getAllInformationBySearch(
        page,
        limit,
        finalValue
      );
      if (responseObserver == null || responseObserver.success == false) {
        throw new Error("Data not found");
      } else {
        const dataRow = await responseObserver.data.rows;
        if (dataRow != null) {
          setNews((prevNews) => [...prevNews, ...dataRow]);
          setPage((parseInt(page) + 1).toString());
          scrollViewRef.current?.scrollToEnd();
        }
      }
    } catch (error) {
      router.push("/errorPage");
    }
  };

  const handleSubmit = async () => {
    await setNews([]);
    await setFinalValue(value);
    if (!value || value == finalValue) {
      try {
        const responseSearch = await getAllInformationBySearch(
          "0",
          limit,
          value
        );
        if (responseSearch == null || responseSearch.success == false) {
          throw new Error("data not found");
        }
        const dataRow = responseSearch.data.rows;
        if (dataRow != null) {
          await setNews(dataRow);
          setPage((1).toString());
        }
      } catch (error) {
        router.push("/errorPage");
      }
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <NewsButton
      id={item.article_id}
      image={item.article_header_path_content}
      title={item.article_header}
      date={item.article_date_created}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.gymme.background }}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.baseColor}>
        <Image
          style={styles.aboveImage}
          source={require("@/assets/images/news/above image.png")}
        ></Image>

        <View style={styles.mainLayout}>
          <View style={styles.textField}>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <MaterialIcons name="search" size={24} />
            </View>
            <TextInput
              style={styles.textInput}
              value={value}
              onChangeText={setValue}
              placeholder={"Search article"}
              placeholderTextColor={Colors.gymme.placeholder}
              underlineColorAndroid="transparent"
              onSubmitEditing={handleSubmit}
            ></TextInput>
          </View>
        </View>
      </View>
      <FlatList
        style={{ marginHorizontal: 25, marginBottom: 15 }}
        data={news}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.article_id}-${index}`}
        onEndReached={({ distanceFromEnd }) => {
          if (distanceFromEnd < 0) {
            return;
          }
          fetchApi();
        }}
        onEndReachedThreshold={0.5}
      />
      {isLoading ? <Loading /> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  aboveImage: {
    flex: 1,
    width: "100%",
    height: 100,
    position: "absolute",
  },
  baseColor: {
    backgroundColor: "#fff",
  },
  mainLayout: {
    marginHorizontal: 25,
    marginTop: 40,
    alignItems: "center",
  },
  textField: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 15,
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginTop: 40,
    backgroundColor: Colors.gymme.background,
    marginBottom: 15,
  },
  image: {
    margin: 10,
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  textInput: {
    flex: 1,
    padding: 8,
    fontSize: 12,
    alignItems: "center",
    fontFamily: "Poppins",
  },
  loginLogo: {
    resizeMode: "contain",
    width: 250,
    height: 250,
  },
  mainLogin: {
    marginTop: 25,
    width: "100%",
    marginBottom: 40,
  },
  headerText: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Poppins",
  },
  bottomText: {
    flexDirection: "row",
    marginTop: 5,
  },
  link: {
    textDecorationLine: "underline",
    textDecorationColor: Colors.gymme.blue,
    color: Colors.gymme.blue,
  },
  intersection: {
    height: 1,
    width: "100%",
  },
});
