import { auth } from "@lib/firebase";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

// Custom hook to read  auth record and user profile doc
export function useUserData() {
	const [user] = useAuthState(auth);
	const [username, setUsername] = useState(null);

	useEffect(() => {
		//when user object is changed fetch user data from firestore database
		//also want to sub/unsub to realtime document changes
		let unsubscribe;

		//if we have a user need to match it with the firestore user collection
		if (user) {
			const ref = doc(getFirestore(), "users", user.uid);

			//returns callback that will performs unsubscription op
			unsubscribe = onSnapshot(ref, (doc) => {
				setUsername(doc.data()?.username);
			});
		} else {
			setUsername(null);
		}

		return unsubscribe;
	}, [user]);

	return { user, username };
}
