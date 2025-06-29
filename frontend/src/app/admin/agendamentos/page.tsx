'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Calendar, 
  Clock, 
  User, 
  Search, 
  Filter, 
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';

// Tipos para agendamentos
interface Agendamento {
  id: number;
  clienteNome: string;
  clienteCpf: string;
  petNome: string;
  servico: string;
  data: string;
  hora: string;
  status: 'agendado' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado';
  observacoes?: string;
  funcionario?: string;
  preco?: number;
}

export default function GerenciarAgendamentosPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [filteredAgendamentos, setFilteredAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');

  const { user, userType, isLoggedIn } = useAuth();
  const router = useRouter();

  // Dados mockados para demonstração
  const mockAgendamentos: Agendamento[] = [
    {
      id: 1,
      clienteNome: 'Maria Silva',
      clienteCpf: '12345678901',
      petNome: 'Rex',
      servico: 'Banho e Tosa',
      data: '2024-01-15',
      hora: '09:00',
      status: 'agendado',
      funcionario: 'Ana Costa',
      preco: 50.00,
      observacoes: 'Pet muito agitado'
    },
    {
      id: 2,
      clienteNome: 'João Santos',
      clienteCpf: '98765432109',
      petNome: 'Mimi',
      servico: 'Consulta Veterinária',
      data: '2024-01-15',
      hora: '14:30',
      status: 'confirmado',
      funcionario: 'Dr. Carlos',
      preco: 80.00
    },
    {
      id: 3,
      clienteNome: 'Ana Oliveira',
      clienteCpf: '11122233344',
      petNome: 'Bolt',
      servico: 'Vacinação',
      data: '2024-01-16',
      hora: '10:00',
      status: 'concluido',
      funcionario: 'Dr. Carlos',
      preco: 35.00
    },
    {
      id: 4,
      clienteNome: 'Pedro Costa',
      clienteCpf: '55566677788',
      petNome: 'Luna',
      servico: 'Banho e Tosa',
      data: '2024-01-16',
      hora: '16:00',
      status: 'em_andamento',
      funcionario: 'Ana Costa',
      preco: 50.00
    }
  ];

  // Verificar se o usuário está logado e é um funcionário
  useEffect(() => {
    if (!isLoggedIn || userType !== 'funcionario') {
      router.push('/login');
      return;
    }

    // Simular carregamento de dados
    const fetchAgendamentos = async () => {
      try {
        setLoading(true);
        // Simular delay da API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAgendamentos(mockAgendamentos);
        setFilteredAgendamentos(mockAgendamentos);
      } catch (error: any) {
        console.error('Erro ao carregar agendamentos:', error);
        setError('Erro ao carregar agendamentos');
      } finally {
        setLoading(false);
      }
    };

    fetchAgendamentos();
  }, [isLoggedIn, userType, router]);

  // Filtrar agendamentos
  useEffect(() => {
    let filtered = [...agendamentos];

    if (searchTerm) {
      filtered = filtered.filter(agendamento =>
        agendamento.clienteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agendamento.petNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agendamento.servico.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(agendamento => agendamento.status === statusFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter(agendamento => agendamento.data === dateFilter);
    }

    setFilteredAgendamentos(filtered);
  }, [searchTerm, statusFilter, dateFilter, agendamentos]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendado':
        return 'bg-blue-100 text-blue-800';
      case 'confirmado':
        return 'bg-green-100 text-green-800';
      case 'em_andamento':
        return 'bg-yellow-100 text-yellow-800';
      case 'concluido':
        return 'bg-gray-100 text-gray-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'agendado':
        return <Calendar className="h-3 w-3" />;
      case 'confirmado':
        return <CheckCircle className="h-3 w-3" />;
      case 'em_andamento':
        return <Clock className="h-3 w-3" />;
      case 'concluido':
        return <CheckCircle className="h-3 w-3" />;
      case 'cancelado':
        return <XCircle className="h-3 w-3" />;
      default:
        return <AlertCircle className="h-3 w-3" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'agendado':
        return 'Agendado';
      case 'confirmado':
        return 'Confirmado';
      case 'em_andamento':
        return 'Em Andamento';
      case 'concluido':
        return 'Concluído';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatTime = (timeString: string) => {
    return timeString;
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-8 w-64"></div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Gerenciar Agendamentos
              </h1>
              <p className="text-gray-600">
                Visualize e gerencie todos os agendamentos de serviços
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-lg px-4 py-2 shadow">
                <span className="text-sm text-gray-600">Total de agendamentos:</span>
                <span className="ml-2 font-bold text-pink-600">{agendamentos.length}</span>
              </div>
              <Link
                href="/admin/agendamentos/novo"
                className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Agendamento
              </Link>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Filtros e Busca */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por cliente, pet ou serviço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">Todos os status</option>
              <option value="agendado">Agendado</option>
              <option value="confirmado">Confirmado</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="concluido">Concluído</option>
              <option value="cancelado">Cancelado</option>
            </select>

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />

            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {filteredAgendamentos.length} de {agendamentos.length}
              </span>
            </div>
          </div>
        </div>

        {/* Lista de Agendamentos */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {filteredAgendamentos.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter || dateFilter ? 'Nenhum agendamento encontrado' : 'Nenhum agendamento cadastrado'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter || dateFilter
                  ? 'Tente ajustar os filtros de busca'
                  : 'Os agendamentos aparecerão aqui quando forem criados'
                }
              </p>
              {!searchTerm && !statusFilter && !dateFilter && (
                <Link
                  href="/admin/agendamentos/novo"
                  className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Agendamento
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente / Pet
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Serviço
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data / Hora
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Funcionário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAgendamentos.map((agendamento) => (
                    <tr key={agendamento.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-pink-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {agendamento.clienteNome}
                            </div>
                            <div className="text-sm text-gray-500">
                              Pet: {agendamento.petNome}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{agendamento.servico}</div>
                        {agendamento.observacoes && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {agendamento.observacoes}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                          {formatDate(agendamento.data)}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-gray-400" />
                          {formatTime(agendamento.hora)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(agendamento.status)}`}>
                          {getStatusIcon(agendamento.status)}
                          <span className="ml-1">{getStatusText(agendamento.status)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {agendamento.funcionario || 'Não atribuído'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {agendamento.preco ? `R$ ${agendamento.preco.toFixed(2)}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/admin/agendamentos/${agendamento.id}`}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="Visualizar detalhes"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/admin/agendamentos/editar/${agendamento.id}`}
                            className="text-green-600 hover:text-green-900 p-1 rounded"
                            title="Editar agendamento"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="Cancelar agendamento"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Resumo por Status */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-4">
          {['agendado', 'confirmado', 'em_andamento', 'concluido', 'cancelado'].map((status) => {
            const count = agendamentos.filter(a => a.status === status).length;
            return (
              <div key={status} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${getStatusColor(status)}`}>
                    {getStatusIcon(status)}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">
                      {getStatusText(status)}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

