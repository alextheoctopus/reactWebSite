import * as AuthAPI from "../api/auth";
import { getToken } from "../api/client";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    const me = await AuthAPI.me();
    setUser(me);
    localStorage.setItem("user", JSON.stringify(me));
    return me;
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const token = getToken();
      if (!token) {
        if (!cancelled) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const me = await AuthAPI.me();
        if (!cancelled) {
          setUser(me);
          localStorage.setItem("user", JSON.stringify(me));
        }
      } catch {
        if (!cancelled) {
          AuthAPI.logout();
          localStorage.removeItem("user");
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(
    async ({ login, password }) => {
      setLoading(true);
      setError(null);
      try {
        await AuthAPI.login({ login, password });
        await refresh();
      } catch (e) {
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [refresh]
  );

  const register = useCallback(
    async ({ name, login, password }) => {
      setLoading(true);
      setError(null);
      try {
        await AuthAPI.register({ name, login, password });
        await refresh();
      } catch (e) {
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [refresh]
  );

  const logout = useCallback(() => {
    AuthAPI.logout();
    localStorage.removeItem("user");
    setUser(null);
    setLoading(false);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuth: Boolean(user),
      loading,
      error,
      login,
      register,
      logout,
      refresh,
    }),
    [user, loading, error, login, register, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
