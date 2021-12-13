//very usefull technique to resolve annoying relative paths
import { auth, googleAuthProvider } from "@lib/firebase";
import { useUserData } from "@lib/hooks";
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc, getFirestore, writeBatch } from "firebase/firestore";
import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";

export default function Enter({}) {
	const { user, username } = useUserData();

	//1. user signed out SignInButton
	//2. user signed in but missing username UsernameForm
	//3. user signed in has username SignOutButton

	return <main>{user ? !username ? <UsernameForm /> : <SignOutButton /> : <SignInButton />}</main>;
}

//sign in via Google btn
function SignInButton() {
	const signInWithGoogle = async () => {
		await signInWithPopup(auth, googleAuthProvider);
	};

	return (
		<button className="btn-google" onClick={signInWithGoogle}>
			<img src={"/google.png"} /> Sign in with Google
		</button>
	);
}

// Sign out button
function SignOutButton() {
	return <button onClick={auth.signOut}>Sign Out</button>;
}

//username
function UsernameForm() {
	const [formValue, setFormValue] = useState("");
	const [isValid, setIsValid] = useState(false);
	const [loading, setLoading] = useState(false);

	const { user, username } = useUserData();

	const onChange = (e: any) => {
		// Force form value typed in form to match correct format
		const val = e.target.value.toLowerCase();
		const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

		// Only set form value if length is < 3 OR it passes regex
		if (val.length < 3) {
			setFormValue(val);
			setLoading(false);
			setIsValid(false);
		}

		if (re.test(val)) {
			setFormValue(val);
			setLoading(true);
			setIsValid(false);
		}
	};

	useEffect(() => {
		checkUsername(formValue);
	}, [formValue]);

	// Hit the database for username match after each debounced change
	// useCallback is required for debounce to work
	const checkUsername = useCallback(
		_.debounce(async (username: string | null) => {
			if (username && username.length >= 3) {
				const ref = doc(getFirestore(), "usernames", username);
				const snap = await getDoc(ref);
				console.log("Firestore read executed!", snap.exists());
				setIsValid(!snap.exists());
				setLoading(false);
			}
		}, 500),
		[]
	);

	//TODO good idea to try catch this for edge cases at this point
	const onSubmit = async (e: { preventDefault: () => void }) => {
		e.preventDefault(); //prevents default (refresh of page)

		if (!user) return;

		// Create refs for both documents
		const userDoc = doc(getFirestore(), "users", user.uid);
		const usernameDoc = doc(getFirestore(), "usernames", formValue);

		// Commit both docs together as a batch write. (transaction)
		const batch = writeBatch(getFirestore());
		batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName });
		batch.set(usernameDoc, { uid: user.uid });

		await batch.commit();
	};

	return (
		!username && (
			<section>
				<h3>Choose username</h3>
				<form onSubmit={onSubmit}>
					<input type="text" name="username" placeholder="Please Enter username" value={formValue} onChange={onChange} />
					<UsernameMessage username={formValue} isValid={isValid} loading={loading} />
					<button type="submit" className="btn-green" disabled={!isValid}>
						Choose
					</button>
				</form>

				<h3>Debug State</h3>
				<div>
					Username: {formValue}
					<br />
					Loading: {loading.toString()}
					<br />
					Username Valid: {isValid.toString()}
				</div>
			</section>
		)
	);
}

type UsernameMessageType = {
	username: string | null;
	isValid: boolean;
	loading: boolean;
};

function UsernameMessage({ username, isValid, loading }: UsernameMessageType) {
	if (loading) {
		return <p>Checking...</p>;
	} else if (isValid) {
		return <p className="text-success">{username} is available!</p>;
	} else if (username && !isValid) {
		return <p className="text-danger">That username is taken!</p>;
	} else {
		return <p></p>;
	}
}
