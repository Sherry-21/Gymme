import { Colors } from "@/constants/Colors";
import { useEffect, useRef, useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { router } from "expo-router";

const loading = require("@/assets/images/searchResult/loading.gif");

export default function equipmentDetail() {
  const ref = useRef(null);
  const [videoLink, setVideoLink] = useState("");

  const player = useVideoPlayer(videoLink, (player) => {
    player.loop = true;
    player.play();
  });

  const [equipmentDetail, setEquipmentDetail]: any = useState(null);
  const [bookmark, setBookmark] = useState(false);

  useEffect(() => {
    const fetchEquipmentDetail = async () => {
      try {
        const response = await fetch(
          "/equipment-detail?equipmentId=mock&muscle=mock"
        );
        const json = await response.json();
        setEquipmentDetail(json.equipmentDetail);
        setVideoLink(json.equipmentDetail.videoLink);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchEquipmentDetail();
  }, []);

  const backButton = () => {
    router.push("/search");
  };

  const bookmarkNews = () => {
    setBookmark((bookmark) => !bookmark);
  };

  return (
    <SafeAreaView style={styles.baseLayout}>
      {equipmentDetail ? (
        <ScrollView>
          <View style={styles.mainLayout}>
            <View style={styles.headerContainer}>
              <Pressable style={styles.backgroundArrow} onPress={backButton}>
                <Image
                  style={styles.arrowBack}
                  source={require("@/assets/images/newsDetail/arrow-back.png")}
                ></Image>
              </Pressable>
              <View>
                <Text style={styles.titleDetail}>Bench Press</Text>
                <Text style={styles.titleSubDetail}>upper chess</Text>
              </View>
              <Pressable onPress={bookmarkNews}>
                {bookmark ? (
                  <Image
                    style={styles.bookmarkImage}
                    source={require("@/assets/images/newsDetail/bookmark.png")}
                  ></Image>
                ) : (
                  <Image
                    style={styles.bookmarkImage}
                    source={require("@/assets/images/newsDetail/bookmark-filled.png")}
                  ></Image>
                )}
              </Pressable>
            </View>

            <View style={styles.secondContainer}>
              <Image
                style={styles.chessImage}
                source={require("@/assets/images/dummy/chessMuscle.png")}
              ></Image>

              <View style={styles.tableContainer}>
                <Text style={styles.headerTable}>Exercise Profile</Text>
                <View style={styles.tableRow}>
                  <Text
                    style={[styles.tableCell, styles.headerCell, styles.left]}
                  >
                    test
                  </Text>
                  <Text style={[styles.tableCell, styles.right]}>
                    dumyyyyyyyyyyyyyyy
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text
                    style={[styles.tableCell, styles.headerCell, styles.left]}
                  >
                    test2
                  </Text>
                  <Text style={[styles.tableCell, styles.right]}>
                    jangnabangettt
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text
                    style={[styles.tableCell, styles.headerCell, styles.left]}
                  >
                    test3
                  </Text>
                  <Text style={[styles.tableCell, styles.right]}>
                    jangnabangettt
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text
                    style={[styles.tableCell, styles.headerCell, styles.left]}
                  >
                    test4
                  </Text>
                  <Text style={[styles.tableCell, styles.right]}>
                    jangnabangettt
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text
                    style={[styles.tableCell, styles.headerCell, styles.left]}
                  >
                    test5
                  </Text>
                  <Text style={[styles.tableCell, styles.right]}>
                    jangnabangettt
                  </Text>
                </View>
              </View>
            </View>

            <View>
              <Text style={styles.headerText}>Video Tutorial</Text>
              <VideoView
                ref={ref}
                player={player}
                allowsFullscreen
                allowsPictureInPicture
              />
            </View>
            <View>
              <Text style={styles.headerText}>Instruction</Text>
              <Text style={styles.desc}>{equipmentDetail.description}</Text>
            </View>
          </View>
        </ScrollView>
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
    zIndex: 5,
  },
  loadImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  mainLoading: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  headerContainer: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.gymme.placeholder,
    elevation: 3,
    paddingBottom: 10,

    //ios
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  titleDetail: {
    fontSize: 26,
    fontFamily: "Poppins",
    fontWeight: "bold",
  },
  titleSubDetail: {
    fontSize: 18,
    color: Colors.gymme.placeholder,
  },
  bookmarkImage: {
    width: 27,
    height: 32,
    padding: 5,
  },
  mainLayout: {
    display: "flex",
  },
  chessImage: {
    width: 119,
    height: 250,
  },
  secondContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  tableCell: {
    flex: 1,
    padding: 8,
    fontFamily: "Poppins",
  },
  left: {
    textAlign: "left",
  },
  right: {
    textAlign: "right",
  },
  headerCell: {
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
  },
  tableContainer: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 8,
    marginLeft: 30,
  },
  headerTable: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Poppins",
    paddingBottom: 8,
    paddingTop: 8,
  },
  headerText: {
    fontFamily: "Poppins",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 5,
  },
  desc: {
    fontSize: 16,
    fontFamily: "Poppins",
    textAlign: "justify",
  },
});
