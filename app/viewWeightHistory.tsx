import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Items from "ajv/lib/vocabularies/applicator/items";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { getWeight } from "./API/weightApi";
import DateInput from "@/components/dateInput";
import Loading from "@/components/loading";
import DateTimePicker from "@react-native-community/datetimepicker";

interface DateInputProps {
  onDateChange?: (date: string) => void;
}

const backButton = () => {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.push("/other");
  }
};

const updateTime = (user_weight_time: any) => {
  let date = new Date(user_weight_time);
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  const formatter = new Intl.DateTimeFormat("en-GB", options);
  const formattedDate = formatter.format(date);

  return formattedDate;
};

const viewWeightHistory = () => {
  const [historyData, SetHistoryData]: any = useState([]);

  const [dateFrom, setDateFrom] = useState<Date>(new Date());
  const [dateTo, setDateTo] = useState<Date>(new Date());
  const [finalDateFrom, setFinalDateFrom] = useState("");
  const [finalDateTo, setFinalDateTo] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isFocused2, setIsFocused2] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorToaster, setErrorToaster] = useState(false);

  const [showPicker, setShowPicker] = useState(false);
  const [showPicker2, setShowPicker2] = useState(false);

  const formatDateFrom = (dateParameter: Date) => {
    const formattedDate = dateParameter.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    setFinalDateFrom(formattedDate);
  };

  const formatDateTo = (dateParameter: Date) => {
    const formattedDate = dateParameter.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    setFinalDateTo(formattedDate);
  };

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const searchWithFilter = async (date1: string, date2: string) => {
    if (!date1 || !date2) {
      setErrorToaster(true);
      return;
    }
    console.log("TEST?")
    console.log(date1, date2)
    const [day, month, year] = date1.split("/").map(Number);
    const [day2, month2, year2] = date2.split("/").map(Number);

    if (month < 0 || month > 12 || month2 < 0 || month2 > 12) {
      setErrorToaster(true);
    } else {
      const firstDate = new Date(year, month, 1).getDate();
      const lastDate = new Date(year, month + 1, 0).getDate();
      const firstDate2 = new Date(year2, month2, 1).getDate();
      const lastDate2 = new Date(year2, month2 + 1, 0).getDate();

      if (
        day < firstDate ||
        day > lastDate ||
        day2 < firstDate2 ||
        day2 > lastDate2
      ) {
        setErrorToaster(true);
      } else {
        const dateFilter1 = `${day}-${month}-${year}`;
        const dateFilter2 = `${day2}-${month2}-${year2}`;
        setIsLoading(true);
        const response = await getWeight(dateFilter1, dateFilter2);
        setIsLoading(false);
        SetHistoryData("");
        let row = response.data;
        console.log(row);
        if (row != null && row.length !== 0) {
          const updatedRows = row.map((item: any) => ({
            ...item,
            user_weight_time: updateTime(item.user_weight_time),
          }));
          SetHistoryData((prev: any) => [...prev, ...updatedRows]);
        }
      }
    }
  };

  const pressedErrorToaster = () => {
    setErrorToaster(false);
  };

  useEffect(() => {
    const fetchWeightHistory = async () => {
      try {
        setIsLoading(true);
        const now = new Date();
        console.log(now)
        const firstDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        console.log(firstDate, lastDate);
        const response = await getWeight(
          formatDate(firstDate),
          formatDate(lastDate)
        );
        setIsLoading(false);
        if(response == null || response.success == false) {
          throw new Error("Error")
        }

        let row = response.data;
        if(row != null) {
          const updatedRows = row.map((item: any) => ({
            ...item,
            user_weight_time: updateTime(item.user_weight_time),
          }));
          console.log(updatedRows);
          SetHistoryData((prev: any) => [...prev, ...updatedRows]);
          console.log(historyData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        router.push("/errorPage")
      }
    };
    fetchWeightHistory();

    console.log(historyData);
  }, []);

  //date picker
  const handleChange = (event: any, selectedDate: any) => {
    setShowPicker(false);
    if (selectedDate) {
      console.log(selectedDate);
      setDateFrom(selectedDate);
      formatDateFrom(selectedDate);
    }
  };

  const handleChange2 = (event: any, selectedDate2: any) => {
    setShowPicker2(false);
    if (selectedDate2) {
      console.log(selectedDate2);
      setDateTo(selectedDate2);
      formatDateTo(selectedDate2);
    }
  };

  const showDatePicker = () => {
    setShowPicker(true);
  };

  const showDatePicker2 = () => {
    setShowPicker2(true);
  };
  

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.headerMainContainer}>
        <View style={styles.headerContainer}>
          <Pressable
            style={styles.backgroundArrow}
            onPress={() => backButton()}
          >
            <MaterialIcons name="arrow-back-ios-new" size={24} color="#fff" />
          </Pressable>

          <Text style={styles.headerTitle}>Weight History</Text>
        </View>
      </View>

      <View style={styles.wrapper}>
        <Pressable
          style={[
            styles.container,
            isFocused && styles.focusedContainer,
            finalDateFrom && styles.filledContainer,
          ]}

          onPress={showDatePicker}
        >
          <View style={styles.labelContainer}>
            <Text
              style={[
                styles.label,
                (isFocused || dateFrom) && styles.floatingLabel,
              ]}
            >
              From
            </Text>
          </View>
          <TextInput
            style={styles.input}
            value={finalDateFrom}
            keyboardType="numeric"
            maxLength={10}
            placeholder={isFocused || dateFrom ? "dd/mm/yyyy" : ""}
            placeholderTextColor="rgba(107, 114, 128, 0.5)"
            editable={false}
          />
          <View style={styles.iconContainer}>
            <MaterialIcons name="calendar-month" size={20} />
          </View>
          {showPicker && (
            <DateTimePicker
              value={dateFrom}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleChange}
            />
          )}
        </Pressable>

        <Pressable
          style={[
            styles.container,
            isFocused2 && styles.focusedContainer,
            finalDateTo && styles.filledContainer,
            { marginLeft: 10 },
          ]}

          onPress={showDatePicker2}
        >
          <View style={styles.labelContainer}>
            <Text
              style={[
                styles.label,
                (isFocused2 || dateTo) && styles.floatingLabel,
              ]}
            >
              To
            </Text>
          </View>
          <TextInput
            style={styles.input}
            value={finalDateTo}
            keyboardType="numeric"
            maxLength={10}
            placeholder={isFocused || dateFrom ? "dd/mm/yyyy" : ""}
            placeholderTextColor="rgba(107, 114, 128, 0.5)"
            editable={false}
          />
          <View style={styles.iconContainer}>
            <MaterialIcons name="calendar-month" size={20} />
          </View>
          {showPicker2 && (
            <DateTimePicker
              value={dateTo}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleChange2}
            />
          )}
        </Pressable>

        <Pressable
          style={styles.searchCircle}
          onPress={() => {
            searchWithFilter(finalDateFrom, finalDateTo);
          }}
        >
          <MaterialIcons style={styles.searchIcon} name="search" size={20} />
        </Pressable>
      </View>
      {historyData != null && historyData.length !== 0 ? (
        <ScrollView>
          {historyData?.map((item: any, index: number) => (
            <Pressable key={index}>
              <View style={styles.entryContainer}>
                <Text style={styles.icon}>🏋️</Text>
                <View style={styles.detail}>
                  <View>
                    <Text style={styles.Weight}>{item.user_weight}</Text>
                    {item.user_bmi < 20 && (
                      <Text style={[styles.bmiStatus, { color: "red" }]}>
                        Underweight
                      </Text>
                    )}
                    {item.user_bmi >= 20 && item.user_bmi < 25 && (
                      <Text style={[styles.bmiStatus, { color: "green" }]}>
                        Normal Weight
                      </Text>
                    )}
                    {item.user_bmi >= 25 && item.user_bmi < 30 && (
                      <Text style={[styles.bmiStatus, { color: "orange" }]}>
                        Overweight
                      </Text>
                    )}
                    {item.user_bmi >= 30 && item.user_bmi < 40 && (
                      <Text style={[styles.bmiStatus, { color: "red" }]}>
                        Obese
                      </Text>
                    )}
                    {item.user_bmi >= 40 && (
                      <Text style={[styles.bmiStatus, { color: "red" }]}>
                        Severely Obese
                      </Text>
                    )}
                  </View>
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <View style={{flex: 1, justifyContent: "flex-end"}}>
                      <Text style={styles.Date}>{item.user_weight_time}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>No data found</Text>
          <Text style={styles.emptyStateSubtext}>
            you do not have any weight update at the specific time range
          </Text>
        </View>
      )}

      {isLoading ? <Loading /> : null}
      {errorToaster && (
        <View style={styles.errorToaster}>
          <View style={styles.errorBox}>
            <MaterialIcons
              style={styles.iconToaster}
              name="error"
              size={50}
              color="#F39C12"
            />
            <Text style={styles.titleNotFound}>INVALID DATE!!</Text>
            <Text style={styles.subheaderText}>Please input a valid date</Text>
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
};

const styles = StyleSheet.create({
  mainContainer: {
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
  headerTitle: {
    fontSize: 22,
    textAlign: "center",
    fontFamily: "PoppinsBold",
    color: "#fff",
  },
  entryContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  icon: {
    fontSize: 32,
    marginRight: 10,
  },
  detail: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  Weight: {
    fontSize: 14,
    fontFamily: "Poppins",
  },
  Date: {
    fontSize: 12,
    color: "#666",
    fontFamily: "Poppins",
  },
  divider: {
    height: 1,
    backgroundColor: "#fff",
    marginHorizontal: 20,
  },
  bmiStatus: {
    fontFamily: "Poppins",
    fontSize: 12,
  },

  //filter
  wrapper: {
    marginVertical: 12,
    flexDirection: "row",
    marginHorizontal: 25,
  },
  container: {
    width: "39%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    backgroundColor: "white",
  },
  focusedContainer: {
    borderColor: "#F39C12",
    borderWidth: 1,
    shadowColor: "#F39C12",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filledContainer: {
    borderColor: "#F39C12",
  },
  labelContainer: {
    position: "absolute",
    left: 5,
    right: 8,
    top: -8,
    zIndex: 1,
  },
  label: {
    position: "absolute",
    left: 3,
    top: 18,
    fontSize: 14,
    color: "#6B7280",
    backgroundColor: "transparent",
    paddingHorizontal: 4,
    fontFamily: "Poppins",
  },
  floatingLabel: {
    top: -4,
    fontSize: 14,
    color: "black",
    backgroundColor: "white",
    fontFamily: "Poppins",
  },
  input: {
    flex: 1,
    width: "50%",
    paddingLeft: 10,
    fontSize: 12,
    color: "#374151",
    fontFamily: "Poppins",
  },
  iconContainer: {
    paddingVertical: 12,
    paddingHorizontal: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  searchCircle: {
    alignItems: "flex-end",
    justifyContent: "center",
    flex: 1,
  },
  searchIcon: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: "#rgba(136, 136, 136, 0.5)",
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
    width: "70%",
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
  iconToaster: {
    marginBottom: 10,
  },
  error: {
    fontSize: 12,
    color: Colors.gymme.red,
    marginBottom: 5,
  },

  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
    height: "100%",
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
    textAlign: "center",
  },
});

export default viewWeightHistory;
