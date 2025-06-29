'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getAllProdutos, getAllUsuarios, getAllFuncionarios, Usuario } from '@/lib/api';
import { 
  Users, 
  Package, 
  UserCheck, 
  TrendingUp, 
  Calendar,
  DollarSign,
  BarChart3,
  Settings
} from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    totalFuncionarios: 0,
    totalProdutos: 0,
    agendamentosHoje: 0,
  });
  const [recentUsers, setRecentUsers] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user, userType, isLoggedIn } = useAuth();
  const router = useRouter();

  // Verificar se o usuário está logado e é um funcionário
  useEffect(() => {
    if (!isLoggedIn || userType !== 'funcionario') {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // Buscar dados usando APIs corretas
        const [produtosRes, usuariosRes, funcionariosRes] = await Promise.all([
          getAllProdutos(),
          getAllUsuarios(),
          getAllFuncionarios()
        ]);
        
        setStats({
          totalUsuarios: usuariosRes.data.usuarios.length,
          totalFuncionarios: funcionariosRes.data.funcionarios.length,
          totalProdutos: produtosRes.data.produtos.length,
          agendamentosHoje: 0, // Placeholder - implementar quando tiver sistema de agendamento
        });

        // Pegar os 5 usuários mais recentes
        setRecentUsers(usuariosRes.data.usuarios.slice(-5).reverse());
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Erro ao carregar dados do painel');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn, userType, router]);

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-8 w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Painel Administrativo
          </h1>
          <p className="text-gray-600">
            Bem-vindo, {user?.nome}! Aqui você pode gerenciar o PetShop.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Clientes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsuarios}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Produtos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProdutos}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <UserCheck className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Funcionários</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalFuncionarios}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Agendamentos Hoje</p>
                <p className="text-2xl font-bold text-gray-900">{stats.agendamentosHoje}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            href="/admin/produtos"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-pink-100">
                <Package className="h-6 w-6 text-pink-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Gerenciar Produtos</h3>
                <p className="text-gray-600">Adicionar, editar e remover produtos</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/usuarios"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Gerenciar Clientes</h3>
                <p className="text-gray-600">Visualizar e gerenciar clientes</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/agendamentos"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Agendamentos</h3>
                <p className="text-gray-600">Gerenciar consultas e serviços</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Clientes Recentes e Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Clientes Recentes */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Clientes Recentes
            </h3>
            {recentUsers.length === 0 ? (
              <p className="text-gray-500">Nenhum cliente cadastrado ainda.</p>
            ) : (
              <div className="space-y-4">
                {recentUsers.map((usuario) => (
                  <div key={usuario.cpf} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        {usuario.nome} {usuario.sobrenome}
                      </p>
                      <p className="text-sm text-gray-600">{usuario.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {usuario.celular || 'Sem telefone'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Gráfico de Vendas (Placeholder) */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Vendas dos Últimos 7 Dias
            </h3>
            <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Gráfico de vendas</p>
                <p className="text-sm text-gray-400">Em desenvolvimento</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ações Administrativas */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ações Administrativas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-colors">
              <div className="text-center">
                <DollarSign className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">Relatório de Vendas</p>
              </div>
            </button>

            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">Análise de Desempenho</p>
              </div>
            </button>

            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
              <div className="text-center">
                <Settings className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">Configurações</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

