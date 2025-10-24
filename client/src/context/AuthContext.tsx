import React, { createContext, useState, useContext, useEffect } from 'react';
import auth from '../utils/auth';

interface User {
  id: number;
  username: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  checkLogin: () => void;
  User?: User; // Add the User object
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [User, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const checkLogin = () => {
    const token = auth.getToken();
    if (token) {
      const decoded = auth.getProfile();
      setIsLoggedIn(true);
      setUser({
        id: decoded.id ?? -1,
        username: decoded.username || 'Unknown',
      });
    } else {
      setIsLoggedIn(false);
      setUser(undefined);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, checkLogin, User, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};