import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Modal, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getProfileById } from '../API/profileApi';
import { router } from 'expo-router';
import { postTimer } from '../API/timerApi';
import { getLatest, postWeight } from '../API/weightApi';

export default function ProfilePage (){
  const [userId, setUserId] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [weight, setWeight] = useState<string>('-');
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [updatedWeight, setUpdatedWeight] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getProfileById();
        const response2 = await getLatest();

        const { userId, gender, age, currentWeight } = response.data;
        const data2 = response2.data

        setUserId(userId);
        setGender(gender);
        setAge(age);
        setWeight(data2.user_weight ? data2.user_weight.toString() : '-');
        
        setIsLoading(false);

      } catch (error) {
        console.error('Error fetching profile:', error);
        
        if (axios.isAxiosError(error)) {
          if (error.response) {
            Alert.alert('Error', error.response.data.message || 'Server error');
          } else if (error.request) {
            Alert.alert('Error', 'No response from server');
          } else {
            Alert.alert('Error', 'Unable to send request');
          }
        } else {
          Alert.alert('Error', 'An unexpected error occurred');
        }
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const formatDateToIsoString = (date: Date): string => {
    return date.toISOString();
  };

  const formatDateToIndonesian = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Jakarta',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour12: false
    };
  
    const formatter = new Intl.DateTimeFormat('en-GB', options);
    return formatter.format(date);
  };


  const handleWeightInput = (value: string) => {
    const formattedValue = value.replace(/[^0-9.]/g, '');
    const decimalCount = (formattedValue.match(/\./g) || []).length;
    if (decimalCount > 1) return;

    if (formattedValue.startsWith('.')) {
      setUpdatedWeight(`0${formattedValue}`);
      return;
    }

    if (formattedValue.includes('.')) {
      const [whole, decimal] = formattedValue.split('.');
      if (decimal && decimal.length > 2) return;
    }

    setUpdatedWeight(formattedValue);
  };

  const getPayload = () => {
    const payload = {
      user_weight: parseInt(updatedWeight, 10),
      user_weight_time: formatDateToIsoString(new Date())
    }
    return payload
  };

  const handleUpdateWeight = async () => {
    if (!updatedWeight) {
      Alert.alert('Error', 'Please enter a weight');
      return;
    }

    const weightValue = parseFloat(updatedWeight);
    if (isNaN(weightValue) || weightValue <= 0) {
      Alert.alert('Error', 'Please enter a valid weight');
      return;
    }

    try {
      const response = await postWeight(getPayload())

      console.log(response.data);

      await setWeight(updatedWeight);
      
      setShowUpdateModal(false);
      setUpdatedWeight('');
    } catch (error) {
      console.error('Error updating weight:', error);
      Alert.alert('Error', 'Unable to update weight');
    }
  };

  const goToTimerList = () => {
    router.push('/timerList')
  }

  const goToCalendar = () => {
    router.push('/CalenderScreen')
  }

  const moveToWeightHistory = () => {
    router.push('/viewWeightHistory')
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome, </Text>
          <Text style={styles.name}>{userId || 'User'}</Text>
        </View>
        <View style={styles.userInfo}>
          <AntDesign name="man" size={16} color="#fff" />
          <Text style={styles.userInfoText}>
            ({gender || '-'}) - {age || '-'} Years old
          </Text>
        </View>
        </View>
      </View>

     <View style={styles.containerContent}>

      {/* Weight Section */}
      <View style={styles.weightCard}>
          <View>
            <Text style={styles.weightTitle}>Current Weight</Text>
            <Text style={styles.weightInfo}>
              {weight} kg - ( {formatDateToIndonesian(new Date())} )
            </Text>
            <Pressable onPress={() => moveToWeightHistory()}>
              <Text style={styles.weightHistory}>View weight history</Text>
            </Pressable>  
          </View>
          <Pressable
            style={styles.updateButton}
            onPress={() => setShowUpdateModal(true)}
          >
            <Text style={styles.updateButtonText}>Update</Text>
          </Pressable>
        </View>

      {/* Other Features Section */}
      <Text style={styles.sectionTitle}>Other Feature</Text>
      <View style={styles.otherFeatures}>
        <View style={styles.featureCard}>
          <Text style={styles.featureText}>Workout calendar</Text>
          <AntDesign name="calendar" size={40} color="#000" />
          <Pressable style={styles.featureButton} onPress={goToCalendar}>
            <Text style={styles.featureButtonText}>View</Text>
          </Pressable>
        </View>
        <View style={styles.featureCard}>
          <Text style={styles.featureText}>Workout timer</Text>
          <AntDesign name="clockcircleo" size={40} color="#000" />
          <Pressable style={styles.featureButton} onPress={goToTimerList}>
            <Text style={styles.featureButtonText}>View</Text>
          </Pressable>
        </View>
      </View>

      <Modal 
        visible={showUpdateModal} 
        animationType="slide" 
        transparent={true}
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { position: 'absolute', bottom: 0 }]}>
            <Pressable 
              style={styles.modalCloseButton}
              onPress={() => setShowUpdateModal(false)}
            >
              <AntDesign name="close" size={24} color="#333" />
            </Pressable>

            <Text style={styles.modalTitle}>Update Your Weight</Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.weightInput}
                value={updatedWeight}
                onChangeText={handleWeightInput}
                keyboardType="decimal-pad"
                placeholder="Enter new weight"
                placeholderTextColor="#999"
                maxLength={6} // Limit total length
              />
              <Text style={styles.unitText}>kg</Text>
            </View>

            <View style={styles.buttonContainer}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setShowUpdateModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.updateButtonModal]}
                onPress={handleUpdateWeight}
              >
                <Text style={styles.updateButtonTextModal}>Update Weight</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      </View>  
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#FFA500',
    padding: 20,
    paddingLeft: 30,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    marginBottom: 20,
  },
  headerContent:{
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  welcomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textDecorationLine: 'underline',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  userInfoText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 5,
  },
  containerContent: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  weightCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  weightTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  weightInfo: {
    fontSize: 14,
    marginBottom: 5,
  },
  weightHistory: {
    fontSize: 14,
    color: '#0000FF',
    textDecorationLine: 'underline',
    zIndex: 10
  },
  updateButton: {
    backgroundColor: '#FFA500',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  updateButtonText: {
    color: '#000000',
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  otherFeatures: {
    marginTop: 10,
  },
  featureCard: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  featureText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  featureButton: {
    backgroundColor: '#FFA500',
    paddingHorizontal: 21,
    paddingVertical: 5,
    borderRadius: 15,
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  featureButtonText: {
    color: '#000000',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end', // Changed from center to flex-end
  },
  modalContent: {
    width: '100%', // Changed from 85% to full width
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0, // Remove bottom radius
    borderBottomRightRadius: 0, // Remove bottom radius
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4, // Changed to negative value for top shadow
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#f4f4f4',
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  weightInput: {
    flex: 1,
    height: 50,
    fontSize: 18,
    color: '#333',
  },
  unitText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  updateButtonModal: {
    flex: 1,
    backgroundColor: '#FFA500',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  updateButtonTextModal: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});