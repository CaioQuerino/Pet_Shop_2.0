'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { loginUsuario, loginFuncionario } from '@/lib/api';
import { Eye, EyeOff, User, Briefcase } from 'lucide-react';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });
  const [userType, setUserType] = useState<'usuario' | 'funcionario'>('usuario');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;
      if (userType === 'usuario') {
        response = await loginUsuario(formData);
      } else {
        response = await loginFuncionario(formData);
      }

      if (response.status === 'success') {
        const userData = userType === 'usuario' ? response.data.user : response.data.funcionario;
        login(userData, response.data.token, userType);
        router.push('/');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Entre na sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link href="/register" className="font-medium text-pink-600 hover:text-pink-500">
              crie uma nova conta
            </Link>
          </p>
        </div>

        {/* Seletor de tipo de usuário */}
        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setUserType('usuario')}
            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              userType === 'usuario'
                ? 'bg-white text-pink-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <User className="h-4 w-4 mr-2" />
            Cliente
          </button>
          <button
            type="button"
            onClick={() => setUserType('funcionario')}
            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              userType === 'funcionario'
                ? 'bg-white text-pink-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Briefcase className="h-4 w-4 mr-2" />
            Funcionário
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                placeholder="Digite seu email"
              />
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1 relative">
                <input
                  id="senha"
                  name="senha"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.senha}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>

          <div className="text-center">
            <Link href="/forgot-password" className="text-sm text-pink-600 hover:text-pink-500">
              Esqueceu sua senha?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

