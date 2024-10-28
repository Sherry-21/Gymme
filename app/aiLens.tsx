import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Camera, CameraView } from 'expo-camera';

export default function AiLens() {
  const [hasPermission, setHasPermission]:any = useState(null);
  const [type, setType]:any = useState('back');
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [capturedImage, setCapturedImage]:any = useState(null);
  const cameraRef:any = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const onCameraReady = () => {
    setIsCameraReady(true)
  }

  // Capture a photo
  const takePicture = async () => {
    if (cameraRef.current) {
      const options:any = { quality: 0.5, base64: true, skipProcessing: true };
      const photo:any = await cameraRef.current.takePictureAsync(options);
      setCapturedImage(photo.uri);
      console.log('Captured photo URI:', photo.uri);
    }
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {capturedImage ? (
        // If an image has been captured, show it in the Image component
        <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
      ) : (
        // Otherwise, show the camera view
        <CameraView
          ref={cameraRef} 
          style={styles.camera}
          facing={type}
          onCameraReady={onCameraReady}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setType(
                  type === 'back'
                    ? 'front'
                    : 'back'
                );
              }}
            >
              <Text style={styles.text}> Flip </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={takePicture}
            >
              <Text style={styles.text}> Snap </Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  capturedImage: {
    flex: 1,
    resizeMode: 'contain',
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  text: {
    fontSize: 18,
    color: 'black',
  },
});
