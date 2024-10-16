import React, { useState, useEffect, createContext, useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';
import Parse from '@/config/parseConfig';

interface AuthContextType {
  user: Parse.User | null;
  setUser: React.Dispatch<React.SetStateAction<Parse.User | null>>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Parse.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = Parse.User.currentAsync();
    currentUser
      .then((loggedInUser) => {
        setUser(loggedInUser);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const user = await Parse.User.logIn(username, password);
      setUser(user);
    } catch (error) {
      console.error('Ошибка при входе:', error);
    }
  };

  const logout = async () => {
    try {
      await Parse.User.logOut();
      setUser(null);
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
