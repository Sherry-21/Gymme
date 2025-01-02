import React, { useState, useEffect, useRef } from "react";
import { Text, View, StyleSheet, Image, Pressable } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { Colors } from "@/constants/Colors";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { searchResultHelper } from "@/helper/pathUtils";
import { aiSearch } from "./API/searchApi";
import { MaterialIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import axios from "axios";
// import base64 from 'react-native-base64';

export default function AiLens() {
  const [hasPermission, setHasPermission]: any = useState(null);
  const [type, setType]: any = useState("back");
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [capturedImage, setCapturedImage]: any = useState(null);
  const cameraRef: any = useRef(null);
  const [source, setSource]: any = useState(null);

  useEffect(() => {
    (async () => {
      console.log("WKWK");
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
      console.log("CKCKKC", photo.uri);
      console.log(capturedImage);
    }
  };

  if (hasPermission === null || hasPermission === false) {
    return;
  }

  const resetImage = () => {
    setCapturedImage("");
  };

  const base64ToUint8Array = (base64: any) => {
    try {
      const binaryString = Buffer.from(base64, "base64").toString("ascii");
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.toString();
    } catch (err) {
      return null;
    }
  };

  // const convertUriToPngBlob = async (uri: any) => {
  //   try {
  //     const response = await fetch(uri);
  //     console.log("RESPONSE WOI", response);
  //     const result = await response.blob();
  //     console.log("TESTING11", result);
  //     return result;
  //     // Read the file as Base64
  //     // const fileContents = await FileSystem.readAsStringAsync(uri, {
  //     //   encoding: FileSystem.EncodingType.Base64,
  //     // });
  //     // const blob = base64ToUint8Array(fileContents);
  //     // return blob;
  //   } catch (error) {
  //     console.error("Error converting URI to Blob:", error);
  //     throw error;
  //   }
  // };
  const convertUriToPngBlob = async (uri: string): Promise<Blob> => {
    try {
      const response = await fetch(uri);
      const blobDataD = await response.blob();

      return blobDataD;
    } catch (error) {
      console.error("Error converting URI to Blob:", error);
      throw error;
    }
  };
  const sendImage = async () => {
    if (!capturedImage) {
      console.error("No image to upload");
      return;
    }
    const formData2 = new FormData();
    formData2.append('file', {
      uri: capturedImage,
      type: 'image/jpeg',
      name: 'YEYYYYYYYYYY.jpg',
    } as any);
    formData2.append('upload_preset', "gymme_app");
    // data.append('upload_preset', UPLOAD_PRESET);
    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dmgpda5o7/image/upload", {
        method: 'POST',
        body: formData2,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const result = await response.json();
      console.log("response data AAAAAAAAAA : ", result)
      console.log("response : ", response)


    }catch (e){
      console.log("errorr : ", e)
    }
  }



const handleSubmit = () => {
  router.push(
      searchResultHelper({ path: "searchResult", name: "mock" }) as any
  );
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
