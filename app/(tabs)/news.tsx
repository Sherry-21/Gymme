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

const dummy = require("@/assets/images/home/dummy img.png");

export default function HomeScreen() {
  const [value, setValue] = useState("");
  const [finalValue, setFinalValue] = useState("");
  const [news, setNews] = useState<any[]>([]);
  const [page, setPage] = useState("0");
  const [isLoading, setIsLoading] = useState(false);

  const limit: string = "15";

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
      if (!responseSearch || responseSearch.success == false) { 
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

  const fetchApi = async (inView: Boolean) => {
    if (inView == true && page != "0") {
      try {
        const responseObserver = await getAllInformationBySearch(
          page,
          limit,
          finalValue
        );
        if (!responseObserver || responseObserver.success == false) {
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
    } else {
      console.log(inView);
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
        if (!responseSearch || responseSearch.success == false) {
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.gymme.background }}>
      <IOScrollView>
        <ScrollView style={styles.baseColor} ref={scrollViewRef}>
          <Image
            style={styles.aboveImage}
            source={require("@/assets/images/news/above image.png")}
          ></Image>

          <View style={styles.mainLayout}>
            <View style={styles.textField}>
              {/* <Image style={styles.image} source={searchImage}></Image> */}

              <View style={{ alignItems: "center", justifyContent: "center"}}>
                <MaterialIcons name="search" size={24} />
              </View>
              <TextInput
                style={styles.textInput}
                value={value}
                onChangeText={setValue}
                placeholder={"Search news"}
                placeholderTextColor={Colors.gymme.placeholder}
                underlineColorAndroid="transparent"
                onSubmitEditing={handleSubmit}
              ></TextInput>
            </View>

            {news.map((item: any, index: number) => (
              <NewsButton
                key={index}
                id={item.information_id}
                image={item.information_header_path_content}
                title={item.information_header}
                date={parseDate(item.information_date_created)}
              />
            ))}
          </View>
        </ScrollView>
        <InView
          style={styles.intersection}
          onChange={(inView: boolean) => fetchApi(inView)}
        ></InView>
      </IOScrollView>
      {isLoading ? <Loading /> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  aboveImage: {
    flex: 1,
    width: "100%",
    height: 180,
    position: "absolute",
  },
  baseColor: {
    backgroundColor: "#fff",
    // flex: 1,
  },
  mainLayout: {
    marginHorizontal: 25,
    marginVertical: 40,
    alignItems: "center",
  },
  textField: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 15,
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginTop: 100,
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
    padding: 10,
    fontSize: 14,
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
