import Loading from "@/components/loading";
import { Colors } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { View } from "react-native";
import { getProfileById, postProfileById } from "./API/profileApi";

const ViewProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [height, setHeight] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [description, setDescription] = useState("");

  const [heightTemp, setHeightTemp] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [errorToaster, setErrorToaster] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchProfileData();
    }, [])
  );

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const response = await getProfileById();
      setIsLoading(false);

      if (!response) {
        throw new Error("Error get profile");
      }

      const information = response.data;
      console.log(information);
      setName(information.user_name);
      setGender(information.user_gender == "M" ? "Male" : "Female");
      setEmail(information.user_email);
      setHeightTemp(information.user_height);
      setHeight(`${information.user_height} cm`);
      setPhoneNumber(information.user_phone_number);
      setDescription(information.user_profile_description);
    } catch (error) {
      router.push("/errorPage");
    }
  };

  const backButton = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/other");
    }
  };

  const updateMode = async(flag: boolean) => {
    setIsUpdate(flag);
    if (flag == true) {
      console.log("HIT HERE")
      console.log(heightTemp)
      await setHeight(heightTemp);
    } else {
      await setHeight(`${height} cm`);
    }
  };

  const getPayload = () => {
    const payload = {
      user_name: name,
      user_Email: email,
      user_height: parseInt(height),
      user_phone_number: phoneNumber,
      user_profile_description: description,
    };
    console.log(payload);
    return payload;
  };

  const updateData = async () => {
    try {
      setIsLoading(true);
      const response = await postProfileById(getPayload());
      setIsLoading(false);
      if (!response || response == null) {
        throw new Error("Error get profile");
      }
      setHeightTemp(height);
      setHeight(`${height} cm`);
    } catch (error) {
      setErrorToaster(true);
    } finally {
      setIsUpdate(false);
    }
  };

  const pressedErrorToaster = () => {
    setErrorToaster(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#F39C12" />
      <View style={styles.headerMainContainer}>
        <View style={styles.headerContainer}>
          <Pressable
            style={styles.backgroundArrow}
            onPress={() => backButton()}
          >
            <MaterialIcons name="arrow-back-ios-new" size={24} color="#fff" />
          </Pressable>

          <Text style={styles.headerTitle}>Profile</Text>
        </View>
      </View>

      <View style={styles.mainContainer}>
        <View style={styles.textField}>
          <MaterialIcons style={styles.image} name="person" size={24} />
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder={"name"}
            placeholderTextColor={Colors.gymme.placeholder}
            editable={isUpdate}
            underlineColorAndroid="transparent"
          ></TextInput>
        </View>
        <View style={styles.textField}>
          <MaterialIcons style={styles.image} name="email" size={24} />
          <TextInput
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
            placeholder={"email"}
            placeholderTextColor={Colors.gymme.placeholder}
            editable={isUpdate}
            underlineColorAndroid="transparent"
          ></TextInput>
        </View>
        <View style={styles.textField}>
          <MaterialIcons style={styles.image} name="height" size={24} />
          <TextInput
            style={styles.textInput}
            value={height}
            onChangeText={setHeight}
            placeholder={"height"}
            placeholderTextColor={Colors.gymme.placeholder}
            editable={isUpdate}
            underlineColorAndroid="transparent"
          ></TextInput>
        </View>
        <View style={styles.textField}>
          <MaterialIcons style={styles.image} name="phone" size={24} />
          <TextInput
            style={styles.textInput}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder={"Phone Number"}
            placeholderTextColor={Colors.gymme.placeholder}
            editable={isUpdate}
            underlineColorAndroid="transparent"
          ></TextInput>
        </View>
        <View style={styles.textField}>
          <MaterialIcons style={styles.image} name="male" size={24} />
          <Text style={styles.textInput}>{gender}</Text>
        </View>
        <View style={styles.textFieldDescription}>
          <Text style={styles.textDescription}>Description</Text>
          <TextInput
            style={styles.textInputDescription}
            value={description}
            multiline={true}
            onChangeText={setDescription}
            placeholder={"Enter your profile description"}
            placeholderTextColor={Colors.gymme.placeholder}
            editable={isUpdate}
            underlineColorAndroid="transparent"
          ></TextInput>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.buttonRow}>
          {isUpdate ? (
            <Pressable
              style={styles.buttonCancel}
              onPress={() => updateMode(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.button} onPress={() => updateMode(true)}>
              <Text style={styles.buttonText}>Edit</Text>
            </Pressable>
          )}

          {isUpdate ? (
            <Pressable style={styles.button} onPress={updateData}>
              <Text style={styles.buttonText}>Save</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
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
            <Text style={styles.titleNotFound}>UPDATE FAILED!!</Text>
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerMainContainer: {
    paddingTop: 30,
    paddingBottom: 15,
    marginBottom: 15,
    backgroundColor: Colors.gymme.orange,
  },
  headerContainer: {
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backgroundArrow: {
    position: "absolute",
    borderRadius: 40,
    marginVertical: 30,
    marginHorizontal: 25,
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 24,
    fontFamily: "Poppins",
    fontWeight: "bold",
    color: "white",
  },
  headerTitle: {
    fontSize: 22,
    textAlign: "center",
    fontFamily: "PoppinsBold",
    color: "#fff",
  },

  mainContainer: {
    marginHorizontal: 25,
  },
  textField: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: Colors.gymme.placeholder,
    borderBottomWidth: 2,
    marginBottom: 15,
  },
  textFieldDescription: {},
  textDescription: {
    fontSize: 14,
    alignItems: "center",
    fontFamily: "Poppins",
    marginBottom: 5,
    marginTop: 5,
  },
  textInputDescription: {
    width: "100%",
    height: 120,
    borderWidth: 1,
    borderColor: Colors.gymme.black,
    borderRadius: 15,
    padding: 10,
    fontSize: 12,
    fontFamily: "Poppins",
    textAlignVertical: 'top'
  },
  image: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  textInput: {
    flex: 1,
    padding: 10,
    fontSize: 12,
    marginLeft: 10,
    alignItems: "center",
    fontFamily: "Poppins",
  },

  bottomContainer: {
    flex: 1,
    marginHorizontal: 25,
    justifyContent: "flex-end",
    marginBottom: 40,
  },

  button: {
    width: "45%",
    alignItems: "center",
    padding: 15,
    backgroundColor: Colors.gymme.orange,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  buttonCancel: {
    width: "45%",
    alignItems: "center",
    padding: 15,
    borderColor: Colors.gymme.orange,
    borderWidth: 1,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  buttonText: {
    fontSize: 13,
    fontFamily: "PoppinsBold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
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

export default ViewProfile;
