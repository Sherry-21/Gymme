import { Link, Stack } from "expo-router";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import RegisterTextField from "@/components/customTextField";
import RegisterDropDown from "@/components/customDropDown";
import ButtonCustom from "@/components/button";
import { useState } from "react";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { userRegister } from "./API/authentication";
import { MaterialIcons } from "@expo/vector-icons";
import Loading from "@/components/loading";
import { setItems } from "./utils/SecureStoreChain";

const user = require("@/assets/images/register/human.png");
const phone = require("@/assets/images/register/phone.png");
const lock = require("@/assets/images/register/lock.png");
const emailImage = require("@/assets/images/register/email.png");
const genderImage = require("@/assets/images/register/gender.png");
const heightImage = require("@/assets/images/register/height.png");

const genderItems = [
  { label: "Male", value: "M" },
  { label: "Female", value: "F" },
];

export default function register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [emailError, setEmailError] = useState("");
  const [pnError, setPnError] = useState("");
  const [heightError, setHeightError] = useState("");
  const [passError1, setPassError1] = useState("");
  const [passError2, setPassError2] = useState("");

  const [errorToaster, setErrorToaster] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePn = () => {
    const pnRegex = /^\d+$/;
    return pnRegex.test(phoneNumber);
  };

  const validateHeight = () => {
    const pnRegex = /^\d+$/;
    return pnRegex.test(height);
  };

  const validatePass = () => {
    return password === confirmPassword;
  };

  const validatePassLength = () => {
    return password.length !== 0;
  };

  const buildAccount = () => {
    const firstTest = validateEmail();
    const secondTest = validatePn();
    const thirdTest = validatePass();
    const fourthTest = validatePassLength();
    const fifthTest = validateHeight();

    if (!firstTest) {
      setEmailError("Wrong email format");
    } else {
      setEmailError("");
    }

    if (!secondTest) {
      setPnError("Must be number only");
    } else {
      setPnError("");
    }

    if (!fourthTest) {
      setPassError1("Password must not be empty");
    } else {
      setPassError1("");
    }

    if (!thirdTest) {
      setPassError2("Password does not match");
    } else {
      setPassError2("");
    }

    if (!fifthTest) {
      setHeightError("Must be number only");
    } else {
      setHeightError("");
    }

    const getPayload = () => {
      const payload = {
        user_email: email,
        user_gender: gender,
        user_name: username,
        user_height: parseInt(height, 10),
        user_password: password,
        user_phone_number: phoneNumber,
      };
      return payload;
    };

    if (firstTest && secondTest && thirdTest && fourthTest && fifthTest) {
      const postData = async () => {
        try {
          setIsLoading(true);
          const response = await userRegister(getPayload());
          setIsLoading(false);
          if (response == null || response.success == false) {
            throw new Error("Failed to register");
          } else {
            await setItems("itemKey", response.token);
            router.push("/registerSuccess");
          }
        } catch (error) {
          console.error("Error posting data:", error);
          setErrorToaster(true);
        }
      };
      postData();
    }
  };

  const pressedErrorToaster = () => {
    setErrorToaster(false);
  };

  return (
    <SafeAreaView style={styles.baseColor}>
      <View style={styles.mainLayout}>
        <View style={styles.mainRegister}>
          <Text style={styles.headerText}>Register account</Text>
          <Text style={styles.subText}>
            Create a new account to get started with our services!
          </Text>
          <RegisterTextField
            placeholderText={"Username"}
            image={user}
            value={username}
            setValue={setUsername}
          />
          <RegisterTextField
            placeholderText={"Email"}
            image={emailImage}
            value={email}
            setValue={setEmail}
          />
          {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
          <RegisterTextField
            placeholderText={"Phone Number"}
            image={phone}
            value={phoneNumber}
            setValue={setPhoneNumber}
          />
          {pnError ? <Text style={styles.error}>{pnError}</Text> : null}
          <RegisterDropDown
            placeholderText={"Gender"}
            image={genderImage}
            value={gender}
            setValue={setGender}
            open={false}
            items={genderItems}
          />
          <RegisterTextField
            placeholderText={"Height (cm)"}
            image={heightImage}
            value={height}
            setValue={setHeight}
          />
          {heightError ? <Text style={styles.error}>{heightError}</Text> : null}
          <RegisterTextField
            placeholderText={"Password"}
            image={lock}
            value={password}
            setValue={setPassword}
            secure={true}
          />
          {passError1 ? <Text style={styles.error}>{passError1}</Text> : null}
          <RegisterTextField
            placeholderText={"Confirm Password"}
            image={lock}
            value={confirmPassword}
            setValue={setConfirmPassword}
            secure={true}
          />
          {passError2 ? <Text style={styles.error}>{passError2}</Text> : null}
        </View>

        <ButtonCustom
          parent={buildAccount}
          width={258}
          padding={15}
          text={"Register"}
        />

        <View style={styles.bottomText}>
          <Text>Already have an account? </Text>
          <Link href="/">
            <Text style={styles.link}>Login here</Text>
          </Link>
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
            <Text style={styles.titleNotFound}>REGISTER FAILED!!</Text>
            <Text style={styles.subheaderText}>
              Please try again later
            </Text>
            <Pressable
              onPress={() => pressedErrorToaster()}
              style={styles.toasterContent}
            >
              <Text style={styles.errorText}>Understand</Text>
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  baseColor: {
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
  },
  mainLayout: {
    marginHorizontal: 25,
    marginVertical: 40,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  registerLogo: {
    resizeMode: "contain",
    width: 200,
    height: 200,
  },
  mainRegister: {
    width: "100%",
    marginBottom: 40,
  },
  headerText: {
    fontSize: 23,
    fontWeight: "bold",
    fontFamily: "Poppins",
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    fontFamily: "Poppins",
    marginBottom: 25,
  },
  bottomText: {
    flexDirection: "row",
    marginTop: 5,
  },
  link: {
    textDecorationLine: "underline",
    textDecorationColor: Colors.gymme.blue,
    color: Colors.gymme.blue,
  },
  error: {
    fontSize: 12,
    color: Colors.gymme.red,
    marginBottom: 5,
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
});
