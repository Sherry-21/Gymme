import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  StatusBar,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { deleteTimer, getTimer, postTimer } from "./API/timerApi";
import { router, useFocusEffect } from "expo-router";
import { Colors } from "@/constants/Colors";
import { timerHelper } from "@/helper/pathUtils";
import Loading from "@/components/loading";

const TimerList: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [predefinedTimers, setPredefinedTimers]: any = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTimers();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTimers();
    }, [])
  );

  const fetchTimers = async () => {
    try {
      setIsLoading(true);
      const response = await getTimer();
      setIsLoading(false);
      if(response == null || response.success == false) {
        throw new Error("data not found")
      }
      setPredefinedTimers(response.data);
    } catch (error) {
      router.push("/errorPage");
    }
  };

  const handleTimerSelect = (timer_id: number) => {
    router.push(timerHelper({ path: "Timer", id: timer_id.toString() }) as any);
  };

  const handleAddTimer = async () => {
    if (!name.trim() || !description.trim()) {
      Alert.alert(
        "Invalid Input",
        "Please enter both timer name and description"
      );
      return;
    }

    try {
      const newTimer = {
        timer_name: name,
        timer_description: description,
      };
      console.log(newTimer)
      setShowAddModal(false);
      setIsLoading(true);
      const response = await postTimer(newTimer);
      console.log(response)
      setIsLoading(false);

      const addedTimer = response.data;
      console.log(addedTimer);
      const updatedTimers: any = [...predefinedTimers, addedTimer];

      setPredefinedTimers(updatedTimers);

      console.log(predefinedTimers);
      setName("");
      setDescription("");
    } catch (error) {
      console.error("Error adding timer:", error);
      Alert.alert("Error", "Failed to add timer. Please try again.");
    }
  };

  const handleDeleteTimer = async (timer_id: number) => {
    try {
      setIsLoading(true);
      const response = await deleteTimer(timer_id);
      setIsLoading(false);
      if (response == null) {
        return;
      }
      const updatedTimers = predefinedTimers.filter(
        (t: any) => t.timer_id !== timer_id
      );
      setPredefinedTimers(updatedTimers);
    } catch (error) {
      console.error("Error deleting timer:", error);
      Alert.alert("Error", "Failed to delete timer");
    }
  };

  const backButton = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/other");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.headerMainContainer}>
        <View style={styles.headerContainer}>
          <Pressable style={styles.backgroundArrow} onPress={() => backButton()}>
            <MaterialIcons name="arrow-back-ios-new" size={24} color="#fff" />
          </Pressable>

          <Text style={styles.headerTitle}>Timer List</Text>
        </View>
      </View>


      {predefinedTimers == null || predefinedTimers.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>No timers created yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Tap '+' to create your first timer
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.timerListContainer}
          showsVerticalScrollIndicator={false}
        >
          {predefinedTimers?.map((timer: any, index: number) => (
            <View key={index} style={styles.timerItemContainer}>
              <Pressable
                style={styles.timerItem}
                onPress={() => handleTimerSelect(timer.timer_id)}
              >
                <View style={styles.timerItemContent}>
                  <Text style={styles.timerName}>{timer.timer_name}</Text>
                  <Text style={styles.timerDescription}>
                    {timer.timer_description}
                  </Text>
                </View>
                <Pressable
                  style={styles.deleteButton}
                  onPress={() => handleDeleteTimer(timer.timer_id)}
                >
                  <AntDesign name="delete" size={20} color="#ff0000" />
                </Pressable>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.addButtonContainer}>
        <Pressable
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <MaterialIcons name="add-circle" size={60} color="#F39C12" />
        </Pressable>
        <Text style={styles.addButtonText}>Add</Text>
      </View>

      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Timer</Text>
            <TextInput
              placeholder="Timer name"
              style={styles.modalInput}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              placeholder="Description"
              style={styles.modalInput}
              value={description}
              onChangeText={setDescription}
            />
            <View style={styles.modalButtonContainer}>
              <Pressable
                onPress={() => setShowAddModal(false)}
                style={styles.modalCancelButton}
              >
                <Text style={{textAlign: 'center', fontFamily: "Poppins"}}>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleAddTimer} style={styles.modalAddButton}>
                <Text style={{ color: "white", fontFamily: "Poppins", textAlign: 'center'}}>
                  Add
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {isLoading ? <Loading /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerMainContainer: {
    paddingTop: 30,
    paddingBottom: 15,
    marginBottom: 15,
    backgroundColor: Colors.gymme.orange,
  },
  headerContainer: {
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backgroundArrow: {
    position: "absolute",
    borderRadius: 40,
    marginVertical: 30,
    marginHorizontal: 25,
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 24,
    fontFamily: "Poppins",
    fontWeight: "bold",
    color: "white",
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "PoppinsBold",
    color: "white",
    textAlign: "center",
  },
  timerListContainer: {
    paddingHorizontal: 25,
    paddingBottom: 120,
  },
  timerItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  timerItem: {
    flexDirection: "row",
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  timerItemContent: {
    flex: 1,
    justifyContent: "center",
  },
  timerName: {
    fontSize: 16,
    fontFamily: "Poppins",
    color: "#000",
  },
  timerDescription: {
    fontSize: 12 ,
    fontFamily: "Poppins",
    color: "#666",
  },
  deleteButton: {
    justifyContent: "center",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  emptyStateText: {
    fontSize: 18,
    color: "#333",
    marginBottom: 5,
    fontFamily: "PoppinsBold",
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Poppins",
  },
  addButtonContainer: {
    position: "absolute",
    bottom: 30,
    right: 30,
    alignItems: "center",
  },
  addButton: {
    borderRadius: 50,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  addButtonText: {
    color: "#F39C12",
    marginTop: 0,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  iconBackground: {
    backgroundColor: "#fff",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    margin: 20,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
    fontFamily: "PoppinsBold"
  },
  modalInput: {
    borderColor: "#D1D5DB",
    borderWidth: 1,
    padding: 10,
    fontSize: 14,
    width: "100%",
    borderRadius: 8,
    marginBottom: 10,
    fontFamily: "Poppins",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalCancelButton: {
    padding: 10,
    borderRadius: 8,
    fontSize: 14,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.gymme.orange,
    marginHorizontal: 5,
    fontFamily: "Poppins",
    width: "25%"
  },
  modalAddButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#FFA500",
    marginHorizontal: 5,
    fontSize: 14,
    width: "25%"
  },
});

export default TimerList;
