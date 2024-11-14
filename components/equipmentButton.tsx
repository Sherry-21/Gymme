import { Colors } from "@/constants/Colors";
import { router, useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { newsPathHelper } from "@/helper/pathUtils";

const EquipmentButton = (props: any) => {
  const route = useRouter();

  const movePage = () => {
    route.push(newsPathHelper({ path: "newsDetail", id: props.id }) as any);
  };

  return (
    <Pressable style={styles.box} onPress={movePage}>
      <Image style={styles.image} source={props.image}></Image>
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
    width: 100,
    height: 100,
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
    fontWeight: "600",
    fontFamily: "Poppins",
    flex: 1,
    marginBottom: 3,
  },
  date: {
    color: Colors.gymme.placeholder,
    fontSize: 12,
    fontFamily: "Poppins",
  },
  rightContainer: {
    flex: 1,
  },
});

export default EquipmentButton;
