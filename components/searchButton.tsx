import { Colors } from "@/constants/Colors";
import { equipmentHelper } from "@/helper/pathUtils";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text } from "react-native";

const defaultImage = require("@/assets/images/default/default-logo.jpg");

const SearchButton = (props: any) => {
  const [imageError, setImageError] = useState(false);

  const equipmentPressed = (idEq: number) => {
    router.push(equipmentHelper({ id: idEq }) as any);
  };

  const checkImageUri = async (uri: string) => {
    try {
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error("Image not accessible");
      }
    } catch (error) {
      setImageError(true);
    }
  };

  const isError = () => {
    setImageError(true);
  };

  useEffect(() => {
    if (props.image) {
      checkImageUri(props.image);
    } else {
      setImageError(true);
    }
  }, []);

  return (
    <Pressable
      key={props.id}
      style={styles.box}
      onPress={() => equipmentPressed(props.id)}
    >
      {imageError ? (
        <Image style={styles.image} source={defaultImage}></Image>
      ) : (
        <Image
          style={styles.image}
          source={{
            uri: props.image,
          }}
          onError={isError}
        ></Image>
      )}
      <Text style={styles.textSearch}>{props.name}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 15,
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
    width: 70,
    height: 70,
    marginRight: 10,
  },
  textSearch: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontFamily: "Poppins",
  },
});

export default SearchButton;