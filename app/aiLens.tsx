import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image, Pressable } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { Colors } from '@/constants/Colors';
import * as ImagePicker from 'expo-image-picker';

const gallery = require('@/assets/images/search/gallery.png')
const next = require('@/assets/images/search/next.png')
const reset = require('@/assets/images/search/reset.png')
const flip = require('@/assets/images/search/flip.png')

export default function AiLens() {
  const [hasPermission, setHasPermission]:any = useState(null);
  const [type, setType]:any = useState('back');
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [capturedImage, setCapturedImage]:any = useState(null);
  const cameraRef:any = useRef(null);
  const [source, setSource]:any = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const onCameraReady = () => {
    setIsCameraReady(true)
  }

  const pickImage = async () => {
    // const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    // if (permissionResult.granted === false) {
    //   alert("You've refused to allow this app to access your photos!");
    //   return;
    // }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1,1],
      quality: 1
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const type = result.assets[0].mimeType;
      const name = result.assets[0].fileName;
      setSource({uri, type, name});
      setCapturedImage(result.assets[0].uri);
      console.log(source)
    }
  };

  //capture image
  const takePicture = async () => {
    if (cameraRef.current) {
      const options:any = { quality: 1, base64: true, skipProcessing: true };
      const photo:any = await cameraRef.current.takePictureAsync(options);
      const type = 'image/png';
      const name = 'snap photo';
      const uri = photo.uri;
      setSource({uri, type, name});
      setCapturedImage(photo.uri);
    }
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const resetImage = () => {
    setCapturedImage('')
  }

  const sendImage = async () => {
    const { uri, type, name } = source;

    const formData = new FormData();
    formData.append('file', {
      uri: uri,
      type: type,
      name: name
    } as  any);
    formData.append('upload_preset', 'gymme_app')
    formData.append('cloud_name', 'dmgpda5o7')
    
    const response = await fetch(`https://api.cloudinary.com/v1_1/dmgpda5o7/image/upload`, {
      method: 'POST',
      body: formData,
    })
    
    const result = await response.json();

    console.log(source)
    console.log(result)
  }

  return (
    <View style={styles.container}>
      {capturedImage ? 
      (
        <Image source={{ uri: capturedImage }} style={styles.capturedImage}/>
      ) 
      :  
      (
        <CameraView
          ref={cameraRef} 
          style={styles.camera}
          facing={type}
          onCameraReady={onCameraReady}
        >
        </CameraView>
      )}

      {capturedImage ? 
      (
      <View style={styles.containerButton}>
        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.button}
            onPress={resetImage}
          >
            <Image source={reset} style={styles.logo}></Image>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={sendImage}
          >
            <Image source={next} style={styles.logo}></Image>
          </Pressable>
        </View>
      </View>
      )
      :
      (
      <View style={styles.containerButton}>
        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.buttonGallery}
            onPress={pickImage}
          >
            <Image source={gallery} style={styles.logo}></Image>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={takePicture}
          >
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => {
              setType(
                type === 'back'
                  ? 'front'
                  : 'back'
              );
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
    backgroundColor: Colors.gymme.background
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',

    alignItems: 'center',
  },
  button: {
    width: 70, 
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 35,
    marginHorizontal: 20,
  },
  buttonGallery: {
    width: 70, 
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 35,
    marginHorizontal: 20,
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
  containerButton: {
    width: '100%',
    position: 'absolute',
    bottom: 0
  },
  logo : {
    width: 40,
    height: 40
  }
});
