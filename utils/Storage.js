import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Save a value to storage
 */
export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.log('[Storage] Error storing key:', key, e);
  }
};

/**
 * Retrieve a value from storage
 */
export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null ? value : null;
  } catch (e) {
    console.log('[Storage] Error getting key:', key, e);
    return null;
  }
};

/**
 * Remove a key
 */
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log('[Storage] Error removing key:', key, e);
  }
};
