import { Colors } from "@/constants/Colors";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getInformationById } from "@/app/API/GetInformationApi";
import { EquipmentPayload } from "@/app/Payload/newsPayloads";
import { parseDate } from "@/app/helper/dateFormatter";
import { deleteBookmarkList, postBookmarkList } from "./API/bookmarkApi";
import Loading from "@/components/loading";
import { MaterialIcons } from "@expo/vector-icons";

export default function NewsDetail() {
  const [bookmark, setBookmark] = useState(false);

  const { newsId } = useLocalSearchParams();

  const [InformationData, SetInformationData] = useState(null);

  const [Information, setInformation] = useState<EquipmentPayload | null>(null);

  const [InformationId, SetInformationId]: any = useState(newsId);

  const [isLoading, setIsLoading] = useState(false);

  const [errorToaster, setErrorToaster] = useState(false);
  const [errorImage, setErrorImage] = useState(false);

  const backButton = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/news");
    }
  };

  const bookmarkNews = async () => {
    const bookmarkTemp = !bookmark;
    setBookmark(!bookmark);
    if (bookmarkTemp == true) {
      const data = await postBookmarkList(parseInt(InformationId));
      if (data == null) {
        setErrorToaster(true);
        setBookmark(bookmark);
        return;
      }
    } else {
      const data = await deleteBookmarkList(parseInt(InformationId));
      if (data.data == null) {
        setErrorToaster(true);
        setBookmark(bookmark);
        return;
      }
    }
  };

  const onclickGetInformation = async () => {
    setIsLoading(true);
    const data = await getInformationById(InformationId);
    setIsLoading(false);
    if (data == null) {
      router.push("/search");
    } else {
      console.log(data.data);
      setInformation(data.data);
      setBookmark(data.data.is_bookmark);
      console.log(Information);
      console.log(Information?.information_body_content);
    }
  };

  const pressedErrorToaster = () => {
    setErrorToaster(false);
  };

  useEffect(() => {
    onclickGetInformation();
  }, []);

  const imageError = () => {
    setErrorImage(true);
  };

  return (
    <SafeAreaView style={styles.baseColor}>
      <ScrollView>
        <Image
          style={styles.aboveImage}
          source={require("@/assets/images/newsDetail/test-image.png")}
        ></Image>
        <Pressable style={styles.backgroundArrow} onPress={() => backButton()}>
          <MaterialIcons name="arrow-back-ios-new" size={20} color="#000" />
        </Pressable>

        <View style={styles.mainLayout}>
          <View style={styles.textBookmark}>
            <Text style={styles.headerText}>
              {Information?.information_header}
            </Text>
            <Pressable onPress={bookmarkNews}>
              {bookmark ? (
                <MaterialIcons name="bookmark" size={36} color="#000" />
              ) : (
                <MaterialIcons name="bookmark-outline" size={36} color="#000" />
              )}
            </Pressable>
          </View>
          <Text style={styles.newsInfo}>
            {parseDate(Information?.information_date_created ?? "")}
          </Text>

          {Information?.information_body_content?.map((detail, index) => (
            <View key={index}>
              <Text style={styles.newsText}>
                {detail.information_body_paragraph}
              </Text>
              <Text>{"\n"}</Text>
              {errorImage ? null : (
                <View>
                  <Image
                    style={styles.newsImage}
                    source={{uri : detail.information_image_content_path}}
                    onError={imageError}
                  ></Image>
                  <Text>{"\n"}</Text>
                </View>
              )}
            </View>
          ))}
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
  aboveImage: {
    flex: 1,
    width: "100%",
    height: 230,
    zIndex: -5,
  },
  newsImage: {
    flex: 1,
    width: "100%",
    height: 230
  },
  baseColor: {
    backgroundColor: "#fff",
    flex: 1,
  },
  mainLayout: {
    marginHorizontal: 25,
    marginVertical: 30,
  },
  backgroundArrow: {
    position: "absolute",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 10.5,
    borderRadius: 40,
    marginVertical: 60,
    marginHorizontal: 25,
  },
  headerText: {
    fontSize: 23,
    fontWeight: "bold",
    marginRight: 30,
    fontFamily: "Poppins",
  },
  textBookmark: {
    justifyContent: "space-between",
    flex: 1,
    flexDirection: "row",
  },
  bookmarkImage: {
    width: 23,
    height: 28,
    padding: 5,
  },
  newsInfo: {
    color: Colors.gymme.placeholder,
    fontSize: 11,
    fontFamily: "Poppins",
    marginTop: 5,
    marginBottom: 20,
  },
  newsText: {
    fontFamily: "Poppins",
    fontSize: 14,
    textAlign: "justify"
  },
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
    fontSize: 20,
    fontFamily: "Poppins",
    fontWeight: "bold",
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
