import React, { createContext, useContext, useEffect, useState } from 'react';

import {
  auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from '@/lib/firebase';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function signIn(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email.trim(), password);
  }

  async function signUp(email: string, password: string) {
    await createUserWithEmailAndPassword(auth, email.trim(), password);
  }

  async function signOutUser() {
    await signOut(auth);
  }

  async function getIdToken() {
    return auth.currentUser ? auth.currentUser.getIdToken() : null;
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOutUser, getIdToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
