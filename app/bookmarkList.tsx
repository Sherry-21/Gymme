import NewsButton from "@/components/homeNews";
import { Colors } from "@/constants/Colors";
import { useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const dummy = require("@/assets/images/home/dummy img.png");

export default function bookmarkList() {
  const backButton = () => {
    console.log("back");
  };

  const [equipment, setEquipment]: any = useState(true);

  const changeView = (type: any) => {
    setEquipment(type);
  };

  return (
    <SafeAreaView style={styles.baseLayout}>
      <Pressable style={styles.backgroundArrow} onPress={backButton}>
        <Image
          style={styles.arrowBack}
          source={require("@/assets/images/newsDetail/arrow-back.png")}
        ></Image>
      </Pressable>
      <View style={styles.header}>
        <Text style={styles.headerText}>Bookmark list</Text>
      </View>
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
      <ScrollView>
        {equipment ? (
          <View>
            
          </View>
        ) : (
          <View>
            <NewsButton
              id={1}
              image={dummy}
              title={"5 kesalahan yang sering terjadi saat melakukan gym"}
              date={"24 agt 2024 (also dummy)"}
            />
            <NewsButton
              id={1}
              image={dummy}
              title={"5 kesalahan yang sering terjadi saat melakukan gym"}
              date={"24 agt 2024 (also dummy)"}
            />
            <NewsButton
              id={1}
              image={dummy}
              title={"5 kesalahan yang sering terjadi saat melakukan gym"}
              date={"24 agt 2024 (also dummy)"}
            />
            <NewsButton
              id={1}
              image={dummy}
              title={"5 kesalahan yang sering terjadi saat melakukan gym"}
              date={"24 agt 2024 (also dummy)"}
            />
            <NewsButton
              id={1}
              image={dummy}
              title={"5 kesalahan yang sering terjadi saat melakukan gym"}
              date={"24 agt 2024 (also dummy)"}
            />
            <NewsButton
              id={1}
              image={dummy}
              title={"5 kesalahan yang sering terjadi saat melakukan gym"}
              date={"24 agt 2024 (also dummy)"}
            />
            <NewsButton
              id={1}
              image={dummy}
              title={"5 kesalahan yang sering terjadi saat melakukan gym"}
              date={"24 agt 2024 (also dummy)"}
            />
            <NewsButton
              id={1}
              image={dummy}
              title={"5 kesalahan yang sering terjadi saat melakukan gym"}
              date={"24 agt 2024 (also dummy)"}
            />
            <NewsButton
              id={1}
              image={dummy}
              title={"5 kesalahan yang sering terjadi saat melakukan gym"}
              date={"24 agt 2024 (also dummy)"}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  baseLayout: {
    flex: 1,
    marginHorizontal: 25,
    marginVertical: 30,
  },
  optionDiv: {
    paddingVertical: 10,
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
  backgroundArrow: {
    position: "absolute",
    zIndex: 5,
  },
  arrowBack: {
    width: 30,
    height: 30,
  },
});
