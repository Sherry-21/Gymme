import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Pressable, Modal, StyleSheet, ScrollView, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';

interface Exercise {
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
    const [queue, setQueue] = useState<Exercise[]>([]);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [newExercise, setNewExercise] = useState<NewExercise>({
        name: '',
        hours: '',
        minutes: '',
        seconds: ''
    });

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const hoursInputRef = useRef<TextInput>(null);
    const minutesInputRef = useRef<TextInput>(null);
    const secondsInputRef = useRef<TextInput>(null);

    const timeToSeconds = (timeStr: string): number => {
        const [hours = 0, minutes = 0, seconds = 0] = timeStr.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    };

    const secondsToTime = (secs: number): string => {
        const hours = Math.floor(secs / 3600);
        const minutes = Math.floor((secs % 3600) / 60);
        const seconds = secs % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
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

    const handleAdd = (): void => {
        if (!newExercise.name || (!newExercise.hours && !newExercise.minutes && !newExercise.seconds)) {
            return;
        }

        const duration = `${newExercise.hours.padStart(2, '0')}:${newExercise.minutes.padStart(2, '0')}:${newExercise.seconds.padStart(2, '0')}`;
        const newTimer: Exercise = {
            name: newExercise.name,
            duration
        };

        setQueue((prev) => [...prev, newTimer]);

        if (!currentExercise) {
            setCurrentExercise(newTimer);
            setCurrentTime(timeToSeconds(duration));
        }

        setNewExercise({
            name: '',
            hours: '',
            minutes: '',
            seconds: ''
        });

        setShowAddModal(false);
    };

    const handleTimeInput = (field: keyof NewExercise, value: string, nextRef?: React.RefObject<TextInput>): void => {
        if (value === '' || (/^\d*$/.test(value) && parseInt(value || '0') < 60)) {
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
        if (e.nativeEvent.key === 'Backspace' && newExercise[field] === '' && prevRef && prevRef.current) {
            prevRef.current.focus();
        }
    };

    useEffect(() => {
        if (isRunning) {
            timerRef.current = setInterval(() => {
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
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isRunning, queue]);

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Timer</Text>
            <View style={styles.line} />

            <View style={styles.timerContainer}>
                <View style={styles.timerCircle}>
                    <Text style={styles.timerName}>{currentExercise?.name || ''}</Text>
                    <Text style={styles.timerDisplay}>
                        {currentExercise ? secondsToTime(currentTime) : '00:00:00'}
                    </Text>
                </View>
            </View>

            <Text style={styles.queueTitle}>Next queue</Text>
            <ScrollView contentContainerStyle={styles.queueList}>
                {queue.slice(currentExercise ? 1 : 0).map((exercise, index) => (
                    <View key={index} style={styles.queueItem}>
                        <Text style={styles.queueItemText}>{exercise.name}</Text>
                        <Text style={styles.queueItemTime}>{exercise.duration}</Text>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.controlSection}>
                <Pressable onPress={() => setShowAddModal(true)} style={styles.addButton}>
                    <Text style={styles.buttonText}>Add</Text>
                </Pressable>
                <Pressable onPress={handleStart} style={styles.startButton}>
                    <Text style={styles.buttonText}>{isRunning ? 'Pause' : 'Start'}</Text>
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
                            onChangeText={(text) => setNewExercise((prev) => ({ ...prev, name: text }))}
                        />
                        <View style={styles.timeInputContainer}>
                            <TextInput
                                ref={hoursInputRef}
                                placeholder="HH"
                                style={styles.timeInput}
                                value={newExercise.hours}
                                onChangeText={(text) => handleTimeInput('hours', text, minutesInputRef)}
                                maxLength={2}
                                keyboardType="numeric"
                            />
                            <Text>:</Text>
                            <TextInput
                                ref={minutesInputRef}
                                placeholder="MM"
                                style={styles.timeInput}
                                value={newExercise.minutes}
                                onChangeText={(text) => handleTimeInput('minutes', text, secondsInputRef)}
                                maxLength={2}
                                keyboardType="numeric"
                                onKeyPress={(e) => handleKeyDown(e, 'minutes', hoursInputRef)}
                            />
                            <Text>:</Text>
                            <TextInput
                                ref={secondsInputRef}
                                placeholder="SS"
                                style={styles.timeInput}
                                value={newExercise.seconds}
                                onChangeText={(text) => handleTimeInput('seconds', text)}
                                maxLength={2}
                                keyboardType="numeric"
                                onKeyPress={(e) => handleKeyDown(e, 'seconds', minutesInputRef)}
                            />
                        </View>
                        <View style={styles.modalButtonContainer}>
                            <Pressable onPress={() => setShowAddModal(false)} style={styles.modalCancelButton}>
                                <Text>Cancel</Text>
                            </Pressable>
                            <Pressable onPress={handleAdd} style={styles.modalAddButton}>
                                <Text style={{ color: 'white' }}>Add</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    headerTitle: { fontSize: 24, fontWeight: 'bold', marginTop: 20, textAlign: 'center' },
    line: { height: 1, backgroundColor: '#E5E7EB', width: '90%', alignSelf: 'center', marginVertical: 10 },
    timerContainer: { alignItems: 'center', marginVertical: 10 },
    timerCircle: {
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: '#F39C12',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 10,
        borderColor: '#A77800'
    },
    timerName: {
        fontSize: 24,
        color: 'white',
        position: 'absolute',
        top: 70,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    timerDisplay: {
        fontSize: 48,
        fontWeight: 'bold',
        color: 'white',
    },
    queueTitle: { fontSize: 28, fontWeight: 'bold', marginTop: 20,marginBottom: 10, textAlign: 'left',paddingLeft: 25},
    queueList: { paddingHorizontal: 20, paddingTop: 10 },
    queueItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 350,
        padding: 15,
        backgroundColor: '#fff',
        marginVertical: 8,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    queueItemText: { fontSize: 20, fontWeight: 'bold'},
    queueItemTime: { fontSize: 20, fontWeight:'bold' },
    controlSection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        backgroundColor: '#F39C12',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50
    },
    addButton: {
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    startButton: {
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: {
        margin: 20,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 20,
        alignItems: 'center'
    },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    modalInput: {
        borderColor: '#D1D5DB',
        borderWidth: 1,
        padding: 10,
        width: '100%',
        borderRadius: 8,
        marginBottom: 10
    },
    timeInputContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
    timeInput: {
        borderColor: '#D1D5DB',
        borderWidth: 1,
        padding: 10,
        width: 50,
        textAlign: 'center',
        borderRadius: 8,
        marginHorizontal: 5
    },
    modalButtonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
    modalCancelButton: { padding: 10, borderRadius: 8, backgroundColor: '#E5E7EB', marginHorizontal: 5 },
    modalAddButton: { padding: 10, borderRadius: 8, backgroundColor: '#FFA500', marginHorizontal: 5 },
});

export default WorkoutTimer;