'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerUsuario, registerFuncionario } from '@/lib/api';
import { Eye, EyeOff, User, Briefcase } from 'lucide-react';

export default function RegisterPage() {
  const [userType, setUserType] = useState<'usuario' | 'funcionario'>('usuario');
  const [formData, setFormData] = useState({
    // Campos comuns
    nome: '',
    sobrenome: '',
    email: '',
    senha: '',
    confirmSenha: '',
    telefone: '',
    cep: '',
    numero: '',
    complemento: '',
    // Campos específicos
    cpf: '', // Para usuário
    celular: '', // Para usuário
    idFuncionario: '', // Para funcionário
    funcao: 'Default' as 'Default' | 'Veterinario' | 'Gerente' | 'Master', // Para funcionário
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validações
    if (formData.senha !== formData.confirmSenha) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (formData.senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      let response;
      if (userType === 'usuario') {
        response = await registerUsuario({
          cpf: formData.cpf,
          nome: formData.nome,
          sobrenome: formData.sobrenome,
          email: formData.email,
          senha: formData.senha,
          celular: formData.celular,
          cep: formData.cep || undefined,
          numero: formData.numero || undefined,
          complemento: formData.complemento || undefined,
        });
      } else {
        response = await registerFuncionario({
          idFuncionario: formData.idFuncionario,
          nome: formData.nome,
          sobrenome: formData.sobrenome,
          email: formData.email,
          senha: formData.senha,
          funcao: formData.funcao,
          telefone: formData.telefone || undefined,
          cep: formData.cep || undefined,
          numero: formData.numero || undefined,
          complemento: formData.complemento || undefined,
        });
      }

      if (response.status === 'success') {
        setSuccess('Cadastro realizado com sucesso! Redirecionando para o login...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
            Crie sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link href="/login" className="font-medium text-pink-600 hover:text-pink-500">
              entre na sua conta existente
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

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
              {success}
            </div>
          )}

          <div className="space-y-4">
            {/* Campo específico para tipo de usuário */}
            {userType === 'usuario' ? (
              <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
                  CPF *
                </label>
                <input
                  id="cpf"
                  name="cpf"
                  type="text"
                  required
                  value={formData.cpf}
                  onChange={handleChange}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  placeholder="Digite seu CPF"
                />
              </div>
            ) : (
              <div>
                <label htmlFor="idFuncionario" className="block text-sm font-medium text-gray-700">
                  ID do Funcionário *
                </label>
                <input
                  id="idFuncionario"
                  name="idFuncionario"
                  type="text"
                  required
                  value={formData.idFuncionario}
                  onChange={handleChange}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  placeholder="Digite o ID do funcionário"
                />
              </div>
            )}

            {/* Campos comuns */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                  Nome *
                </label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  required
                  value={formData.nome}
                  onChange={handleChange}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  placeholder="Nome"
                />
              </div>

              <div>
                <label htmlFor="sobrenome" className="block text-sm font-medium text-gray-700">
                  Sobrenome *
                </label>
                <input
                  id="sobrenome"
                  name="sobrenome"
                  type="text"
                  required
                  value={formData.sobrenome}
                  onChange={handleChange}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  placeholder="Sobrenome"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                placeholder="Digite seu email"
              />
            </div>

            {/* Campo específico para telefone */}
            <div>
              <label htmlFor={userType === 'usuario' ? 'celular' : 'telefone'} className="block text-sm font-medium text-gray-700">
                {userType === 'usuario' ? 'Celular' : 'Telefone'}
              </label>
              <input
                id={userType === 'usuario' ? 'celular' : 'telefone'}
                name={userType === 'usuario' ? 'celular' : 'telefone'}
                type="tel"
                value={userType === 'usuario' ? formData.celular : formData.telefone}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                placeholder={`Digite seu ${userType === 'usuario' ? 'celular' : 'telefone'}`}
              />
            </div>

            {/* Função para funcionário */}
            {userType === 'funcionario' && (
              <div>
                <label htmlFor="funcao" className="block text-sm font-medium text-gray-700">
                  Função
                </label>
                <select
                  id="funcao"
                  name="funcao"
                  value={formData.funcao}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                >
                  <option value="Default">Padrão</option>
                  <option value="Veterinario">Veterinário</option>
                  <option value="Gerente">Gerente</option>
                  <option value="Master">Master</option>
                </select>
              </div>
            )}

            {/* Senhas */}
            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                Senha *
              </label>
              <div className="mt-1 relative">
                <input
                  id="senha"
                  name="senha"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.senha}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
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

            <div>
              <label htmlFor="confirmSenha" className="block text-sm font-medium text-gray-700">
                Confirmar Senha *
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmSenha"
                  name="confirmSenha"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmSenha}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  placeholder="Confirme sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Endereço (opcional) */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Endereço (opcional)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cep" className="block text-sm font-medium text-gray-700">
                    CEP
                  </label>
                  <input
                    id="cep"
                    name="cep"
                    type="text"
                    value={formData.cep}
                    onChange={handleChange}
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                    placeholder="CEP"
                  />
                </div>

                <div>
                  <label htmlFor="numero" className="block text-sm font-medium text-gray-700">
                    Número
                  </label>
                  <input
                    id="numero"
                    name="numero"
                    type="text"
                    value={formData.numero}
                    onChange={handleChange}
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                    placeholder="Número"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="complemento" className="block text-sm font-medium text-gray-700">
                  Complemento
                </label>
                <input
                  id="complemento"
                  name="complemento"
                  type="text"
                  value={formData.complemento}
                  onChange={handleChange}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  placeholder="Apartamento, sala, etc."
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

