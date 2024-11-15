// src/customer/context/AuthContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { User } from "../utils/types";
import { getUser } from "../api/user";

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = React.useCallback(async () => {
    try {
      if (localStorage.getItem("token")) {
        const user = await getUser();
        setUser(user);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  }, []);

  useEffect(() => {
    if (!user && localStorage.getItem("user")) {
      fetchUser();
    } else {
      console.log("User already exists");
    }
    // fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
