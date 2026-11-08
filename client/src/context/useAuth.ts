import { createContext, useContext } from "react";

export interface User {
  id: number;
  username: string;
  birthday: string | null;
  age: number | null;
}

export interface AuthContextType {
  isLoggedIn: boolean;
  checkLogin: () => Promise<void>;
  User?: User;
  birthdayGreeting: boolean;
  clearBirthdayGreeting: () => void;
  updateUser: (user: User) => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
