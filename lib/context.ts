import { User } from "@firebase/auth";
import { createContext } from "react";

type UserContextType = {
	user: User | null | undefined;
	username: null;
};

export const UserContext = createContext<UserContextType>({ user: null, username: null });
