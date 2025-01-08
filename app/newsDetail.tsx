import { Colors } from "@/constants/Colors";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
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
  const [finishChecking, setFinishChecking] = useState(false);

  const [errorToaster, setErrorToaster] = useState(false);
  const [errorImage, setErrorImage] = useState(false);

  const backButton = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/article");
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
    if (!data || data.success == false) {
      router.push("/errorPage");
      setIsLoading(false);
    } else {
      await validateLink(data);

      setInformation(data.data);
      setBookmark(data.data.is_bookmark);
      console.log("info: ", Information);
      console.log("body content ", Information?.article_body_content);
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  const pressedErrorToaster = () => {
    setErrorToaster(false);
  };

  useEffect(() => {
    onclickGetInformation();
  }, []);

  const validateLink = async (data: any) => {
    const checkImageUrl = data.data?.article_body_content?.forEach(
      async (detail: any) => {
        if (detail.article_image_content_path.length == 0) {
          detail.article_image_content_path = null;
        } else {
          const responseImageUrl = await checkImageUri(
            detail.article_image_content_path
          );
          if (responseImageUrl == false) {
            detail.article_image_content_path = null;
          }
        }
      }
    );

    setFinishChecking(true);
  };

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

  const imageError = () => {
    setErrorImage(true);
  };

  return (
    <SafeAreaView style={styles.baseColor}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ScrollView>
        <Image
          style={styles.aboveImage}
          source={{uri: Information?.article_header_image_path}}
        ></Image>
        <Pressable style={styles.backgroundArrow} onPress={() => backButton()}>
          <MaterialIcons name="arrow-back-ios-new" size={20} color="#fff" />
        </Pressable>

        <View style={styles.mainLayout}>
          <View style={styles.textBookmark}>
            <Text style={styles.headerText}>
              {Information?.article_header}
            </Text>
            <Pressable onPress={bookmarkNews}>
              {bookmark ? (
                <MaterialIcons name="bookmark" size={32} color="#000" />
              ) : (
                <MaterialIcons name="bookmark-outline" size={32} color="#000" />
              )}
            </Pressable>
          </View>
          <Text style={styles.newsInfo}>
            {parseDate(Information?.article_date_created ?? "")}
          </Text>

          {Information?.article_body_content?.map((detail, index) => (
            <View key={index}>
              {detail.article_body_paragraph?.length == 0 ? null : (
                <View>
                  <Text style={styles.newsText}>
                    {detail.article_body_paragraph}
                  </Text>
                  <Text>{"\n"}</Text>
                </View>
              )}
              {detail.article_image_content_path == null ? null : (
                <View>
                  <Image
                    style={styles.newsImage}
                    source={{ uri: detail.article_image_content_path }}
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
    height: 200,
    zIndex: -5,
  },
  newsImage: {
    flex: 1,
    width: "100%",
    height: 230,
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 10,
    paddingHorizontal: 10.5,
    borderRadius: 40,
    marginVertical: 40,
    marginHorizontal: 25,
  },
  headerText: {
    fontSize: 20,
    marginRight: 10,
    width: "80%",
    fontFamily: "PoppinsBold",
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
    marginBottom: 20,
  },
  newsText: {
    fontFamily: "Poppins",
    fontSize: 12,
    textAlign: "justify",
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
