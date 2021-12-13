import { FirebaseOptions, getApp, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { collection, getDocs, getFirestore, limit, query, where } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyD6hUgfxOG-TumgcxhVmT126qCBpcSTexA",
	authDomain: "nextfire-app-ade59.firebaseapp.com",
	projectId: "nextfire-app-ade59",
	storageBucket: "nextfire-app-ade59.appspot.com",
	messagingSenderId: "603643828883",
	appId: "1:603643828883:web:bc385fb9f9b6ad99e74b66",
	measurementId: "G-WBS8KY4HTP",
};

function createFirebaseApp(config: FirebaseOptions) {
	try {
		return getApp();
	} catch {
		return initializeApp(config);
	}
}

// const firebaseApp = initializeApp(firebaseConfig);
const firebaseApp = createFirebaseApp(firebaseConfig);

// Auth exports
// export const auth = firebase.auth();
export const auth = getAuth(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();

// Firestore exports
export const firestore = getFirestore(firebaseApp);
// export const firestore = firebase.firestore();
// export { firestore };
// export const serverTimestamp = serverTimestamp;
// export const fromMillis = fromMillis;
// export const increment = increment;

// Storage exports
export const storage = getStorage(firebaseApp);
export const STATE_CHANGED = "state_changed";

/// Helper functions

/**`
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
export async function getUserWithUsername(username: string) {
	// const usersRef = collection(firestore, 'users');
	// const query = usersRef.where('username', '==', username).limit(1);

	const q = query(collection(getFirestore(), "users"), where("username", "==", username), limit(1));
	const userDoc = (await getDocs(q)).docs[0];
	return userDoc;
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc: { data: () => any }) {
	const data = doc.data();
	return {
		...data,
		// Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
		createdAt: data?.createdAt.toMillis() || 0,
		updatedAt: data?.updatedAt.toMillis() || 0,
	};
}
