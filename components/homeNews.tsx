import { Colors } from "@/constants/Colors";
import { router, useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { newsPathHelper } from "@/helper/pathUtils";
import { useEffect, useState } from "react";

const defaultImage = require("@/assets/images/default/default-logo.jpg");

const NewsButton = (props: any) => {
  const [imageError, setImageError] = useState(false);

  const movePage = () => {
    router.push(newsPathHelper({ path: "newsDetail", id: props.id }) as any);
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

  const convertDate = (dateString:string) => {
    console.log(dateString)
    const date = new Date(dateString);
    
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
    const day = date.getUTCDate();
    const month = monthNames[date.getUTCMonth()];
    const year = date.getUTCFullYear();
    
    const formattedDate = `${day} ${month} ${year}`;

    return formattedDate;
  }

  useEffect(() => {
    if (props.image) {
      checkImageUri(props.image);
    } else {
      setImageError(true);
    }
  }, [])

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
        <Text style={styles.date}>{convertDate(props.date)}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    flex : 1,
    width: "100%",
    padding: 15,
    backgroundColor: Colors.gymme.background,
    alignItems: "center",
    borderRadius: 15,
    marginBottom: 15,
    shadowOpacity: 0.25,
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
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
    fontSize: 12,
    fontFamily: "Poppins",
    marginBottom: 2,
  },
  date: {
    color: Colors.gymme.placeholder,
    fontSize: 10,
    fontFamily: "Poppins",
  },
  rightContainer: {
    width: "70%",
    justifyContent: 'center',
  },
});

export default NewsButton;
