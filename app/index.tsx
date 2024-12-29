import { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  StatusBar,
  SafeAreaView,
  Pressable,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import LoginTextField from "@/components/customTextField";
import ButtonCustom from "@/components/button";
import { Link } from "expo-router";
import { Colors } from "@/constants/Colors";
import create_server from "@/helper/createServer";
import { router } from "expo-router";
import { getSecureItem, saveSecureItem } from "@/app/utils/SessionKeyChain";
import { getItems, setItems } from "@/app/utils/SecureStoreChain";
import { userLogin } from "./API/authentication";
import { MaterialIcons } from "@expo/vector-icons";
import Loading from "@/components/loading";

SplashScreen.preventAutoHideAsync();

const lock = require("@/assets/images/login/lock.png");
const emailImage = require("@/assets/images/login/email.png");

export default function App() {

  const [appIsReady, setAppIsReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorToaster, setErrorToaster] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passError, setPassError] = useState("");

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync(Entypo.font);
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const getPayload = () => {
    const payload = {
      user_email: email,
      user_password: password,
    };
    return payload;
  };

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassLength = () => {
    return password.length !== 0;
  }

  const validateAccount = async () => {
    const firstTest = validateEmail();
    const secondTest = validatePassLength();

    const postData = async () => {
      try {
        setIsLoading(true)
        const response = await userLogin(getPayload());
        setIsLoading(false)
        if (response == null || response.success == false) {
          throw new Error("Invalid login credentials");
        } else {
          await setItems("itemKey", response.token);
        }

        router.push('/test')
      } catch (error) {
        setErrorToaster(true);
      }
    };

    if (!firstTest) {
      setEmailError("Wrong email format");
    } else {
      setEmailError("");
    }

    if (!secondTest) {
      setPassError("Password must not be empty");
    } else {
      setPassError("")
    }

    if(firstTest && secondTest) {
      postData();
    }
  };

  const pressedErrorToaster = () => {
    setErrorToaster(false);
  };

  return (
    <SafeAreaView style={styles.baseColor} onLayout={onLayoutRootView}>
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor="white"
        hidden={false}
      />
      <View style={styles.mainLayout}>
        <Image
          style={styles.loginLogo}
          source={require("@/assets/images/login/login logo.svg")}
        />

        <View style={styles.mainLogin}>
          <Text style={styles.headerText}> Login Screen </Text>
          <LoginTextField
            placeholderText={"Email"}
            image={emailImage}
            value={email}
            setValue={setEmail}
          />
          {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
          <LoginTextField
            placeholderText={"Password"}
            image={lock}
            value={password}
            setValue={setPassword}
            secure={true}
          />
          {passError ? <Text style={styles.error}>{passError}</Text> : null}
        </View>

        <ButtonCustom
          parent={validateAccount}
          width={258}
          padding={15}
          text={"Login"}
        />

        <View style={styles.bottomText}>
          <Text>Don’t have an account? </Text>
          <Link href="/register">
            <Text style={styles.link}>Register here</Text>
          </Link>
        </View>
      </View>
      {
        isLoading? (<Loading/>) : null
      }
      {errorToaster && (
        <View style={styles.errorToaster}>
          <View style={styles.errorBox}>
            <MaterialIcons
              style={styles.icon}
              name="error"
              size={50}
              color="#F39C12"
            />
            <Text style={styles.titleNotFound}>NOT FOUND!!</Text>
            <Text style={styles.subheaderText}>
              Please input a valid credential
            </Text>
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
  loginLogo: {
    resizeMode: "contain",
    width: 250,
    height: 250,
  },
  mainLogin: {
    marginTop: 25,
    width: "100%",
    marginBottom: 40,
  },
  headerText: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Poppins",
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
    width: '70%',
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
    marginBottom: 5
  },
});
