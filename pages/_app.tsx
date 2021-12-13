import { UserContext } from "@lib/context";
import { useUserData } from "@lib/hooks";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import "../styles/globals.css";

/** this component is the entry point for next (wraps all pages)
 *can be used to manage Auth in Client Side
 */
function MyApp({ Component, pageProps }: AppProps) {
	const userData = useUserData();

	return (
		<UserContext.Provider value={userData}>
			<Navbar />
			<Component {...pageProps} />
			<Toaster />
		</UserContext.Provider>
	);
}

export default MyApp;
