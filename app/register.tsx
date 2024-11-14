import { Link, Stack } from "expo-router";
import {
  Image,
  SafeAreaView,
  ScrollView,
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

const user = require("@/assets/images/register/human.png");
const phone = require("@/assets/images/register/phone.png");
const lock = require("@/assets/images/register/lock.png");
const emailImage = require("@/assets/images/register/email.png");
const genderImage = require("@/assets/images/register/gender.png");

const genderItems = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

export default function register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");

  const [emailError, setEmailError] = useState("");
  const [pnError, setPnError] = useState("");
  const [passError, setPassError] = useState("");

  const transformInputIntoRequest = () => {
    return JSON.stringify({
      user_email: email,
      user_gender: gender,
      user_name: username,
      user_password: password,
      user_phone_number: phoneNumber,
    });
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePn = () => {
    const pnRegex = /^\d+$/;
    return pnRegex.test(phoneNumber);
  };

  const validatePass = () => {
    return password === confirmPassword;
  };

  const buildAccount = () => {
    const firstTest = validateEmail();
    const secondTest = validatePn();
    const thirdTest = validatePass();

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

    if (!thirdTest) {
      setPassError("Password does not match");
    } else {
      setPassError("");
    }

    if (firstTest && secondTest && thirdTest) {
      const postData = async () => {
        try {
          const response = await fetch("/api/user/register", {
            method: "POST",
            body: transformInputIntoRequest(),
          });
          const json = await response.json();
          
          if (json.success) {
            router.push({ pathname: "/registerSuccess" });
          }
        } catch (error) {
          console.error("Error posting data:", error);
        }
      };
      postData();
    }
  };

  return (
    <SafeAreaView style={styles.baseColor}>
      <View style={styles.mainLayout}>
        <View style={styles.mainRegister}>
          <Text style={styles.headerText}>Register account</Text>
          <Text style={styles.subText}>Create a new account to get started with our services!</Text>
          <RegisterTextField
            placeholderText={"Username"}
            image={user}
            value={username}
            setValue={setUsername}
          />
          <RegisterDropDown
            placeholderText={"Gender"}
            image={genderImage}
            value={gender}
            open={false}
            items={genderItems}
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
          <RegisterTextField
            placeholderText={"Password"}
            image={lock}
            value={password}
            setValue={setPassword}
            secure={true}
          />
          <RegisterTextField
            placeholderText={"Confirm Password"}
            image={lock}
            value={confirmPassword}
            setValue={setConfirmPassword}
            secure={true}
          />
          {passError ? <Text style={styles.error}>{passError}</Text> : null}
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
  },
});
