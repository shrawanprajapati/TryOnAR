import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { fetchProfile, syncUser } from '../lib/api';
import { useAuth as useFirebaseAuth } from './auth-context';

const ONBOARDING_STORAGE_KEY = 'onboarding_complete';
const PROFILE_NAME_STORAGE_KEY = 'profile_name';
const PROFILE_ROLE_STORAGE_KEY = 'profile_role';
const DEFAULT_ROLE = 'AR Creator';

export type AuthUser = {
  id: number | null;
  firebaseUid: string;
  email: string;
  name: string;
  role: string;
};

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
  updateProfile: (payload: { name: string; email: string; role: string }) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  restartOnboarding: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function buildFallbackUser(args: {
  email: string | null | undefined;
  uid: string | null | undefined;
  storedName?: string | null;
  storedRole?: string | null;
  remoteName?: string | null;
}) {
  const email = args.email || 'No email available';
  const derivedName =
    args.remoteName || args.storedName || (email.includes('@') ? email.split('@')[0] : email) || 'AR Creator';

  return {
    id: null,
    firebaseUid: args.uid || '',
    email,
    name: derivedName,
    role: args.storedRole || DEFAULT_ROLE,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    user: firebaseUser,
    loading,
    signIn: firebaseSignIn,
    signUp: firebaseSignUp,
    signOutUser,
    getIdToken,
  } = useFirebaseAuth();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [bootstrapped, setBootstrapped] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      try {
        const storedOnboarding = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);

        if (isMounted) {
          setOnboardingComplete(storedOnboarding === 'true');
        }
      } finally {
        if (isMounted) {
          setBootstrapped(true);
        }
      }
    };

    void bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!firebaseUser) {
      setUser(null);
      setToken(null);
      return;
    }

    const nextToken = await getIdToken();

    if (!nextToken) {
      setUser(null);
      setToken(null);
      throw new Error('Your session expired. Please log in again.');
    }

    setToken(nextToken);

    const [storedName, storedRole] = await Promise.all([
      AsyncStorage.getItem(PROFILE_NAME_STORAGE_KEY),
      AsyncStorage.getItem(PROFILE_ROLE_STORAGE_KEY),
    ]);

    try {
      await syncUser(nextToken, firebaseUser.email);
      const profile = await fetchProfile(nextToken);
      const resolvedName =
        profile.databaseUser?.name ||
        profile.name ||
        storedName ||
        (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'AR Creator');
      const resolvedRole = storedRole || DEFAULT_ROLE;

      await Promise.all([
        AsyncStorage.setItem(PROFILE_NAME_STORAGE_KEY, resolvedName),
        AsyncStorage.setItem(PROFILE_ROLE_STORAGE_KEY, resolvedRole),
      ]);

      setUser({
        id: profile.databaseUser?.id ?? null,
        firebaseUid: profile.databaseUser?.firebaseUid || profile.uid,
        email: profile.databaseUser?.email || profile.email || firebaseUser.email || 'No email available',
        name: resolvedName,
        role: resolvedRole,
      });
    } catch (error) {
      setUser(
        buildFallbackUser({
          email: firebaseUser.email,
          uid: firebaseUser.uid,
          storedName,
          storedRole,
          remoteName: firebaseUser.displayName,
        })
      );
      throw error;
    }
  }, [firebaseUser, getIdToken]);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!firebaseUser) {
      setUser(null);
      setToken(null);
      return;
    }

    void refreshProfile().catch(() => undefined);
  }, [firebaseUser, loading, refreshProfile]);

  const signIn = async (payload: { email: string; password: string }) => {
    await firebaseSignIn(payload.email, payload.password);
  };

  const signUp = async (payload: { name: string; email: string; password: string; role?: string }) => {
    await firebaseSignUp(payload.email, payload.password);

    await Promise.all([
      AsyncStorage.setItem(PROFILE_NAME_STORAGE_KEY, payload.name.trim() || 'AR Creator'),
      AsyncStorage.setItem(PROFILE_ROLE_STORAGE_KEY, payload.role?.trim() || DEFAULT_ROLE),
    ]);
  };

  const signOut = async () => {
    await signOutUser();
    setUser(null);
    setToken(null);
  };

  const updateProfile = async (payload: { name: string; email: string; role: string }) => {
    await Promise.all([
      AsyncStorage.setItem(PROFILE_NAME_STORAGE_KEY, payload.name.trim() || 'AR Creator'),
      AsyncStorage.setItem(PROFILE_ROLE_STORAGE_KEY, payload.role.trim() || DEFAULT_ROLE),
    ]);

    setUser((currentUser) =>
      currentUser
        ? {
            ...currentUser,
            name: payload.name.trim() || currentUser.name,
            email: payload.email.trim() || currentUser.email,
            role: payload.role.trim() || currentUser.role,
          }
        : currentUser
    );
  };

  const completeOnboarding = useCallback(async () => {
    setOnboardingComplete(true);
    await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
  }, []);

  const restartOnboarding = useCallback(async () => {
    setOnboardingComplete(false);
    await AsyncStorage.removeItem(ONBOARDING_STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isReady: bootstrapped && !loading,
      isAuthenticated: Boolean(firebaseUser),
      onboardingComplete,
      signIn,
      signUp,
      signOut,
      refreshProfile,
      updateProfile,
      completeOnboarding,
      restartOnboarding,
    }),
    [
      bootstrapped,
      completeOnboarding,
      firebaseUser,
      loading,
      onboardingComplete,
      refreshProfile,
      restartOnboarding,
      token,
      user,
    ]
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
