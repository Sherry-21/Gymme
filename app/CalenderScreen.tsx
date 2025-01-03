import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "@/constants/Colors";
import { router, useFocusEffect } from "expo-router";
import { toZonedTime, format } from "date-fns-tz";
import {
  deleteCalendar,
  getEventCalendar,
  insertCalendar,
  updateCalendar,
} from "./API/calendarApi";
import Loading from "@/components/loading";

interface EventData {
  name: string;
  startTime: string;
  endTime: string;
}

interface TimeInputProps {
  label: string;
  initialTime?: string;
  onTimeChange: (time: string) => void;
  endTimeHoursRef?: React.RefObject<TextInput> | null;
}

interface AddEditEventModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (eventData: any, mode: string) => void;
  initialEvent?: any;
  mode: string;
}

const API_BASE_URL = "";

const TimeInput: React.FC<TimeInputProps> = ({
  label,
  initialTime = "",
  onTimeChange,
  endTimeHoursRef,
}) => {
  const minutesRef = useRef<TextInput | null>(null);
  const [hours, setHours] = useState<string>(initialTime.split(":")[0] || "");
  const [minutes, setMinutes] = useState<string>(
    initialTime.split(":")[1] || ""
  );

  const handleHoursChange = (text: string) => {
    text = text.replace(/[^0-9]/g, "");

    if (text.length > 0) {
      const hourNum = parseInt(text);
      if (hourNum > 23) {
        text = "23";
      }
    }

    setHours(text);
    onTimeChange(`${text}:${minutes}`);

    if (text.length === 2 && parseInt(text) >= 0 && parseInt(text) <= 23) {
      minutesRef.current?.focus();
    }
  };

  const handleMinutesChange = (text: string) => {
    text = text.replace(/[^0-9]/g, "");

    if (text.length > 0) {
      const minNum = parseInt(text);
      if (minNum > 59) {
        text = "59";
      }
    }

    setMinutes(text);
    onTimeChange(`${hours}:${text}`);

    if (text.length === 2 && endTimeHoursRef?.current) {
      endTimeHoursRef.current.focus();
    }
  };

  return (
    <View style={styles.timeInputWrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.timeInputContainer}>
        <TextInput
          ref={label === "End Time" ? endTimeHoursRef : undefined}
          style={styles.timeInputField}
          value={hours}
          onChangeText={handleHoursChange}
          placeholder="HH"
          keyboardType="number-pad"
          maxLength={2}
        />
        <Text style={styles.timeSeparator}>:</Text>
        <TextInput
          ref={minutesRef}
          style={styles.timeInputField}
          value={minutes}
          onChangeText={handleMinutesChange}
          placeholder="MM"
          keyboardType="number-pad"
          maxLength={2}
        />
      </View>
    </View>
  );
};

const AddEditEventModal: React.FC<AddEditEventModalProps> = ({
  visible,
  onClose,
  onSave,
  initialEvent,
  mode,
}) => {
  const [eventName, setEventName] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  const handleSave = () => {
    if (eventName && startTime && endTime) {
      const eventToSave = {
        id: initialEvent?.calendar_id || "",
        name: eventName,
        startTime,
        endTime,
      };
      onSave(eventToSave, mode);
      reset();
      onClose();
    } else {
      Alert.alert("Error", "Please fill all fields");
    }
  };

  const reset = () => {
    setEventName("");
    setStartTime("");
    setEndTime("");
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {mode == "edit" ? "Edit Event" : "Add New Event"}
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Event Name</Text>
            <TextInput
              style={styles.input}
              value={eventName}
              onChangeText={setEventName}
              placeholder="Enter event name"
            />
          </View>

          <View style={styles.timeContainer}>
            <TimeInput
              label="Start Time"
              initialTime={startTime}
              onTimeChange={setStartTime}
              endTimeHoursRef={null}
            />
            <TimeInput
              label="End Time"
              initialTime={endTime}
              onTimeChange={setEndTime}
              endTimeHoursRef={null}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={[styles.buttonText, styles.saveButtonText]}>
                {mode == "add" ? "Save" : "Update"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [events, setEvents]: any = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | undefined>(undefined);
  const [mode, setMode] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    fetchEvents(day.dateString);
  };

  useFocusEffect(
    useCallback(() => {
      fetchEvents(transformDate(new Date()));
    }, [])
  );

  useEffect(() => {
    fetchEvents(transformDate(new Date()));
  }, []);

  const transformDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  };

  const fetchEvents = async (date: string) => {
    try {
      setIsLoading(true);
      const response = await getEventCalendar(date);
      if (response == null || response.success == false) {
        throw new Error("Not found data calendar");
      }
      console.log("WKWKKW WOI");
      const data = response.data;
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
      router.push("/errorPage");
    } finally {
      setIsLoading(false);
    }
  };

  const convertToGMT = (date: string) => {
    const currentDate = new Date(date);
    const utcDate = currentDate.toISOString();
    const formattedDate = utcDate.replace("Z", "+07:00");

    return formattedDate;
  };

  const formatTimeWithDate = (currentDate: string, time: string) => {
    const date = new Date(currentDate);
    const [hours, minutes] = time.split(":");
    const finalHours = parseInt(hours, 10);
    const finalMinutes = parseInt(minutes, 10);
    date.setHours(finalHours + 7);
    date.setMinutes(finalMinutes);

    return convertToGMT(date.toISOString());
  };

  const handleAddEvent = async (newEvent: any, mode: string) => {
    const currentDate = convertToGMT(selectedDate);
    const fromTime = formatTimeWithDate(selectedDate, newEvent.startTime);
    const endTime = formatTimeWithDate(currentDate, newEvent.endTime);

    try {
      const eventData = {
        calendar_name: newEvent.name,
        calendar_time_from: fromTime,
        calendar_time_to: endTime,
        calendar_date: currentDate,
      };

      if (mode == "add") {
        setIsLoading(true);
        const response = await insertCalendar(eventData);
        setIsLoading(false);
        if (response == null || response.success == false) {
          throw new Error("Error when inserting data events");
        }
        setEvents("");
        fetchEvents(selectedDate);
      } else if (mode == "edit") {
        setIsLoading(true);
        const response = await updateCalendar(
          eventData,
          editingEvent.calendar_id
        );
        setIsLoading(false);
        if (response == null || response.success == false) {
          throw new Error("Error when updating data events");
        }
        setEvents("");
        fetchEvents(selectedDate);
      }
      setModalVisible(false);
    } catch (error) {
      console.error("Error saving event:", error);
      router.push("/errorPage");
    }
  };

  const handleDeleteEvent = async (eventToDelete: number) => {
    console.log(eventToDelete);
    try {
      setIsLoading(true);
      const response = await deleteCalendar(eventToDelete);
      setIsLoading(false);
      if (response == null || response.success == false) {
        throw new Error("Error when deleting data events");
      }
      setEvents("");
      fetchEvents(selectedDate);
    } catch (error) {
      console.log(error);
      router.push("/errorPage");
    }
  };

  const createNewEvent = () => {
    setEditingEvent(undefined);
    setMode("add");
    setModalVisible(true);
  };

  const backButton = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/other");
    }
  };

  const getMarkedDates = () => {
    const marked: { [key: string]: any } = {};

    marked[selectedDate] = {
      ...marked[selectedDate],
      selected: true,
      selectedColor: "transparent",
      customStyles: {
        container: {
          borderWidth: 1,
          borderColor: "black",
          borderRadius: 8,
        },
        text: {
          color: "black",
          fontWeight: "bold",
        },
      },
    };
    return marked;
  };

  const transformTime = (dateString: string) => {
    const dateObject = new Date(dateString);
    const hours = String(dateObject.getHours()).padStart(2, "0");
    const minutes = String(dateObject.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  const renderEvents = () => {
    if (events == null || events?.length === 0) {
      return <Text style={styles.noEventsText}>No events for this day</Text>;
    }

    return events?.map((event: any) => (
      <View key={event.calendar_id} style={styles.eventItemContainer}>
        <View style={styles.eventNameContainer}>
          <Text style={styles.eventText}>• {event.calendar_name}</Text>
        </View>
        <View style={styles.eventDetailsContainer}>
          <Text style={styles.eventTime}>{`${transformTime(
            event.calendar_time_from
          )} - ${transformTime(event.calendar_time_to)}`}</Text>
          <View style={styles.eventActionContainer}>
            <Pressable
              onPress={() => {
                setEditingEvent(event);
                setMode("edit");
                setModalVisible(true);
              }}
              style={styles.editButton}
            >
              <AntDesign name="edit" size={20} color="white" />
            </Pressable>
            <Pressable
              onPress={() => {
                handleDeleteEvent(event.calendar_id);
              }}
              style={styles.deleteButton}
            >
              <AntDesign name="delete" size={20} color="white" />
            </Pressable>
          </View>
        </View>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#F39C12" />
      <View style={styles.headerMainContainer}>
        <View style={styles.headerContainer}>
          <Pressable
            style={styles.backgroundArrow}
            onPress={() => backButton()}
          >
            <MaterialIcons name="arrow-back-ios-new" size={24} color="#fff" />
          </Pressable>

          <Text style={styles.headerTitle}>Calendar</Text>
        </View>
      </View>

      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={getMarkedDates()}
          markingType={"custom"}
          style={styles.calendar}
          theme={{
            backgroundColor: "#ffffff",
            calendarBackground: "#ffffff",
            textSectionTitleColor: "#b6c1cd",
            selectedDayBackgroundColor: "#00adf5",
            selectedDayTextColor: "#ffffff",
            todayTextColor: "#00adf5",
            dayTextColor: "#2d4150",
            textDisabledColor: "#d9e1e8",
            dotColor: "#00adf5",
            selectedDotColor: "#ffffff",
            arrowColor: "orange",
            monthTextColor: "black",
            textDayFontFamily: "Poppins",
            textMonthFontFamily: "PoppinsBold",
            textDayHeaderFontFamily: "Poppins",
            textDayFontSize: 12,
            textMonthFontSize: 12,
            textDayHeaderFontSize: 12,
          }}
        />
      </View>

      <View style={styles.eventContainer}>
        <Text style={styles.eventDate}>
          {new Date(selectedDate).toLocaleDateString("en-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </Text>
        <ScrollView contentContainerStyle={styles.eventList}>
          {renderEvents()}
        </ScrollView>
      </View>

      <View style={styles.addButtonContainer}>
        <Pressable style={styles.addButton} onPress={createNewEvent}>
          <MaterialIcons name="add-circle" size={60} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.addButtonText}>Add</Text>
      </View>

      <AddEditEventModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingEvent(undefined);
        }}
        onSave={handleAddEvent}
        initialEvent={editingEvent}
        mode={mode}
      />

      {isLoading ? <Loading /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginTop: 44, // Added for iOS status bar
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
    fontFamily: "PoppinsBold",
    color: "white",
    textAlign: "center",
  },
  borderLine: {
    height: 1,
    backgroundColor: "#E3E3E3",
    marginHorizontal: 16,
  },
  calendarContainer: {
    marginHorizontal: 40,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 20,
    borderRadius: 30,
    backgroundColor: "#fff",
  },
  calendar: {
    borderRadius: 10,
  },
  eventContainer: {
    flex: 1,
    backgroundColor: "#ffa500",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginTop: 15,
  },
  eventDate: {
    paddingTop: 5,
    fontSize: 16,
    fontFamily: "PoppinsBold",
    marginBottom: 10,
    color: "white",
  },
  eventList: {
    paddingBottom: 50,
  },
  noEventsText: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
    marginTop: 60,
    fontFamily: "Poppins",
  },
  eventItem: {
    flexDirection: "column",
    marginBottom: 10,
  },
  verticalLine: {
    marginBottom: -5,
    marginLeft: 2,
    width: 2,
    height: 20,
    backgroundColor: "#FFFFFF",
    marginTop: 5,
  },
  eventTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventText: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: "white",
  },
  eventTime: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: "white",
  },
  addButtonContainer: {
    position: "absolute",
    bottom: 30,
    right: 30,
    alignItems: "center",
  },
  addButton: {
    borderRadius: 30,
    marginBottom: 5,
  },
  addButtonText: {
    color: "#fff",
    marginTop: 0,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "PoppinsBold",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: "Poppins",
    marginBottom: 5,
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    fontFamily: "Poppins",
  },
  timeContainer: {
    flexDirection: "column",
    gap: 16,
  },
  timeInputWrapper: {},
  timeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timeInputField: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 5,
    fontSize: 14,
    fontFamily: "Poppins",
    width: 60,
    textAlign: "center",
  },
  timeSeparator: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  button: {
    width: "42%",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    borderColor: Colors.gymme.orange,
    borderWidth: 1,
    borderRadius: 15,
  },
  saveButton: {
    backgroundColor: Colors.gymme.orange,
    borderRadius: 15,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Poppins",
  },
  saveButtonText: {
    color: "white",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  eventActionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  eventNameContainer: {
    flex: 1,
  },
  eventDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  eventItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  editButton: {
    borderRadius: 15,
    padding: 2,
    marginLeft: 15,
  },
  deleteButton: {
    borderRadius: 15,
    padding: 2,
  },
});

export default CalendarScreen;
