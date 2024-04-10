// services/firebaseService.js
import { database } from '../../firebaseConfig';
import { ref, set, onValue } from "firebase/database";

/**
 * Writes an item with a name and description to the Firebase Realtime Database.
 * 
 * @param {string} itemId - Unique identifier for the item.
 * @param {string} name - Name of the item.
 * @param {string} description - Description of the item.
 */
export const writeUserData = (itemId, name, description) => {
  return set(ref(database, 'items/' + itemId), {
    name: name,
    description: description
  });
};

/**
 * Reads an item's data from the Firebase Realtime Database and executes a callback with the data.
 * 
 * @param {string} itemId - Unique identifier for the item to read.
 * @param {Function} callback - Callback function to execute with the item data.
 */
export const readUserData = (itemId, callback) => {
  const itemRef = ref(database, 'items/' + itemId);
  onValue(itemRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
};

