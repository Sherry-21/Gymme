import { Colors } from "@/constants/Colors";
import { router, useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { eqDetailResultHelper, newsPathHelper } from "@/helper/pathUtils";
import { useState } from "react";

const defaultImage = require("@/assets/images/default/default-logo.jpg");

const BookmarkButton = (props: any) => {
  const [imageError, setImageError] = useState(false);

  const movePage = () => {
    console.log(props.id);
    router.push(eqDetailResultHelper({ muscleId: props.id }) as any);
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
        <Text style={styles.title}>{props.name}</Text>
        <Text style={styles.subText}>{props.subText}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    width: "100%",
    padding: 20,
    backgroundColor: Colors.gymme.background,
    alignItems: "center",
    borderRadius: 15,
    marginBottom: 15,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 5,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: "cover",
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
    fontWeight: "600",
    fontFamily: "Poppins",
    flex: 1,
    marginBottom: 3,
  },
  subText: {
    color: Colors.gymme.placeholder,
    fontSize: 13,
    fontFamily: "Poppins",
  },
  rightContainer: {
    flex: 1,
  },
});

export default BookmarkButton;
