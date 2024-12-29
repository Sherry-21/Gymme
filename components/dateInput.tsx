import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Platform, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface DateInputProps {
  onDateChange?: (date: string) => void;
}

const DateInput: React.FC<DateInputProps> = ({ onDateChange }) => {
  const [isFocused, setIsFocused] = useState(false);

  const [date, setDate] = useState('')

  const formatDate = (text: string) => {
    let numbers = text.replace(/[^\d]/g, '');
    if (numbers.length >= 2) {
      numbers = numbers.slice(0, 2) + '/' + numbers.slice(2);
    }
    if (numbers.length >= 5) {
      numbers = numbers.slice(0, 5) + '/' + numbers.slice(5);
    }
    numbers = numbers.slice(0, 10);
    setDate(numbers);
    if (onDateChange) {
      onDateChange(numbers);
    }
  };

  const showDatePicker = () => {
    // console.log(date)
    // // setShowPicker(true);
    // const now = new Date();
    // console.log(now)
    // const year = now.getFullYear();
    // const month = now.getMonth(); // Months are 0-based, January is 0
    // const lastDate = new Date(year, month, 0); // Passing 0 as the day gets the last day of the previous month
    // // return lastDate;
    // console.log(lastDate)
    // console.log(lastDate.getDate())
    // setShowPicker(true)
  };

  return (
    <View style={styles.wrapper}>
      <View style={[
        styles.container,
        isFocused && styles.focusedContainer,
        date && styles.filledContainer
      ]}>
        <View style={styles.labelContainer}>
          <Text style={[
            styles.label,
            (isFocused || date) && styles.floatingLabel
          ]}>
            Date
          </Text>
        </View>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={formatDate}
          keyboardType="numeric"
          maxLength={10}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isFocused || date ? 'dd/mm/yyyy' : ''}
          placeholderTextColor="rgba(107, 114, 128, 0.5)"
        />
        <View 
          style={styles.iconContainer} 
        >
          <MaterialIcons name='calendar-month' size={24}/>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 16,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: 'white',
    position: 'relative',
    height: 56,
  },
  focusedContainer: {
    borderColor: '#F39C12', 
    borderWidth: 2,
    shadowColor: '#F39C12', 
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filledContainer: {
    borderColor: '#F39C12', 
  },
  labelContainer: {
    position: 'absolute',
    left: 8,
    right: 8,
    top: -8,
    zIndex: 1,
  },
  label: {
    position: 'absolute',
    left: 4,
    top: 18,
    fontSize: 16,
    color: '#6B7280',
    backgroundColor: 'transparent',
    paddingHorizontal: 4,
  },
  floatingLabel: {
    top: -4,
    fontSize: 16,
    color: 'black',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    fontSize: 16,
    paddingTop: 8,
    color: '#374151',
  },
  iconContainer: {
    padding: 12,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DateInput;