import React, { useState, useEffect, useRef } from "react";
import { Text, View, StyleSheet, Image, Pressable } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { Colors } from "@/constants/Colors";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { equipmentHelper, searchResultHelper } from "@/helper/pathUtils";
import { aiSearch } from "./API/searchApi";
import { MaterialIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import Loading from "@/components/loading";
// import base64 from 'react-native-base64';

export default function AiLens() {
  const [hasPermission, setHasPermission]: any = useState(null);
  const [type, setType]: any = useState("back");
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [capturedImage, setCapturedImage]: any = useState(null);
  const cameraRef: any = useRef(null);
  const [source, setSource]: any = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
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
      console.log(result);
      await setCapturedImage(result.assets[0].uri);
    }
    console.log(capturedImage);
  };

  //capture image
  const takePicture = async () => {
    if (cameraRef.current) {
      const options: any = { quality: 1, base64: true, skipProcessing: true };
      const photo: any = await cameraRef.current.takePictureAsync(options);
      await setCapturedImage(photo.uri);
      console.log(capturedImage);
    }
  };

  if (hasPermission === null || hasPermission === false) {
    return;
  }

  const resetImage = () => {
    setCapturedImage("");
  };

  const sendImage = async () => {
    if (!capturedImage) {
      console.error("No image to upload");
      return;
    }
    const formData2 = new FormData();
    formData2.append("file", {
      uri: capturedImage,
      type: "image/jpeg",
      name: "user_image.jpg",
    } as any);
    formData2.append("upload_preset", "gymme_app");
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dmgpda5o7/image/upload",
        {
          method: "POST",
          body: formData2,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const result = await response.json();
      console.log("result : ", result);
      console.log("Public id", result.public_id);
      const finalResult = await aiSearch(result.public_id);
      if (finalResult == null || finalResult.success == false) {
        throw new Error("error");
      }
      const data = finalResult.data;
      setIsLoading(false);
      if (data == null) {
        router.push("/notFound");
      } else {
        router.push(equipmentHelper({ id: data.equipment_id }) as any);
      }
    } catch (e) {
      console.log("error : ", e);
      router.push("/errorPage");
    }
  };

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
              <MaterialIcons name="restart-alt" size={36} color="#000" />
            </Pressable>
            <Pressable style={styles.button} onPress={sendImage}>
              <MaterialIcons name="arrow-forward-ios" size={36} color="#000" />
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.containerButton}>
          <View style={styles.buttonContainer}>
            <Pressable style={styles.buttonGallery} onPress={pickImage}>
              <MaterialIcons name="photo-library" size={48} color="#fff" />
            </Pressable>
            <Pressable style={styles.button} onPress={takePicture}></Pressable>
            <Pressable
              style={styles.button}
              onPress={() => {
                setType(type === "back" ? "front" : "back");
              }}
            >
              <MaterialIcons name="flip-camera-ios" size={36} color="#000" />
            </Pressable>
          </View>
        </View>
      )}

      {isLoading ? <Loading /> : null}
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
    paddingHorizontal: 10,
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
