import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  StyleSheet,
  ScrollView,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  Pressable,
  SafeAreaView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/Colors";
import { StatusBar } from "react-native";
import { deleteQueue, getTimerQueue, insertQueue } from "./API/timerApi";
import Loading from "@/components/loading";
import { Audio } from "expo-av";
import { Sound } from "expo-av/build/Audio";

interface Exercise {
  id: number;
  name: string;
  duration: string;
}

interface NewExercise {
  name: string;
  hours: string;
  minutes: string;
  seconds: string;
}

const WorkoutTimer: React.FC = () => {
  const [initialQueue, setInitialQueue] = useState<Exercise[]>([]);
  const [queue, setQueue] = useState<Exercise[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newExercise, setNewExercise] = useState<NewExercise>({
    name: "",
    hours: "",
    minutes: "",
    seconds: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hoursInputRef = useRef<TextInput>(null);
  const minutesInputRef = useRef<TextInput>(null);
  const secondsInputRef = useRef<TextInput>(null);

  //sound
  const [sound, setSound] = useState<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stopTimeout, setStopTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [timerToaster, setTimerToaster] = useState(false);

  const { timerId } = useLocalSearchParams();

  async function playSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      require("@/assets/sound/alarm.mp3")
    );
    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
    setIsPlaying(true);

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        console.log("Sound ended, restarting...");
        sound.replayAsync();
      }
    });

    const timeout = setTimeout(async () => {
      console.log("Stopping Sound after 1 minute");
      if (sound) {
        await sound.stopAsync();
        setIsPlaying(false);
      }
    }, 60000);

    setStopTimeout(timeout);
  }

  async function stopManually() {
    console.log("Stopping Sound manually");
    if (stopTimeout) {
      clearTimeout(stopTimeout);
    }
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  }

  const timeToSeconds = (timeStr: string): number => {
    const [hours = 0, minutes = 0, seconds = 0] = timeStr
      .split(":")
      .map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const secondsToTime = (secs: number): string => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  const handleStart = (): void => {
    if (queue.length === 0) return;

    if (!isRunning) {
      if (!currentExercise) {
        const firstExercise = queue[0];
        setCurrentExercise(firstExercise);
        setCurrentTime(timeToSeconds(firstExercise.duration));
      }
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  };

  const handleAdd = async () => {
    if (
      !newExercise.name ||
      (!newExercise.hours && !newExercise.minutes && !newExercise.seconds)
    ) {
      return;
    }

    const duration = `${newExercise.hours.padStart(
      2,
      "0"
    )}:${newExercise.minutes.padStart(2, "0")}:${newExercise.seconds.padStart(
      2,
      "0"
    )}`;

    setShowAddModal(false);
    setIsLoading(true);
    const response = await insertQueue(
      parseInt(timerId.toString()),
      getPayload()
    );
    setIsLoading(false);

    const data = response.data;

    const newTimer: Exercise = {
      id: data.timer_id,
      name:
        newExercise.name.length > 10
          ? `${newExercise.name.slice(0, 10)}...`
          : newExercise.name,
      duration,
    };

    setInitialQueue((prev) => [...prev, newTimer]);
    setQueue((prev) => [...prev, newTimer]);

    setNewExercise({
      name: "",
      hours: "",
      minutes: "",
      seconds: "",
    });
  };

  const getPayload = () => {
    const payload = {
      timer_queue_name: newExercise.name,
      timer_id: parseInt(timerId.toString()),
      timer_queue_reminding_hour: parseInt(
        newExercise.hours ? newExercise.hours : "0"
      ),
      timer_queue_reminding_minutes: parseInt(
        newExercise.minutes ? newExercise.minutes : "0"
      ),
      timer_queue_reminding_second: parseInt(
        newExercise.seconds ? newExercise.seconds : "0"
      ),
    };

    return payload;
  };

  const handleTimeInput = (
    field: keyof NewExercise,
    value: string,
    nextRef?: React.RefObject<TextInput>
  ): void => {
    if (value === "" || (/^\d*$/.test(value) && parseInt(value || "0") < 60)) {
      setNewExercise((prev) => ({ ...prev, [field]: value }));
      if (value.length === 2 && nextRef && nextRef.current) {
        nextRef.current.focus();
      }
    }
  };

  const handleKeyDown = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    field: keyof NewExercise,
    prevRef?: React.RefObject<TextInput>
  ): void => {
    if (
      e.nativeEvent.key === "Backspace" &&
      newExercise[field] === "" &&
      prevRef &&
      prevRef.current
    ) {
      prevRef.current.focus();
    }
  };

  const deleteQueueTimer = async (indexToRemove: number, indexUI: number) => {
    setIsLoading(true);
    const response = await deleteQueue(indexToRemove);
    setIsLoading(false);

    setInitialQueue((prevQueue) =>
      prevQueue.filter((_, index) => index !== indexUI)
    );
    setQueue((prevQueue) => prevQueue.filter((_, index) => index !== indexUI));
  };

  const backButton = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/timerList");
    }
  };

  const next = () => {
    setCurrentTime(0);
    setCurrentTime((prev) => {
      if (prev <= 1) {
        setIsRunning(false);
        clearInterval(timerRef.current!);

        setQueue((prevQueue) => prevQueue.slice(1));

        if (queue.length > 1) {
          const nextExercise = queue[1];
          setCurrentExercise(nextExercise);
          return timeToSeconds(nextExercise.duration);
        } else {
          setCurrentExercise(null);
          return 0;
        }
      }
      return prev - 1;
    });
  };

  const reset = () => {
    setCurrentTime(0);
    setCurrentExercise(null);
    setQueue(initialQueue);
    setIsRunning(false);
  };

  const getTimerAPI = async () => {
    console.log("HIT GET")
    setIsLoading(true);
    const response = await getTimerQueue(parseInt(timerId.toString()));
    setIsLoading(false);
    const data = response.data;

    if (data) {
      data.map((item: any) => {
        const duration = `${item.timer_queue_reminding_hour
          .toString()
          .padStart(2, "0")}:${item.timer_queue_reminding_minutes
          .toString()
          .padStart(2, "0")}:${item.timer_queue_reminding_second
          .toString()
          .padStart(2, "0")}`;

        const newTimer: Exercise = {
          id: item.timer_queue_id,
          name:
            item.timer_queue_name.length > 10
              ? `${item.timer_queue_name.slice(0, 10)}...`
              : item.timer_queue_name,
          duration,
        };
        console.log(newTimer);
        setInitialQueue((prev) => [...prev, newTimer]);
        setQueue((prev) => [...prev, newTimer]);
      });
    }
  };

  useEffect(() => {
    getTimerAPI();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (stopTimeout) {
        clearTimeout(stopTimeout);
      }
    };
  }, []);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev <= 1) {
            setTimerToaster(true);
            playSound();
            setIsRunning(false);
            clearInterval(timerRef.current!);

            setQueue((prevQueue) => prevQueue.slice(1));

            if (queue.length > 1) {
              const nextExercise = queue[1];
              setCurrentExercise(nextExercise);
              return timeToSeconds(nextExercise.duration);
            } else {
              setCurrentExercise(null);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, queue]);

  const pressedTimerToaster = () => {
    stopManually();
    setTimerToaster(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#F39C12" />
      <View style={styles.headerContainer}>
        <Pressable style={styles.backgroundArrow} onPress={() => backButton()}>
          <MaterialIcons name="arrow-back-ios-new" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Timer</Text>
      </View>

      <View style={styles.timerContainer}>
        <View style={styles.timerCircle}>
          <Text style={styles.timerName}>{currentExercise?.name || ""}</Text>
          <Text style={styles.timerDisplay}>
            {currentExercise ? secondsToTime(currentTime) : "00:00:00"}
          </Text>
          {currentExercise != null ? (
            <Pressable style={styles.skipButton} onPress={next}>
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      <Text style={styles.queueTitle}>Next queue</Text>
      <ScrollView contentContainerStyle={styles.queueList}>
        {queue.slice(currentExercise ? 1 : 0).map((exercise, index) => (
          <View key={index} style={styles.queueItem}>
            <Text style={styles.queueItemText}>{exercise.name}</Text>
            <View style={styles.queueRight}>
              <Text style={styles.queueItemTime}>{exercise.duration}</Text>
              <View style={styles.alwaysRight}>
                <Pressable
                  style={{ marginLeft: 5 }}
                  onPress={() => deleteQueueTimer(exercise.id, index)}
                >
                  <MaterialIcons name="delete" size={24} color="#A77800" />
                </Pressable>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.controlSection}>
        <Pressable
          onPress={() => setShowAddModal(true)}
          style={styles.addButton}
        >
          <Text style={styles.buttonText}>Add</Text>
        </Pressable>
        {isRunning ? (
          <Pressable onPress={handleStart}>
            <MaterialIcons name="pause-circle" size={54} color="#000" />
          </Pressable>
        ) : (
          <Pressable onPress={handleStart}>
            <MaterialIcons name="play-circle" size={54} color="#000" />
          </Pressable>
        )}
        <Pressable style={styles.addButton} onPress={() => reset()}>
          <Text style={styles.buttonText}>reset</Text>
        </Pressable>
      </View>

      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Timer</Text>
            <TextInput
              placeholder="Exercise name"
              style={styles.modalInput}
              value={newExercise.name}
              onChangeText={(text) =>
                setNewExercise((prev) => ({ ...prev, name: text }))
              }
            />
            <View style={styles.timeInputContainer}>
              <TextInput
                ref={hoursInputRef}
                placeholder="HH"
                style={styles.timeInput}
                value={newExercise.hours}
                onChangeText={(text) =>
                  handleTimeInput("hours", text, minutesInputRef)
                }
                maxLength={2}
                keyboardType="numeric"
              />
              <Text>:</Text>
              <TextInput
                ref={minutesInputRef}
                placeholder="MM"
                style={styles.timeInput}
                value={newExercise.minutes}
                onChangeText={(text) =>
                  handleTimeInput("minutes", text, secondsInputRef)
                }
                maxLength={2}
                keyboardType="numeric"
                onKeyPress={(e) => handleKeyDown(e, "minutes", hoursInputRef)}
              />
              <Text>:</Text>
              <TextInput
                ref={secondsInputRef}
                placeholder="SS"
                style={styles.timeInput}
                value={newExercise.seconds}
                onChangeText={(text) => handleTimeInput("seconds", text)}
                maxLength={2}
                keyboardType="numeric"
                onKeyPress={(e) => handleKeyDown(e, "seconds", minutesInputRef)}
              />
            </View>
            <View style={styles.modalButtonContainer}>
              <Pressable
                onPress={() => setShowAddModal(false)}
                style={styles.modalCancelButton}
              >
                <Text>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleAdd} style={styles.modalAddButton}>
                <Text style={{ color: "white" }}>Add</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {isLoading ? <Loading /> : null}

      {timerToaster && (
        <View style={styles.errorToaster}>
          <View style={styles.errorBox}>
            <Text style={styles.titleNotFound}>TIMES UP!</Text>
            <Pressable
              onPress={() => pressedTimerToaster()}
              style={styles.toasterContent}
            >
              <Text style={styles.errorText}>Okay</Text>
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    justifyContent: "center",
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: Colors.gymme.orange,
    marginBottom: 15,
  },
  arrowBack: {
    width: 24,
    height: 24,
  },
  backgroundArrow: {
    position: "absolute",
    borderRadius: 40,
    marginVertical: 30,
    marginHorizontal: 25,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Poppins",
    color: "#fff",
  },
  timerContainer: { alignItems: "center", marginVertical: 10 },
  timerCircle: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#F39C12",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 10,
    borderColor: "#A77800",
  },
  timerName: {
    fontSize: 24,
    color: "white",
    position: "absolute",
    top: 60,
    fontWeight: "bold",
    textAlign: "center",
  },
  skipButton: {
    position: "absolute",
    bottom: 45,
    paddingHorizontal: 25,
    paddingVertical: 8,
    backgroundColor: "#a77800",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  skipText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Poppins",
  },
  timerDisplay: {
    fontSize: 54,
    fontFamily: "Poppins",
    fontWeight: "bold",
    color: "white",
  },
  queueTitle: {
    fontSize: 28,
    fontFamily: "Poppins",
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
    textAlign: "left",
    marginHorizontal: 25,
  },
  queueList: { marginHorizontal: 25, marginTop: 10 },
  queueItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  queueRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  alwaysRight: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginLeft: 10,
  },
  queueItemText: { fontSize: 20, fontWeight: "bold", fontFamily: "Poppins" },
  queueItemTime: { fontSize: 20, fontWeight: "bold", fontFamily: "Poppins" },
  controlSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F39C12",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  addButton: {
    width: "30%",
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  startButton: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    fontFamily: "Poppins",
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
    fontSize: 20,
    fontFamily: "Poppins",
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalInput: {
    borderColor: "#D1D5DB",
    borderWidth: 1,
    padding: 10,
    width: "100%",
    borderRadius: 8,
    marginBottom: 10,
    fontFamily: "Poppins",
  },
  timeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  timeInput: {
    borderColor: "#D1D5DB",
    borderWidth: 1,
    padding: 10,
    width: 50,
    textAlign: "center",
    borderRadius: 8,
    marginHorizontal: 5,
    fontFamily: "Poppins",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalCancelButton: {
    fontFamily: "Poppins",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 5,
  },
  modalAddButton: {
    fontFamily: "Poppins",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#FFA500",
    marginHorizontal: 5,
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
    fontSize: 24,
    fontFamily: "Poppins",
    fontWeight: "bold",
    color: "#F39C12",
    marginBottom: 10,
  },
  subheaderText: {
    fontSize: 14,
    fontFamily: "Poppins",
    marginBottom: 20,
  },
  icon: {
    marginBottom: 10,
  },
  error: {
    fontSize: 12,
    color: Colors.gymme.red,
    marginBottom: 5,
  },
});

export default WorkoutTimer;
