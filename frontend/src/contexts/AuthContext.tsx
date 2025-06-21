'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Usuario, Funcionario } from '@/lib/api';

interface AuthContextType {
  user: Usuario | Funcionario | null;
  userType: 'usuario' | 'funcionario' | null;
  isLoggedIn: boolean;
  login: (userData: Usuario | Funcionario, token: string, type: 'usuario' | 'funcionario') => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | Funcionario | null>(null);
  const [userType, setUserType] = useState<'usuario' | 'funcionario' | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há dados de autenticação no localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    const storedUserType = localStorage.getItem('userType') as 'usuario' | 'funcionario' | null;

    if (token && userData && storedUserType) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setUserType(storedUserType);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (userData: Usuario | Funcionario, token: string, type: 'usuario' | 'funcionario') => {
    localStorage.setItem('token', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('userType', type);
    
    setUser(userData);
    setUserType(type);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('userType');
    
    setUser(null);
    setUserType(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      userType,
      isLoggedIn,
      login,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

