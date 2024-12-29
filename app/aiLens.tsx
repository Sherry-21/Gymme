import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { Camera, CameraView } from "expo-camera";
import { Colors } from "@/constants/Colors";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { searchResultHelper } from "@/helper/pathUtils";
import { aiSearch } from "./API/searchApi";

const gallery = require("@/assets/images/search/gallery.png");
const next = require("@/assets/images/search/next.png");
const reset = require("@/assets/images/search/reset.png");
const flip = require("@/assets/images/search/flip.png");

export default function AiLens() {
  const [hasPermission, setHasPermission]: any = useState(null);
  const [type, setType]: any = useState("back");
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [capturedImage, setCapturedImage]: any = useState(null);
  const cameraRef: any = useRef(null);
  const [source, setSource]: any = useState(null);

  useEffect(() => {
    (async () => {
      console.log("WKWK")
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const onCameraReady = () => {
    setIsCameraReady(true);
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result)
      await setCapturedImage(result.assets[0].uri);
    }
    console.log(capturedImage)
  };

  //capture image
  const takePicture = async () => {
    if (cameraRef.current) {
      const options: any = { quality: 1, base64: true, skipProcessing: true };
      const photo: any = await cameraRef.current.takePictureAsync(options);
      await setCapturedImage(photo.uri);
      console.log(capturedImage)
    }
  };

  if (hasPermission === null || hasPermission === false) {
    return;
  }

  const resetImage = () => {
    setCapturedImage("");
  };

  const convertUriToPngBlob = async (uri: any) => {
    const response = await fetch(uri);
    const result = response.blob();
    return result;
  };

  const sendImage = async () => {
    console.log("WKWKW OWI")

    const formData = new FormData();
    formData.append("file", await convertUriToPngBlob(capturedImage));
    formData.append("upload_preset", "gymme_app");
    formData.append("cloud_name", "dmgpda5o7");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dmgpda5o7/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      console.log(result)
      //send data to backend -> secureURL to get String of eq data
      //add 1 variabel to store the data

      const responseSearch = await aiSearch(result.public_id);
      console.log(responseSearch)
      // handleSubmit()
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const handleSubmit = () => {
    router.push(searchResultHelper({path:"searchResult", name:"mock"}) as any)
  }

  return (
    <View style={styles.container}>
      {capturedImage ? (
        <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
      ) : (
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={type}
          onCameraReady={onCameraReady}
        ></CameraView>
      )}

      {capturedImage ? (
        <View style={styles.containerButton}>
          <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={resetImage}>
              <Image source={reset} style={styles.logo}></Image>
            </Pressable>
            <Pressable style={styles.button} onPress={sendImage}>
              <Image source={next} style={styles.logo}></Image>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.containerButton}>
          <View style={styles.buttonContainer}>
            <Pressable style={styles.buttonGallery} onPress={pickImage}>
              <Image source={gallery} style={styles.logo}></Image>
            </Pressable>
            <Pressable style={styles.button} onPress={takePicture}></Pressable>
            <Pressable
              style={styles.button}
              onPress={() => {
                setType(type === "back" ? "front" : "back");
              }}
            >
              <Image source={flip} style={styles.logo}></Image>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gymme.background,
  },
  camera: {
    flex: 1,
  },
  capturedImage: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    paddingVertical: 40,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    zIndex: 5,
    flexDirection: "row",
    justifyContent: "space-between",

    alignItems: "center",
  },
  button: {
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 35,
    marginHorizontal: 20,
  },
  buttonGallery: {
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 35,
    marginHorizontal: 20,
  },
  text: {
    fontSize: 20,
    color: "black",
  },
  containerButton: {
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  logo: {
    width: 40,
    height: 40,
  },
});
