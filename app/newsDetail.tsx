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

export default function NewsDetail() {
  const [bookmark, setBookmark] = useState(false);

  const { newsId } = useLocalSearchParams();

  const backButton = () => {
    router.back();
  };

  const bookmarkNews = () => {
    setBookmark((bookmark) => !bookmark);
  };

  useEffect(() => {
    console.log(newsId);

    return () => {
      console.log("UNMOUNT");
    };
  });

  return (
    <ScrollView style={styles.baseColor}>
      <Image
        style={styles.aboveImage}
        source={require("@/assets/images/newsDetail/test-image.png")}
      ></Image>
      <Pressable style={styles.backgroundArrow} onPress={backButton}>
        <Image
          style={styles.arrowBack}
          source={require("@/assets/images/newsDetail/arrow-back.png")}
        ></Image>
      </Pressable>

      <View style={styles.mainLayout}>
        <View style={styles.textBookmark}>
          <Text style={styles.headerText}>
            Lorem ipsum dolor, sit amet consectetur adipisicing.
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
        <Text style={styles.newsInfo}>24 agustus - dummy</Text>
        <Text style={styles.newsText}>
          {`Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempora voluptatum distinctio qui. Ab velit suscipit quas architecto, facere incidunt fuga rerum corrupti neque? Voluptatibus consectetur quo necessitatibus, perspiciatis odit dolor voluptas, suscipit rerum veniam aspernatur quaerat quos unde quia sit voluptatum inventore illo! Impedit pariatur maxime eum tempora beatae veritatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita, soluta dignissimos. Itaque molestiae molestias delectus facere quibusdam autem voluptatem, exercitationem illo eius porro in mollitia ad accusamus magnam ullam consequatur laudantium sequi qui ratione repellendus quam quis voluptatibus iusto veniam? Quae voluptas ex ratione ab tempore quo aliquam inventore blanditiis. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum ex dignissimos pariatur culpa. A dignissimos quaerat doloremque esse, quisquam beatae asperiores unde dolorem magni fugit eveniet voluptas saepe, illum ipsum adipisci possimus ducimus neque? Minima nemo accusantium eligendi voluptate quo adipisci, magni odit fuga sed cum omnis accusamus ipsa itaque? \n Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatem nulla dolor ad illo at earum odit praesentium, doloremque minus debitis consequuntur, quisquam porro veritatis est perspiciatis iure sunt voluptate modi quaerat, quia corporis laborum. Corrupti, eius rem! Odio, consectetur est, deleniti commodi soluta expedita distinctio, quod sed pariatur fugiat placeat.`}{" "}
        </Text>
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
