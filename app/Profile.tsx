import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Modal, StyleSheet, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define interface for weight entry
interface WeightEntry {
  date: string;
  weight: number;
}

// Define interface for user profile
interface UserProfile {
  userId: string;
  gender: string;
  age: string;
  currentWeight: number;
}

export default function ProfilePage (){
  const [userId, setUserId] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [weight, setWeight] = useState<string>('-');
  const [dailyWeights, setDailyWeights] = useState<WeightEntry[]>([]);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [updatedWeight, setUpdatedWeight] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Get token from AsyncStorage
        const token = await AsyncStorage.getItem('userToken');

        // Fetch profile data
        const response = await axios.get<UserProfile>('/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const { userId, gender, age, currentWeight } = response.data;

        // Update state
        setUserId(userId);
        setGender(gender);
        setAge(age);
        setWeight(currentWeight ? currentWeight.toString() : '-');

        // Fetch daily weights
        const weightsResponse = await axios.get<WeightEntry[]>('/daily-weights', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setDailyWeights(weightsResponse.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        
        // More detailed error handling
        if (axios.isAxiosError(error)) {
          if (error.response) {
            // The request was made and the server responded with a status code
            Alert.alert('Error', error.response.data.message || 'Server error');
          } else if (error.request) {
            // The request was made but no response was received
            Alert.alert('Error', 'No response from server');
          } else {
            // Something happened in setting up the request
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

  // Format date to Indonesian format
  const formatDateToIndonesian = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    };
    return date.toLocaleDateString('id-ID', options);
  };

  // Validate weight input to only accept float values
  const handleWeightInput = (value: string) => {
    // Remove any non-numeric characters except decimal point
    const formattedValue = value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const decimalCount = (formattedValue.match(/\./g) || []).length;
    if (decimalCount > 1) return;

    // If it starts with a decimal point, add a leading zero
    if (formattedValue.startsWith('.')) {
      setUpdatedWeight(`0${formattedValue}`);
      return;
    }

    // Limit to 2 decimal places
    if (formattedValue.includes('.')) {
      const [whole, decimal] = formattedValue.split('.');
      if (decimal && decimal.length > 2) return;
    }

    setUpdatedWeight(formattedValue);
  };

  // Handle weight update
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
      await axios.post('https://your-api.com/update-weight', 
        { weight: weightValue },
        {
          headers: {
            'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`
          }
        }
      );

      // Update local state
      setWeight(updatedWeight);
      
      // Add to daily weights with explicit type
      const newWeightEntry: WeightEntry = {
        date: new Date().toISOString(),
        weight: weightValue
      };
      
      setDailyWeights(prevWeights => [newWeightEntry, ...prevWeights]);
      setShowUpdateModal(false);
      setUpdatedWeight('');
    } catch (error) {
      console.error('Error updating weight:', error);
      Alert.alert('Error', 'Unable to update weight');
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
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
              {weight} kg - ({formatDateToIndonesian(new Date())})
            </Text>
            <Pressable onPress={() => {/* Navigate to weight history */}}>
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
          <Pressable style={styles.featureButton}>
            <Text style={styles.featureButtonText}>View</Text>
          </Pressable>
        </View>
        <View style={styles.featureCard}>
          <Text style={styles.featureText}>Workout timer</Text>
          <AntDesign name="clockcircleo" size={40} color="#000" />
          <Pressable style={styles.featureButton}>
            <Text style={styles.featureButtonText}>View</Text>
          </Pressable>
        </View>
      </View>

      {/* Update Weight Modal */}
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

// export default ProfilePage;
