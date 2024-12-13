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
  TouchableOpacity,
  View,
} from "react-native";
import {getInformationById} from "@/app/API/GetInformationApi";
import {EquipmentPayload} from "@/app/Payload/newsPayloads";
import {parseDate} from "@/app/helper/dateFormatter";
import { deleteBookmarkList, postBookmarkList } from "./API/bookmarkApi";

export default function NewsDetail() {
  const [bookmark, setBookmark] = useState(false);

  const { newsId } = useLocalSearchParams();

  const [InformationData,SetInformationData] = useState(null)

  const [Information,setInformation] = useState<EquipmentPayload|null>(null);

  const [InformationId, SetInformationId]:any = useState(newsId)

  const backButton = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/news');
    }
  };

  const bookmarkNews = async () => {
    setBookmark(!bookmark); 
    if (bookmark == true) {
      const data = await postBookmarkList(parseInt(InformationId));
      console.log(data)
    }
    else {
      const data = await deleteBookmarkList(parseInt(InformationId));
      console.log(data)
    }
  };

  const onclickGetInformation = async ()=>{
    const data = await getInformationById(InformationId)
    if(data == null){
      router.push('/search')
    }
    else{
      setInformation(data.data)
      console.log(Information)
      console.log(Information?.information_body_content)
    }
  }
  
  useEffect(() => {
    onclickGetInformation();
  }, []);

  return (
    <ScrollView style={styles.baseColor}>
      <Image
        style={styles.aboveImage}
        source={require("@/assets/images/newsDetail/test-image.png")}
      ></Image>
      <Pressable style={styles.backgroundArrow} onPress={() => backButton()}>
        <Image
          style={styles.arrowBack}
          source={require("@/assets/images/newsDetail/arrow-back.png")}
        ></Image>
      </Pressable>

      <View style={styles.mainLayout}>
        <View style={styles.textBookmark}>
          <Text style={styles.headerText}>
            {Information?.information_header}
          </Text>
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
        <Text style={styles.newsInfo}>{parseDate(Information?.information_date_created?? '')}</Text>

        {Information?.information_body_content?.map((detail, index) => (
            <View key={index}>
              <Text>{"\n"}</Text>

              <Text style={styles.newsText}> 
                {detail.information_body_paragraph}
              </Text>
              <Text>{"\n"}</Text>

              <Image
                  style={styles.aboveImage}
                  source={{uri: 'https://asset.cloudinary.com/dmgpda5o7/7983957a5ae4489c5b8fda9899c7447d'}}
              ></Image>
              <Text>{"\n"}</Text>

            </View>

            ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  aboveImage: {
    flex: 1,
    width: "100%",
    height: 230,
    zIndex: -5,
  },
  baseColor: {
    backgroundColor: "#fff",
    flex: 1,
  },
  mainLayout: {
    marginHorizontal: 25,
    marginVertical: 30,
  },
  arrowBack: {
    width: 20,
    height: 20,
  },
  backgroundArrow: {
    position: "absolute",
    backgroundColor: "#fff",
    padding: 13,
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
    marginVertical: 5,
  },
  newsText: {
    fontFamily: "Poppins",
    marginTop: 10,
    fontSize: 14,
  },
});
