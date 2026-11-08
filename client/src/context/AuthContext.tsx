import React, { useState, useEffect, useRef, useCallback } from 'react';
import auth from '../utils/auth';
import { AuthContext, type User } from './useAuth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [User, setUser] = useState<User | undefined>(undefined);
  const [birthdayGreeting, setBirthdayGreeting] = useState(false);
  const [loading, setLoading] = useState(true);
  const initialCheckStarted = useRef(false);
  const checkRequestId = useRef(0);

  const checkLogin = useCallback(async () => {
    const requestId = ++checkRequestId.current;
    const token = auth.getToken();
    if (!token || !auth.loggedIn()) {
      if (token) {
        auth.logout(false);
      }
      setIsLoggedIn(false);
      setUser(undefined);
      setBirthdayGreeting(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/user/settings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (requestId !== checkRequestId.current) return;
      if (response.status === 401 || response.status === 403) {
        auth.logout(false);
        setIsLoggedIn(false);
        setUser(undefined);
        setBirthdayGreeting(false);
        return;
      }
      if (!response.ok) {
        throw new Error(data.message || `Profile request failed (${response.status})`);
      }
      setIsLoggedIn(true);
      setUser(data.user);
      setBirthdayGreeting(Boolean(data.birthdayGreeting));
    } catch (error) {
      if (requestId !== checkRequestId.current) return;
      console.error('Could not refresh account profile:', error);
      const decoded = auth.getProfile();
      setIsLoggedIn(true);
      setUser({
        id: decoded.id ?? -1,
        username: decoded.username || 'Unknown',
        birthday: null,
        age: null,
      });
      setBirthdayGreeting(false);
    } finally {
      if (requestId === checkRequestId.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!initialCheckStarted.current) {
      initialCheckStarted.current = true;
      void checkLogin();
    }
  }, [checkLogin]);

  const updateUser = useCallback((user: User) => setUser(user), []);
  const clearBirthdayGreeting = useCallback(() => setBirthdayGreeting(false), []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        checkLogin,
        User,
        birthdayGreeting,
        clearBirthdayGreeting,
        updateUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
