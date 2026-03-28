import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import * as SecureStore from "expo-secure-store";
import { useRouter, useSegments } from "expo-router";
import { api } from "../lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  headline?: string;
  summary?: string;
  skills?: string[];
  tier?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  const checkAuth = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (token) {
        const profile = await api.getProfile();
        setUser(profile.user || profile);
      }
    } catch {
      await SecureStore.deleteItemAsync("token");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isLoading) return;
    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [user, segments, isLoading, router]);

  const login = async (email: string, password: string) => {
    const data = await api.login({ email, password });
    await SecureStore.setItemAsync("token", data.token);
    setUser(data.user);
  };

  const signup = async (name: string, email: string, password: string) => {
    const data = await api.signup({ name, email, password });
    await SecureStore.setItemAsync("token", data.token);
    setUser(data.user);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("token");
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const profile = await api.getProfile();
      setUser(profile.user || profile);
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, signup, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
