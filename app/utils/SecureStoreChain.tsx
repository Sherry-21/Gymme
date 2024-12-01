import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const isWeb = Platform.OS === 'web';

export async function setItems(key:string, value:string) {
    if (isWeb) {
        await AsyncStorage.setItem(key, value);
    } else {
        await SecureStore.setItemAsync(key, value);
    }
}
export async function getItems(key:string) {
    if (isWeb) {
        return await AsyncStorage.getItem(key);
    } else {
        return await SecureStore.getItemAsync(key);
    }
}

export async function deleteItem(key:string) {
    if (isWeb) {
        await AsyncStorage.removeItem(key);
    } else {
        await SecureStore.deleteItemAsync(key);
    }
}
