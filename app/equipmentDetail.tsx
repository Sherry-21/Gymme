import { Colors } from "@/constants/Colors";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
} from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { getCourseById } from "./API/equipmentApi";
import Loading from "@/components/loading";
import { deleteEqBookmarkList, postEqBookmarkList } from "./API/bookmarkApi";

const loading = require("@/assets/images/searchResult/loading.gif");

export default function equipmentDetail() {
  const ref = useRef(null);
  const [videoLink, setVideoLink] = useState("");

  const { muscleId } = useLocalSearchParams();

  const player = useVideoPlayer(videoLink, (player) => {
    player.loop = true;
  });

  const [equipmentDetail, setEquipmentDetail]: any = useState(null);
  const [bookmark, setBookmark] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorImage, setErrorImage] = useState(false);
  const [errorToaster, setErrorToaster] = useState(false);

  useEffect(() => {
    fetchEquipmentDetail();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchEquipmentDetail();
    }, [])
  );

  const checkImageUri = async (uri: string) => {
    try {
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error("Image not accessible");
      }
    } catch (error) {
      setErrorImage(true);
      return false;
    }
    return true;
  };

  const validateLink = async (data: any) => {
    const checkImageUrl = data.equipment_detail?.forEach(
      async (detail: any) => {
        if (detail.TutorialPath.length == 0) {
          detail.TutorialPath = null;
        } else {
          const responseImageUrl = await checkImageUri(detail.TutorialPath);
          console.log(responseImageUrl);
          if (responseImageUrl == false) {
            detail.TutorialPath = null;
          }
        }
      }
    );
  };

  const fetchEquipmentDetail = async () => {
    try {
      setIsLoading(true);
      const response = await getCourseById(parseInt(muscleId.toString()));
      setIsLoading(false);
      console.log(response);
      if (response == null || response.success == false) {
        throw new Error("error getting data");
      }
      const data = response.data;
      await validateLink(data);
      setEquipmentDetail(data);
      setVideoLink(data.video_tutorial_video_path);
      setBookmark(data.is_bookmark);
    } catch (error) {
      console.error("Error fetching data:", error);
      router.push("/errorPage");
    }
  };

  const backButton = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/search");
    }
  };

  const bookmarkNews = async () => {
    const bookmarkTemp = !bookmark;
    console.log(bookmarkTemp);
    setBookmark((bookmark) => !bookmark);
    if (bookmarkTemp == true) {
      const data = await postEqBookmarkList(parseInt(muscleId.toString()));
      console.log("true : ", data);
      if (!data || data.success == false) {
        setErrorToaster(true);
        setBookmark(bookmark);
        return;
      }
    } else {
      const data = await deleteEqBookmarkList(parseInt(muscleId.toString()));
      console.log("false : ", data);
      if (!data || data.success == false) {
        setErrorToaster(true);
        setBookmark(bookmark);
        return;
      }
    }
  };

  const imageError = () => {
    setErrorImage(true);
  };

  const pressedErrorToaster = () => {
    setErrorToaster(false);
  };

  return (
    <SafeAreaView style={styles.baseLayout}>
      <StatusBar barStyle="light-content" backgroundColor="#F39C12" />
      <View style={styles.headerContainer}>
        <Pressable style={styles.backgroundArrow} onPress={backButton}>
          <MaterialIcons name={"arrow-back-ios-new"} size={24} color="#fff" />
        </Pressable>
        <View>
          <Text style={styles.titleDetail}>
            {equipmentDetail?.equipment_master_name}
          </Text>
          <Text style={styles.titleSubDetail}>
            {equipmentDetail?.equipment_mapping_data_entity_name.length > 20
              ? `${equipmentDetail.equipment_mapping_data_entity_name.slice(
                  0,
                  20
                )}...`
              : equipmentDetail?.equipment_mapping_data_entity_name}{" "}
          </Text>
        </View>
        <Pressable onPress={bookmarkNews}>
          {bookmark ? (
            <MaterialIcons name="bookmark" size={32} color="#fff" />
          ) : (
            <MaterialIcons name="bookmark-outline" size={32} color="#fff" />
          )}
        </Pressable>
      </View>
      <ScrollView
        style={{ marginHorizontal: 25, marginBottom: 30 }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainLayout}>
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
                  Muscle Group
                </Text>
                <Text style={[styles.tableCell, styles.right]}>
                  {equipmentDetail?.muscle_group_name}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text
                  style={[styles.tableCell, styles.headerCell, styles.left]}
                >
                  Type
                </Text>
                <Text style={[styles.tableCell, styles.right]}>
                  {equipmentDetail?.equipment_type_name}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text
                  style={[styles.tableCell, styles.headerCell, styles.left]}
                >
                  Force Type
                </Text>
                <Text style={[styles.tableCell, styles.right]}>
                  {equipmentDetail?.force_type_name}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text
                  style={[styles.tableCell, styles.headerCell, styles.left]}
                >
                  Difficulty
                </Text>
                <Text style={[styles.tableCell, styles.right]}>
                  {equipmentDetail?.equipment_difficulty_name}
                </Text>
              </View>
            </View>
          </View>

          <View>
            <Text style={styles.headerText}>Video Tutorial</Text>
            <VideoView
              ref={ref}
              player={player}
              style={[styles.video]}
              allowsFullscreen
              allowsPictureInPicture
            />
          </View>

          <View>
            <Text style={styles.headerText}>Instruction</Text>
            {equipmentDetail?.equipment_detail?.map(
              (detail: any, index: number) => (
                <View key={index}>
                  <Text style={styles.desc}>{detail.TutorialParagraph}</Text>
                  <Text>{"\n"}</Text>
                  {detail.TutorialPath == null ? null : (
                    <View>
                      <Image
                        style={styles.eqImage}
                        source={{
                          uri: detail.TutorialPath,
                        }}
                        onError={imageError}
                      ></Image>
                      <Text>{"\n"}</Text>
                    </View>
                  )}
                </View>
              )
            )}
          </View>
        </View>
      </ScrollView>
      {isLoading ? <Loading /> : null}
      {errorToaster && (
        <View style={styles.errorToaster}>
          <View style={styles.errorBox}>
            <MaterialIcons
              style={styles.icon}
              name="error"
              size={50}
              color="#F39C12"
            />
            <Text style={styles.titleNotFound}>BOOKMARK FAILED!!</Text>
            <Text style={styles.subheaderText}>Please try again later</Text>
            <Pressable
              onPress={() => pressedErrorToaster()}
              style={styles.toasterContent}
            >
              <Text style={styles.errorText}>Try again</Text>
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  baseLayout: {
    flex: 1,
    backgroundColor: "#fff",
  },
  eqImage: {
    flex: 1,
    width: "100%",
    height: 230,
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
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 15,
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.gymme.orange,
    borderBottomColor: Colors.gymme.placeholder,

    //ios
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  titleDetail: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "PoppinsBold",
  },
  titleSubDetail: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "Poppins",
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
    width: "25%",
  },
  secondContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
  },
  tableRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tableCell: {
    padding: 4,
    fontFamily: "Poppins",
  },
  left: {
    textAlign: "left",
  },
  right: {
    textAlign: "right",
  },
  headerCell: {
    fontFamily: "Poppins",
  },
  tableContainer: {
    width: "65%",
    borderWidth: 1,
    borderRadius: 15,
    padding: 4,
    marginLeft: 30,
  },
  headerTable: {
    paddingVertical: 4,
    fontSize: 18,
    textAlign: "center",
    fontFamily: "PoppinsBold",
  },
  headerText: {
    fontFamily: "PoppinsBold",
    fontSize: 18,
    marginTop: 25,
    marginBottom: 5,
  },
  desc: {
    fontSize: 12,
    fontFamily: "Poppins",
    textAlign: "justify",
  },
  video: {
    width: "100%",
    height: 180,
  },

  //error toaster
  errorToaster: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  toasterContent: {
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#F39C12",
  },
  errorText: {
    color: "white",
    fontSize: 14,
  },
  errorBox: {
    width: "70%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  titleNotFound: {
    fontSize: 18,
    fontFamily: "PoppinsBold",
    color: "#F39C12",
    marginBottom: 5,
  },
  subheaderText: {
    fontSize: 14,
    fontFamily: "Poppins",
    marginBottom: 20,
  },
  icon: {
    marginBottom: 10,
  },
  error: {
    fontSize: 12,
    color: Colors.gymme.red,
    marginBottom: 5,
  },
});
