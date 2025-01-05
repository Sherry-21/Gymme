import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import RegisterDropDown from "@/components/customDropDown";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getProfileById } from "../API/profileApi";
import { router, useFocusEffect } from "expo-router";
import { postTimer } from "../API/timerApi";
import { getLatest, postWeight } from "../API/weightApi";
import Loading from "@/components/loading";
import { Colors } from "@/constants/Colors";
import { StatusBar } from "react-native";
import { deleteItem } from "../utils/SecureStoreChain";
import { ScrollView } from "react-native";

export default function ProfilePage() {
  const [userId, setUserId] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [weight, setWeight] = useState<string>("-");
  const [lastDate, setLastDate] = useState<Date>(new Date());
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [updatedWeight, setUpdatedWeight] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isPressed, setIsPressed] = useState<boolean>(false);
  const [questionToaster, setQuestionToaster] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
    }, [])
  );

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await getProfileById();
      const response2 = await getLatest();

      if (
        response == null ||
        response.success == false ||
        response2 == null ||
        response2.success == false
      ) {
        throw new Error("Error when load profile");
      }

      const information = response.data;
      const data2 = response2.data;
      
      setUserId(
        information.user_name.length > 8
          ? `${information.user_name.slice(0, 8)}...`
          : information.user_name
      );
      setGender(information.user_gender == "M" ? "Male" : "Female");
      setWeight(data2.user_weight ? data2.user_weight.toString() : "-");
      setLastDate(data2.user_weight_time);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      router.push("/errorPage");
      setIsLoading(false);
    }
  };

  const formatDateToIsoString = (date: Date): string => {
    return date.toISOString();
  };

  const formatDateToIndonesian = (dateTemp: Date): string => {
    const date = new Date(dateTemp);
    const options: Intl.DateTimeFormatOptions = {
      timeZone: "Asia/Jakarta",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour12: false,
    };

    const formatter = new Intl.DateTimeFormat("en-GB", options);
    return formatter.format(date);
  };

  const handleWeightInput = (value: string) => {
    const formattedValue = value.replace(/[^0-9.]/g, "");
    const decimalCount = (formattedValue.match(/\./g) || []).length;
    if (decimalCount > 1) return;

    if (formattedValue.startsWith(".")) {
      setUpdatedWeight(`0${formattedValue}`);
      return;
    }

    if (formattedValue.includes(".")) {
      const [whole, decimal] = formattedValue.split(".");
      if (decimal && decimal.length > 2) return;
    }

    setUpdatedWeight(formattedValue);
  };

  const getPayload = () => {
    const payload = {
      user_weight: parseFloat(updatedWeight),
      user_weight_time: formatDateToIsoString(new Date()),
    };
    return payload;
  };

  const handleUpdateWeight = async () => {
    if (!updatedWeight) {
      Alert.alert("Error", "Please enter a weight");
      return;
    }

    const weightValue = parseFloat(updatedWeight);
    if (isNaN(weightValue) || weightValue <= 0) {
      Alert.alert("Error", "Please enter a valid weight");
      return;
    }

    try {
      setIsLoading(true);
      const response = await postWeight(getPayload());
      setIsLoading(false);
      console.log(response);
      await setWeight(updatedWeight);

      setShowUpdateModal(false);
      setUpdatedWeight("");
    } catch (error) {
      console.error("Error updating weight:", error);
      Alert.alert("Error", "Unable to update weight");
    }
  };

  const goToTimerList = () => {
    router.push("/timerList");
  };

  const goToCalendar = () => {
    router.push("/CalenderScreen");
  };

  const goToBookmarked = () => {
    router.push("/bookmarkList");
  };

  const moveToWeightHistory = () => {
    router.push("/viewWeightHistory");
  };

  if (isLoading) {
    return <Loading />;
  }

  const press = () => {
    setIsPressed(!isPressed);
  };

  const openProfile = () => {
    router.push("/viewProfile");
  };

  const openToaster = () => {
    setQuestionToaster(true);
  };

  const closeToaster = () => {
    setQuestionToaster(false);
  };

  const logout = async () => {
    await deleteItem("itemKey");
    router.push("/");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome, </Text>
              <Text style={styles.name}>{userId || "User"}</Text>
            </View>
            <View style={styles.userInfo}>
              {gender == "Male" ? (
                <MaterialIcons name="male" size={20} color="#fff" />
              ) : (
                <MaterialIcons name="female" size={20} color="#fff" />
              )}
              <Text style={styles.userInfoText}>({gender || "-"})</Text>
            </View>
          </View>
          <View style={styles.rightContainer}>
            <View
              style={{
                flex: 1,
                justifyContent: "flex-end",
                alignItems: "flex-end",
              }}
            >
              <View style={styles.iconSettings}>
                <MaterialIcons name="settings" size={22} color={"#fff"} />
                <Pressable onPress={press}>
                  {isPressed ? (
                    <MaterialIcons
                      name="keyboard-arrow-up"
                      size={22}
                      color={"#fff"}
                    />
                  ) : (
                    <MaterialIcons
                      name="keyboard-arrow-down"
                      size={22}
                      color={"#fff"}
                    />
                  )}
                </Pressable>
              </View>
              {isPressed ? (
                <View style={styles.settingDropdown}>
                  <View style={styles.settingBox}>
                    <Pressable
                      style={styles.settingOption}
                      onPress={openProfile}
                    >
                      <MaterialIcons
                        name="person"
                        size={22}
                        color={Colors.gymme.placeholder}
                        style={{ marginRight: 15 }}
                      />
                      <Text style={{ fontFamily: "Poppins", fontSize: 13 }}>
                        profile
                      </Text>
                    </Pressable>
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <View style={styles.line} />
                    </View>
                    <Pressable
                      style={styles.settingOption}
                      onPress={openToaster}
                    >
                      <MaterialIcons
                        name="logout"
                        size={22}
                        color={Colors.gymme.placeholder}
                        style={{ marginRight: 15 }}
                      />
                      <Text style={{ fontFamily: "Poppins", fontSize: 13 }}>
                        logout
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        <View style={styles.containerContent}>
          <View style={styles.weightCard}>
            <View>
              <Text style={styles.weightTitle}>Current weight</Text>
              <Text style={styles.weightInfo}>
                {weight} kg - ({" "}
                {formatDateToIndonesian(
                  lastDate == null ? lastDate : new Date()
                )}{" "}
                )
              </Text>
              <Pressable onPress={() => moveToWeightHistory()}>
                <Text style={styles.weightHistory}>View weight history</Text>
              </Pressable>
            </View>
            <View style={styles.rightButton}>
              <Pressable
                style={styles.updateButton}
                onPress={() => setShowUpdateModal(true)}
              >
                <Text style={styles.updateButtonText}>Update</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureText}>Bookmarked</Text>
            <MaterialIcons name="bookmark-outline" size={32} color="#000" />
            <Pressable style={styles.featureButton} onPress={goToBookmarked}>
              <Text style={styles.featureButtonText}>View</Text>
            </Pressable>
          </View>

          <Text style={styles.sectionTitle}>Other Feature</Text>
          <View style={styles.otherFeatures}>
            <View style={styles.featureCard}>
              <Text style={styles.featureText}>Workout calendar</Text>
              <AntDesign name="calendar" size={32} color="#000" />
              <Pressable style={styles.featureButton} onPress={goToCalendar}>
                <Text style={styles.featureButtonText}>View</Text>
              </Pressable>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureText}>Workout timer</Text>
              <AntDesign name="clockcircleo" size={32} color="#000" />
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
              <View
                style={[
                  styles.modalContent,
                  { position: "absolute", bottom: 0 },
                ]}
              >
                <Pressable
                  style={styles.modalCloseButton}
                  onPress={() => setShowUpdateModal(false)}
                >
                  <AntDesign name="close" size={22} color="#333" />
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
                    maxLength={6}
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
                    <Text style={styles.updateButtonTextModal}>
                      Update
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </View>

        {questionToaster && (
          <View style={styles.errorToaster}>
            <View style={styles.errorBox}>
              <MaterialIcons
                style={styles.icon}
                name="help"
                size={60}
                color="#F39C12"
              />
              <Text style={styles.titleNotFound}>ARE YOU SURE?</Text>
              <Text style={styles.subheaderText}>
                Logout from your account?
              </Text>
              <View style={styles.buttonRow}>
                <Pressable
                  onPress={closeToaster}
                  style={styles.toasterContentNo}
                >
                  <Text style={styles.errorTextNo}>no</Text>
                </Pressable>
                <Pressable onPress={logout} style={styles.toasterContentYes}>
                  <Text style={styles.errorText}>yes</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  rightContainer: {
    width: "40%",
  },
  iconSettings: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  settingDropdown: {
    position: "absolute",
    top: 65,
    zIndex: 999,
    elevation: 10,
  },
  settingBox: {
    padding: 5,
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  settingOption: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 5,
    alignItems: "center",
  },
  line: {
    height: 1,
    backgroundColor: Colors.gymme.placeholder,
    width: "90%",
    marginVertical: 5,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#F39C12",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 35,
    paddingTop: 30,
    paddingBottom: 15,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    marginBottom: 20,
  },
  headerContent: {
    width: "60%",
  },
  welcomeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 16,
    fontFamily: "PoppinsBold",
    color: "#fff",
  },
  name: {
    fontSize: 16,
    fontFamily: "PoppinsBold",
    color: "#fff",
    textDecorationLine: "underline",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  userInfoText: {
    fontSize: 12,
    fontFamily: "Poppins",
    color: "#fff",
    marginLeft: 5,
  },
  containerContent: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  weightCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  weightTitle: {
    fontSize: 14,
    fontFamily: "PoppinsBold",
    marginBottom: 3,
  },
  weightInfo: {
    fontSize: 12,
    fontFamily: "Poppins",
    marginBottom: 3,
  },
  weightHistory: {
    fontSize: 12,
    fontFamily: "Poppins",
    color: "#0000FF",
    textDecorationLine: "underline",
  },
  rightButton: {
    flex: 1,
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  updateButton: {
    backgroundColor: "#FFA500",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  updateButtonText: {
    color: "#000000",
    fontSize: 11,
    fontFamily: "Poppins",
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "PoppinsBold",
    marginBottom: 5,
  },
  otherFeatures: {
    marginTop: 10,
  },
  featureCard: {
    flexDirection: "column",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  featureText: {
    fontSize: 14,
    fontFamily: "PoppinsBold",
    marginBottom: 10,
  },
  featureButton: {
    backgroundColor: "#FFA500",
    paddingHorizontal: 21,
    paddingVertical: 5,
    borderRadius: 15,
    position: "absolute",
    bottom: 15,
    right: 15,
  },
  featureButtonText: {
    color: "#000000",
    fontSize: 11,
    fontFamily: "Poppins",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end", // Changed from center to flex-end
  },
  modalContent: {
    width: "100%", // Changed from 85% to full width
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0, // Remove bottom radius
    borderBottomRightRadius: 0, // Remove bottom radius
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4, // Changed to negative value for top shadow
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalCloseButton: {
    position: "absolute",
    top: 15,
    right: 15,
    // zIndex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "PoppinsBold",
    color: "#000",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#f4f4f4",
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  weightInput: {
    flex: 1,
    height: 50,
    fontSize: 14,
    fontFamily: "Poppins",
    color: "#333",
  },
  unitText: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: "#666",
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    width: "45%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.gymme.orange,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 14,
    fontFamily: "Poppins",
  },
  updateButtonModal: {
    width: "45%",
    backgroundColor: "#FFA500",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  updateButtonTextModal: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Poppins",
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
  buttonRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
  },
  toasterContentNo: {
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    borderColor: "#F39C12",
    borderWidth: 1,
    width: "35%",
    marginRight: 20,
  },
  toasterContentYes: {
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#F39C12",
    width: "35%",
  },
  errorText: {
    color: "white",
    fontSize: 14,
    fontFamily: "Poppins",
  },
  errorTextNo: {
    color: "#F39C12",
    fontSize: 14,
    fontFamily: "Poppins",
  },
  errorBox: {
    width: "70%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  titleNotFound: {
    fontSize: 18,
    fontFamily: "PoppinsBold",
    color: Colors.gymme.orange,
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
});
