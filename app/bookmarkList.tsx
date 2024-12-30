import NewsButton from "@/components/homeNews";
import { Colors } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getBookmarkList, getEqBookmarkList } from "./API/bookmarkApi";
import { parseDate } from "./helper/dateFormatter";
import Loading from "@/components/loading";
import BookmarkButton from "@/components/bookmarkEquipmentButton";

const dummy = require("@/assets/images/home/dummy img.png");

export default function bookmarkList() {
  const [equipment, setEquipment]: any = useState(true);
  const [news, setNews] = useState<any[]>([]);
  const [equipmentList, setEquipmentList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getBookmarked();
    }, [])
  );

  const backButton = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/other");
    }
  };

  const changeView = (type: any) => {
    setEquipment(type);
  };

  useEffect(() => {
    getBookmarked();
  }, []);

  const getBookmarked = async () => {
    try {
      setIsLoading(true);
      const response = await getBookmarkList();
      const response2 = await getEqBookmarkList();
      setIsLoading(false);
      if (
        !response ||
        response.success == false ||
        !response2 ||
        response2.success == false
      ) {
        throw new Error("Error fetching data");
      }
      const data = response.data;
      const data2 = response2.data;
      setNews(data);
      setEquipmentList(data2);
    } catch (error) {
      router.push("/errorPage");
    }
  };

  return (
    <SafeAreaView style={styles.baseLayout}>
      <View style={styles.headerContainer}>
        <Pressable style={styles.backgroundArrow} onPress={() => backButton()}>
          <MaterialIcons name="arrow-back-ios-new" size={24} color="#fff" />
        </Pressable>

        <Text style={styles.headerTitle}>Bookmark list</Text>
      </View>
      <View style={{ marginHorizontal: 25 }}>
        <View style={styles.optionDiv}>
          <Pressable style={styles.coverText} onPress={() => changeView(true)}>
            <Text style={[styles.option, equipment ? styles.active : null]}>
              Equipment
            </Text>
          </Pressable>
          <View style={styles.line}></View>
          <Pressable style={styles.coverText} onPress={() => changeView(false)}>
            <Text style={[styles.option, !equipment ? styles.active : null]}>
              News
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView>
        {equipment ? (
          <View style={{ marginHorizontal: 25, marginBottom: 40 }}>
            {equipmentList && equipmentList.length > 0
              ? equipmentList.map((item: any, index: number) => (
                  <BookmarkButton
                    key={index}
                    id={item.equipment_course_id}
                    image={dummy}
                    name={item.equipment_name}
                    subText={item.equipment_course_name}
                  />
                ))
              : null}
          </View>
        ) : (
          <View style={{ marginHorizontal: 25, marginBottom: 40 }}>
            {news && news.length > 0
              ? news.map((item: any, index: number) => (
                  <NewsButton
                    key={index}
                    id={item.information_id}
                    image={item.information_header_path_content}
                    title={item.information_header}
                    date={parseDate(item.information_date_created)}
                  />
                ))
              : null}
          </View>
        )}
      </ScrollView>

      {isLoading ? <Loading /> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  baseLayout: {
    flex: 1,
    backgroundColor: Colors.gymme.background,
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
  optionDiv: {
    paddingBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: Colors.gymme.placeholder,
    width: "100%",
    marginBottom: 15,
  },
  coverText: {
    flex: 1,
  },
  option: {
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Poppins",
    marginHorizontal: 10,
  },
  active: {
    fontWeight: "bold",
    color: Colors.gymme.orange,
  },
  line: {
    height: "100%",
    width: 1,
    backgroundColor: Colors.gymme.placeholder,
  },
  header: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.gymme.placeholder,
    paddingBottom: 15,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Poppins",
  },
  arrowBack: {
    width: 30,
    height: 30,
  },
});
