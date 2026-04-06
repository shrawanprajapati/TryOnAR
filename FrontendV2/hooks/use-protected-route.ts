import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import { useAuth } from '../context/AuthContext';

export function useProtectedRoute(redirectTo: '/login' | '/onboarding1' = '/login') {
  const router = useRouter();
  const { isAuthenticated, isReady, onboardingComplete } = useAuth();

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!onboardingComplete) {
      router.replace('/onboarding1');
      return;
    }

    if (!isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isReady, onboardingComplete, redirectTo, router]);

  return {
    isAuthenticated,
    isReady,
  };
}
