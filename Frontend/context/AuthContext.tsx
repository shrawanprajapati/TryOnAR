import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import {
  type AuthUser,
  fetchCurrentUser,
  loginUser,
  logoutUser,
  signUpUser,
  updateCurrentUser,
} from '../lib/api';
import { DEFAULT_PROFILE, PROFILE_STORAGE_KEYS } from '../constants/profile';

const AUTH_STORAGE_KEY = 'auth_token';
const ONBOARDING_STORAGE_KEY = 'onboarding_complete';

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isReady: boolean;
  isAuthenticated: boolean;
  onboardingComplete: boolean;
  signIn: (payload: { email: string; password: string }) => Promise<void>;
  signUp: (payload: { name: string; email: string; password: string; role?: string }) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (payload: {
    name: string;
    email: string;
    role: string;
  }) => Promise<void>;
  completeOnboarding: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function syncProfileStorage(user: Pick<AuthUser, 'name' | 'email' | 'role'> | null) {
  if (!user) {
    await Promise.all([
      AsyncStorage.setItem(PROFILE_STORAGE_KEYS.name, DEFAULT_PROFILE.name),
      AsyncStorage.setItem(PROFILE_STORAGE_KEYS.email, DEFAULT_PROFILE.email),
      AsyncStorage.setItem(PROFILE_STORAGE_KEYS.role, DEFAULT_PROFILE.role),
    ]);
    return;
  }

  await Promise.all([
    AsyncStorage.setItem(PROFILE_STORAGE_KEYS.name, user.name),
    AsyncStorage.setItem(PROFILE_STORAGE_KEYS.email, user.email),
    AsyncStorage.setItem(PROFILE_STORAGE_KEYS.role, user.role),
  ]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      try {
        const [storedToken, storedOnboarding] = await Promise.all([
          AsyncStorage.getItem(AUTH_STORAGE_KEY),
          AsyncStorage.getItem(ONBOARDING_STORAGE_KEY),
        ]);

        if (!isMounted) {
          return;
        }

        setOnboardingComplete(storedOnboarding === 'true');

        if (!storedToken) {
          setIsReady(true);
          return;
        }

        try {
          const profile = await fetchCurrentUser(storedToken);

          if (!isMounted) {
            return;
          }

          setToken(storedToken);
          setUser(profile);
          await syncProfileStorage(profile);
        } catch {
          await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
          await syncProfileStorage(null);
        }
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    };

    void bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  const signIn = async (payload: { email: string; password: string }) => {
    const session = await loginUser(payload);
    setToken(session.token);
    setUser(session.user);
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, session.token);
    await syncProfileStorage(session.user);
  };

  const signUp = async (payload: { name: string; email: string; password: string; role?: string }) => {
    const session = await signUpUser(payload);
    setToken(session.token);
    setUser(session.user);
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, session.token);
    await syncProfileStorage(session.user);
  };

  const signOut = async () => {
    if (token) {
      try {
        await logoutUser(token);
      } catch {
        // Ignore logout network failures and still clear local session.
      }
    }

    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    await syncProfileStorage(null);
  };

  const refreshProfile = async () => {
    if (!token) {
      return;
    }

    const profile = await fetchCurrentUser(token);
    setUser(profile);
    await syncProfileStorage(profile);
  };

  const updateProfile = async (payload: {
    name: string;
    email: string;
    role: string;
  }) => {
    if (!token) {
      throw new Error('You must be logged in to update your profile.');
    }

    const profile = await updateCurrentUser(token, payload);
    setUser(profile);
    await syncProfileStorage(profile);
  };

  const completeOnboarding = async () => {
    setOnboardingComplete(true);
    await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isReady,
      isAuthenticated: Boolean(token && user),
      onboardingComplete,
      signIn,
      signUp,
      signOut,
      refreshProfile,
      updateProfile,
      completeOnboarding,
    }),
    [isReady, onboardingComplete, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
