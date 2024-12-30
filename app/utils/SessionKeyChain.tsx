// import * as SecureStore from 'expo-secure-store';

// export const saveSecureItem = async (key: string, value: string): Promise<void> => {
// localStorage.setItem(key, value);
//     // try {
//     //     await SecureStore.setItemAsync(key, value, {
//     //         keychainAccessible: SecureStore.WHEN_UNLOCKED,
//     //     });
//     // } catch (error) {
//     //     console.error(`Error saving ${key}:`, error);
//     // }
// };

// export const getSecureItem = async (key: string): Promise<string | null> => {
// return await   localStorage.getItem(key)
//     // try {
//     //     return await SecureStore.getItemAsync(key);
//     // } catch (error) {
//     //     console.error(`Error retrieving ${key}:`, error);
//     //     return null;
//     // }
// };

// export const deleteSecureItem = async (key: string): Promise<void> => {
//     try {
//         await SecureStore.deleteItemAsync(key);
//     } catch (error) {
//         console.error(`Error deleting ${key}:`, error);
//     }
// };
