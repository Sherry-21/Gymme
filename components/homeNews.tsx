import { Colors } from "@/constants/Colors";
import { router, useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { newsPathHelper } from "@/helper/pathUtils";
import { useState } from "react";

const defaultImage = require("@/assets/images/default/default-logo.jpg");

const NewsButton = (props: any) => {
  const [imageError, setImageError] = useState(false);

  const movePage = () => {
    router.push(newsPathHelper({ path: "newsDetail", id: props.id }) as any);
  };

  const isError = () => {
    console.log("error bos")
    setImageError(true);
  };
  
  return (
    <Pressable style={styles.box} onPress={movePage}>
      {imageError ? (
        <Image
          style={styles.image}
          source={defaultImage}
        ></Image>
      ) : (
        <Image
          style={styles.image}
          source={{
            uri: props.image,
          }}
          onError={isError}
        ></Image>
      )}
      <View style={styles.rightContainer}>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.date}>{props.date}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    width: "100%",
    padding: 15,
    backgroundColor: Colors.gymme.background,
    alignItems: "center",
    borderRadius: 15,
    marginBottom: 15,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 5,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginRight: 15,
  },
  textInput: {
    padding: 10,
    fontSize: 14,
    alignItems: "center",
    fontFamily: "Poppins",
    width: "100%",
  },
  title: {
    fontSize: 15,
    // fontWeight: "bold",
    fontFamily: "PoppinsBold",
    marginBottom: 3,
  },
  date: {
    color: Colors.gymme.placeholder,
    fontSize: 12,
    fontFamily: "Poppins",
  },
  rightContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default NewsButton;
