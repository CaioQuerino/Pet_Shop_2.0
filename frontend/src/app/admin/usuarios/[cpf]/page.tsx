'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getUsuarioByCpf, Usuario } from '@/lib/api';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin,
  CreditCard,
  UserCheck,
  Edit,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

export default function DetalhesClientePage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user, userType, isLoggedIn } = useAuth();
  const router = useRouter();
  const params = useParams();
  const cpf = params.cpf as string;

  // Verificar se o usuário está logado e é um funcionário
  useEffect(() => {
    if (!isLoggedIn || userType !== 'funcionario') {
      router.push('/login');
      return;
    }

    const fetchUsuario = async () => {
      try {
        setLoading(true);
        const response = await getUsuarioByCpf(cpf);
        const usuarioData = response.data?.usuario || response;
        setUsuario(usuarioData);
      } catch (error: any) {
        console.error('Erro ao carregar usuário:', error);
        setError('Erro ao carregar dados do cliente');
      } finally {
        setLoading(false);
      }
    };

    if (cpf) {
      fetchUsuario();
    }
  }, [cpf, isLoggedIn, userType, router]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Não informado';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  if (!isLoggedIn || userType !== 'funcionario') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <UserCheck className="mx-auto h-12 w-12 text-pink-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Restrito</h2>
          <p className="text-gray-600 mb-4">Você precisa estar logado como funcionário para acessar esta área.</p>
          <Link href="/login" className="text-pink-600 hover:text-pink-500">
            Fazer Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-8 w-64"></div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="space-y-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i}>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-24"></div>
                    <div className="h-6 bg-gray-200 rounded w-48"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !usuario) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/admin/usuarios" 
            className="inline-flex items-center text-pink-600 hover:text-pink-500 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Clientes
          </Link>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Cliente não encontrado</h2>
            <p className="text-gray-600 mb-4">
              {error || 'O cliente solicitado não foi encontrado.'}
            </p>
            <Link 
              href="/admin/usuarios"
              className="text-pink-600 hover:text-pink-500"
            >
              Voltar para lista de clientes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/admin/usuarios" 
            className="inline-flex items-center text-pink-600 hover:text-pink-500 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Clientes
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {usuario.nome} {usuario.sobrenome}
              </h1>
              <p className="text-gray-600 mt-2">Detalhes do cliente</p>
            </div>
            <div className="flex space-x-2">
              <Link 
                href={`/admin/usuarios/editar/${usuario.cpf}`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Link>
              <button className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md text-red-700 bg-white hover:bg-red-50 transition-colors">
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </button>
            </div>
          </div>
        </div>

        {/* Informações do Cliente */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações Pessoais */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <User className="h-5 w-5 mr-2 text-pink-600" />
                Informações Pessoais
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <p className="text-gray-900 font-medium">
                    {usuario.nome} {usuario.sobrenome}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CPF
                  </label>
                  <p className="text-gray-900 font-medium flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                    {formatCPF(usuario.cpf)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900 font-medium flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    {usuario.email}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <p className="text-gray-900 font-medium flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    {usuario.celular || 'Não informado'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Nascimento
                  </label>
                  <p className="text-gray-900 font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    {formatDate(usuario.dataNascimento)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Cadastro
                  </label>
                  <p className="text-gray-900 font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    {formatDate(usuario.dataCadastro)}
                  </p>
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-pink-600" />
                Endereço
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logradouro
                  </label>
                  <p className="text-gray-900 font-medium">
                    {usuario.logradouro || 'Não informado'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número
                  </label>
                  <p className="text-gray-900 font-medium">
                    {usuario.numero || 'Não informado'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Complemento
                  </label>
                  <p className="text-gray-900 font-medium">
                    {usuario.complemento || 'Não informado'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bairro
                  </label>
                  <p className="text-gray-900 font-medium">
                    {usuario.bairro || 'Não informado'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CEP
                  </label>
                  <p className="text-gray-900 font-medium">
                    {usuario.cep || 'Não informado'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cidade
                  </label>
                  <p className="text-gray-900 font-medium">
                    {usuario.cidade || 'Não informado'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <p className="text-gray-900 font-medium">
                    {usuario.estado || 'Não informado'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar com Resumo */}
          <div className="space-y-6">
            {/* Card de Resumo */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="h-20 w-20 rounded-full bg-pink-100 flex items-center justify-center">
                    <span className="text-2xl font-bold text-pink-600">
                      {usuario.nome.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="font-medium text-gray-900">
                    {usuario.nome} {usuario.sobrenome}
                  </p>
                  <p className="text-sm text-gray-600">Cliente</p>
                </div>

                <div className="border-t pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium text-green-600">Ativo</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Pets cadastrados:</span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Agendamentos:</span>
                      <span className="font-medium">0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
              
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                  Ver pets do cliente
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                  Histórico de agendamentos
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                  Enviar email
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors">
                  Desativar cliente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

