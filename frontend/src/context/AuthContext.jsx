
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authVersion, setAuthVersion] = useState(0);

  const refreshUser = useCallback(async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setUser(null);
      return null;
    }

    try {
      await currentUser.reload();
      await currentUser.getIdToken(true);

      setUser(currentUser);
      setAuthVersion((version) => version + 1);

      return currentUser;
    } catch (error) {
      console.error("Failed to refresh authentication:", error);
      return null;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          await currentUser.reload();
          setUser(currentUser);
          setAuthVersion((version) => version + 1);
        } else {
          setUser(null);
          setAuthVersion((version) => version + 1);
        }
      } catch (error) {
        console.error("Failed to load authentication state:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, authVersion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
