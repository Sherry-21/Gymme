import React, { useState, useRef, useEffect } from 'react';
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
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { AntDesign } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
// import { RootStackParamList } from '../types';

interface Event {
    id: string;
    name: string;
    startTime: string;
    endTime: string;  
}

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
    onSave: (eventData: Event) => void;
    initialEvent?: Event;
  }

// type CalendarScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Calendar'>;

const API_BASE_URL = '';

const TimeInput: React.FC<TimeInputProps> = ({ 
  label, 
  initialTime = '', 
  onTimeChange, 
  endTimeHoursRef 
}) => {
  const minutesRef = useRef<TextInput | null>(null);
  const [hours, setHours] = useState<string>(initialTime.split(':')[0] || '');
  const [minutes, setMinutes] = useState<string>(initialTime.split(':')[1] || '');

  const handleHoursChange = (text: string) => {
    text = text.replace(/[^0-9]/g, '');
    
    if (text.length > 0) {
      const hourNum = parseInt(text);
      if (hourNum > 23) {
        text = '23';
      }
    }
    
    setHours(text);
    onTimeChange(`${text}:${minutes}`);

    if (text.length === 2 && parseInt(text) >= 0 && parseInt(text) <= 23) {
      minutesRef.current?.focus();
    }
  };

  const handleMinutesChange = (text: string) => {
    text = text.replace(/[^0-9]/g, '');
    
    if (text.length > 0) {
      const minNum = parseInt(text);
      if (minNum > 59) {
        text = '59';
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
  initialEvent 
}) => {
  const [eventName, setEventName] = useState<string>(initialEvent?.name || '');
  const [startTime, setStartTime] = useState<string>(initialEvent?.startTime || '');
  const [endTime, setEndTime] = useState<string>(initialEvent?.endTime || '');
  const endTimeHoursRef = useRef<TextInput | null>(null);

  const handleSave = () => {
    if (eventName && startTime && endTime) {
      const eventToSave = {
        id: initialEvent?.id || Date.now().toString(),
        name: eventName,
        startTime,
        endTime
      };
      onSave(eventToSave);
      onClose();
    } else {
      Alert.alert('Error', 'Please fill all fields');
    }
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
            {initialEvent ? 'Edit Event' : 'Add New Event'}
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
              endTimeHoursRef={endTimeHoursRef}
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
                Save
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const CalendarScreen = () => {
    // const navigation = useNavigation<CalendarScreenNavigationProp>();
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [events, setEvents] = useState<{ [key: string]: Event[] }>({});
    const [modalVisible, setModalVisible] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(true);

const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  useEffect(() => {
    const fetchEvents = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE_URL}/events`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Add authentication token if required
                    // 'Authorization': `Bearer ${yourAuthToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }

            const data = await response.json();
            
            // Transform backend data into local events structure
            const formattedEvents: { [key: string]: Event[] } = {};
            data.forEach((event: Event & { date: string }) => {
                if (!formattedEvents[event.date]) {
                    formattedEvents[event.date] = [];
                }
                formattedEvents[event.date].push({
                    id: event.id.toString(),
                    name: event.name,
                    startTime: event.startTime,
                    endTime: event.endTime
                });
            });

            setEvents(formattedEvents);
        } catch (error) {
            console.error('Error fetching events:', error);
            Alert.alert('Error', 'Failed to fetch events');
        } finally {
            setIsLoading(false);
        }
    };

    fetchEvents();
    }  , []);

  const handleAddEvent = async (newEvent: Event) => {
    console.log("WOI WKWK")
    try {
        // Determine if it's a new event or an update
        const isNewEvent = newEvent.id.startsWith('temp_');

        const eventData = {
            name: newEvent.name,
            startTime: newEvent.startTime,
            endTime: newEvent.endTime,
            date: selectedDate
        };

        let response;
        // if (isNewEvent) {
        //     // Create new event
        //     response = await fetch(`${API_BASE_URL}/events`, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(eventData)
        //     });
        // } else {
        //     // Update existing event
        //     response = await fetch(`${API_BASE_URL}/events/${newEvent.id}`, {
        //         method: 'PUT',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(eventData)
        //     });
        // }

        // if (!response.ok) {
        //     throw new Error('Failed to save event');
        // }

        // const savedEvent = await response.json();

        console.log("HIT SINI BROK")
        // Update local state
        setEvents(prevEvents => {
            const updatedEvents = { ...prevEvents };
            if (!updatedEvents[selectedDate]) {
                updatedEvents[selectedDate] = [];
            }
            
            if (isNewEvent) {
                // Add new event with backend-generated ID
                updatedEvents[selectedDate].push({
                    // id: savedEvent.id.toString(),
                    // name: savedEvent.name,
                    // startTime: savedEvent.startTime,
                    // endTime: savedEvent.endTime
                    id: '1',
                    name: 'awikwok',
                    startTime: '9',
                    endTime: '1'
                });
            } 
            // else {
            //     // Update existing event
            //     const index = updatedEvents[selectedDate].findIndex(e => e.id === newEvent.id);
            //     if (index > -1) {
            //         updatedEvents[selectedDate][index] = {
            //             id: savedEvent.id.toString(),
            //             name: savedEvent.name,
            //             startTime: savedEvent.startTime,
            //             endTime: savedEvent.endTime
            //         };
            //     }
            // }
            
            return updatedEvents;
        });

        // Close modal
        setModalVisible(false);
    } catch (error) {
        console.error('Error saving event:', error);
        Alert.alert('Error', 'Failed to save event');
    }
    };

    const handleDeleteEvent = async (eventToDelete: Event) => {
        try {
            const response = await fetch(`${API_BASE_URL}/events/${eventToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    // Add authentication token if required
                    // 'Authorization': `Bearer ${yourAuthToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete event');
            }

            // Update local state
            setEvents(prevEvents => {
                const updatedEvents = { ...prevEvents };
                
                if (updatedEvents[selectedDate]) {
                    updatedEvents[selectedDate] = updatedEvents[selectedDate].filter(
                        event => event.id !== eventToDelete.id
                    );

                    // Remove date if no events
                    if (updatedEvents[selectedDate].length === 0) {
                        delete updatedEvents[selectedDate];
                    }
                }

                return updatedEvents;
            });
        } catch (error) {
            console.error('Error deleting event:', error);
            Alert.alert('Error', 'Failed to delete event');
        }
    };

    const createNewEvent = () => {
        setEditingEvent({
            id: `temp_${Date.now()}`, // Temporary ID for new events
            name: '',
            startTime: '',
            endTime: ''
        });
        setModalVisible(true);
    };

    // Render loading indicator when fetching events
    if (isLoading) {
        return (
            <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#ffa500" />
            </View>
        );
    }
  const getMarkedDates = () => {
    const marked: { [key: string]: any } = {};

    Object.keys(events).forEach((date) => {
      marked[date] = {
        marked: true,
        customStyles: {
          container: {
            position: 'relative',
          },
          dot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: 'blue',
            position: 'absolute',
            bottom: -3,
            right: -3,
          },
        },
      };
    });

    marked[selectedDate] = {
      ...marked[selectedDate],
      selected: true,
      selectedColor: 'transparent',
      customStyles: {
        container: {
          borderWidth: 1,
          borderColor: 'black',
          borderRadius: 8,
        },
        text: {
          color: 'black',
          fontWeight: 'bold',
        },
      },
    };

    return marked;
  };

  const renderEvents = () => {
    const dateEvents = events[selectedDate] || [];
    if (dateEvents.length === 0) {
      return <Text style={styles.noEventsText}>No events for this day</Text>;
    }
  
    return dateEvents.map((event, index) => (
      <View key={event.id} style={styles.eventItemContainer}>
        <View style={styles.eventNameContainer}>
          <Text style={styles.eventText}>• {event.name}</Text>
        </View>
        <View style={styles.eventDetailsContainer}>
          <Text style={styles.eventTime}>{`${event.startTime} - ${event.endTime}`}</Text>
          <View style={styles.eventActionContainer}>
            <Pressable 
              onPress={() => {
                setEditingEvent(event);
                setModalVisible(true);
              }}
              style={styles.editButton}
            >
              <AntDesign name="edit" size={20} color="white" />
            </Pressable>
            <Pressable 
              onPress={() => {
                handleDeleteEvent(event) 
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
      <View style={styles.header}>
        <Pressable onPress={() => console.log("WKWK")}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </Pressable>
        <Text style={styles.headerTitle}>Gym Calendar</Text>
      </View>

      <View style={styles.borderLine} />

      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={getMarkedDates()}
          markingType={'custom'}
          style={styles.calendar}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#00adf5',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#00adf5',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            dotColor: '#00adf5',
            selectedDotColor: '#ffffff',
            arrowColor: 'orange',
            monthTextColor: 'black',
            textDayFontFamily: 'monospace',
            textMonthFontFamily: 'monospace',
            textDayHeaderFontFamily: 'monospace',
            textDayFontWeight: '300',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '300',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 16,
          }}
        />
      </View>

      <View style={styles.eventContainer}>
        <Text style={styles.eventDate}>
          {new Date(selectedDate).toLocaleDateString('en-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </Text>
        <ScrollView contentContainerStyle={styles.eventList}>
          {renderEvents()}
        </ScrollView>
      </View>

      <View style={styles.addButtonContainer}>
        <Pressable 
          style={styles.addButton} 
          onPress={createNewEvent}
        >
          <AntDesign name="pluscircle" size={60} color="#FFFFFF" />
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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 44, // Added for iOS status bar
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  borderLine: {
    height: 1,
    backgroundColor: '#E3E3E3',
    marginHorizontal: 16,
  },
  calendarContainer: {
    paddingHorizontal: 20,
    margin: 20,
    shadowColor: '#D6D8E1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 20,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  calendar: {
    borderRadius: 10,
    elevation: 5,
  },
  eventContainer: {
    flex: 1,
    backgroundColor: '#ffa500',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 20,
    marginTop: 20,
  },
  eventDate: {
    paddingTop: 5,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  eventList: {
    paddingBottom: 50,
  },
  noEventsText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  eventItem: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  verticalLine: {
    marginBottom: -5,
    marginLeft: 2,
    width: 2,
    height: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 5,
  },
  eventTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
  },
  eventTime: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    alignItems: 'center',
  },
  addButton: {
    borderRadius: 30,
    padding: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    marginTop: 0,
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  timeContainer: {
    flexDirection: 'column',
    gap: 16,
  },
  timeInputWrapper: {
    flex: 1,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeInputField: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    width: 60,
    textAlign: 'center',
  },
  timeSeparator: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f2f2f2',
  },
  saveButton: {
    backgroundColor: '#ffa500',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
  },
  saveButtonText: {
    color: 'white',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  eventNameContainer: {
    flex: 1,
  },
  eventDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  eventItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  editButton: {
    // backgroundColor: 'green',
    borderRadius: 15,
    padding: 5,
  },
  deleteButton: {
    // backgroundColor: 'red',
    borderRadius: 15,
    padding: 5,
  },
});

export default CalendarScreen;