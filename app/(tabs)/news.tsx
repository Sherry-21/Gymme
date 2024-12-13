import {
  Image,
  StyleSheet,
  Platform,
  View,
  Text,
  TextInput,
  ScrollView,
  Dimensions,
} from "react-native";
import {
  IOScrollView,
  IOScrollViewController,
  InView,
} from "react-native-intersection-observer";
import NewsButton from "@/components/homeNews";
import { useEffect, useRef, useState } from "react";
import { Colors } from "@/constants/Colors";
import { getAllInformationBySearch } from "../API/GetInformationApi";
import { parseDate } from "../helper/dateFormatter";

const searchImage = require("@/assets/images/home/search.png");
const dummy = require("@/assets/images/home/dummy img.png");

export default function HomeScreen() {
  const [value, setValue] = useState("");
  const [finalValue, setFinalValue] = useState("");
  const [news, setNews] = useState<any[]>([]);
  const [page, setPage] = useState("0");

  const limit: string = "50";

  const scrollViewRef = useRef<IOScrollViewController>(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log("FINAL");
      const responseSearch = await getAllInformationBySearch(
        "0",
        limit,
        finalValue
      );
      const dataRow = await responseSearch.data.rows;
      console.log(page);
      if (dataRow != null) {
        console.log(page);
        setNews(dataRow);
        setPage((1).toString());
      }
    };
    fetchData();
  }, [finalValue]);

  const fetchApi = async (inView: Boolean) => {
    if (inView == true) {
      const responseObserver = await getAllInformationBySearch(
        page,
        limit,
        finalValue
      );
      const dataRow = await responseObserver.data.rows;
      if (dataRow != null) {
        setNews((prevNews) => [...prevNews, ...dataRow]);
        setPage((parseInt(page) + 1).toString());
        scrollViewRef.current?.scrollToEnd();
      }
    } else {
      console.log(inView);
    }
  };

  const handleSubmit = async () => {
    await setNews([]);
    await setFinalValue(value);
    if (!value) {
      const responseSearch = await getAllInformationBySearch("0", limit, value);
      const dataRow = responseSearch.data.rows;
      if (dataRow != null) {
        await setNews(dataRow);
        setPage((1).toString());
      }
    } else if (value == finalValue) {
      const responseSearch = await getAllInformationBySearch("0", limit, value);
      const dataRow = responseSearch.data.rows;
      if (dataRow != null) {
        await setNews(dataRow);
        setPage((1).toString());
      }
    }
  };

  return (
    <IOScrollView style={{ flex: 1, backgroundColor: Colors.gymme.background }}>
      <ScrollView style={styles.baseColor} ref={scrollViewRef}>
        <Image
          style={styles.aboveImage}
          source={require("@/assets/images/news/above image.png")}
        ></Image>

        <View style={styles.mainLayout}>
          <View style={styles.textField}>
            <Image style={styles.image} source={searchImage}></Image>
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
              image={dummy}
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
    flex: 1,
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
