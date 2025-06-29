'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getAgendamentoById, Agendamento } from '@/lib/api';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  PawPrint,
  Stethoscope,
  DollarSign,
  FileText,
  UserCheck,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import Link from 'next/link';

// Dados mockados para demonstração
const mockAgendamento: Agendamento = {
  id: 1,
  clienteNome: 'Maria Silva',
  clienteCpf: '12345678901',
  petNome: 'Rex',
  petId: 1,
  servico: 'Banho e Tosa',
  servicoId: 1,
  data: '2024-01-15',
  hora: '09:00',
  status: 'agendado',
  observacoes: 'Pet muito agitado, precisa de cuidado especial durante o banho. Já teve reações alérgicas a alguns produtos.',
  funcionario: 'Ana Costa',
  funcionarioId: 'func001',
  preco: 50.00,
  dataCriacao: '2024-01-10T10:30:00Z',
  dataAtualizacao: '2024-01-12T14:20:00Z'
};

// Dados adicionais do cliente e pet (mockados)
const mockClienteDetalhes = {
  nome: 'Maria Silva',
  cpf: '12345678901',
  email: 'maria.silva@email.com',
  telefone: '(11) 99999-9999',
  endereco: 'Rua das Flores, 123 - Centro - São Paulo/SP'
};

const mockPetDetalhes = {
  nome: 'Rex',
  especie: 'Cachorro',
  raca: 'Golden Retriever',
  idade: 3,
  peso: 25.5
};

export default function DetalhesAgendamentoPage() {
  const [agendamento, setAgendamento] = useState<Agendamento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user, userType, isLoggedIn } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // Verificar se o usuário está logado e é um funcionário
  useEffect(() => {
    if (!isLoggedIn || userType !== 'funcionario') {
      router.push('/login');
      return;
    }

    const fetchAgendamento = async () => {
      try {
        setLoading(true);
        // Simular delay da API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Por enquanto usando dados mockados
        if (id === '1') {
          setAgendamento(mockAgendamento);
        } else {
          setError('Agendamento não encontrado');
        }
      } catch (error: any) {
        console.error('Erro ao carregar agendamento:', error);
        setError('Erro ao carregar dados do agendamento');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAgendamento();
    }
  }, [id, isLoggedIn, userType, router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendado':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'confirmado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'em_andamento':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'concluido':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelado':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'agendado':
        return <Calendar className="h-4 w-4" />;
      case 'confirmado':
        return <CheckCircle className="h-4 w-4" />;
      case 'em_andamento':
        return <Clock className="h-4 w-4" />;
      case 'concluido':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelado':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="space-y-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i}>
                        <div className="h-4 bg-gray-200 rounded mb-2 w-24"></div>
                        <div className="h-6 bg-gray-200 rounded w-48"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !agendamento) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/admin/agendamentos" 
            className="inline-flex items-center text-pink-600 hover:text-pink-500 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Agendamentos
          </Link>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Agendamento não encontrado</h2>
            <p className="text-gray-600 mb-4">
              {error || 'O agendamento solicitado não foi encontrado.'}
            </p>
            <Link 
              href="/admin/agendamentos"
              className="text-pink-600 hover:text-pink-500"
            >
              Voltar para lista de agendamentos
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
            href="/admin/agendamentos" 
            className="inline-flex items-center text-pink-600 hover:text-pink-500 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Agendamentos
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Agendamento #{agendamento.id}
              </h1>
              <p className="text-gray-600 mt-2">
                {agendamento.servico} - {formatDate(agendamento.data)} às {agendamento.hora}
              </p>
            </div>
            <div className="flex space-x-2">
              <Link 
                href={`/admin/agendamentos/editar/${agendamento.id}`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Link>
              <button className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md text-red-700 bg-white hover:bg-red-50 transition-colors">
                <Trash2 className="h-4 w-4 mr-2" />
                Cancelar
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações Principais */}
          <div className="lg:col-span-2 space-y-6">
            {/* Detalhes do Agendamento */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-pink-600" />
                Detalhes do Agendamento
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Serviço
                  </label>
                  <p className="text-gray-900 font-medium flex items-center">
                    <Stethoscope className="h-4 w-4 mr-2 text-gray-400" />
                    {agendamento.servico}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(agendamento.status)}`}>
                    {getStatusIcon(agendamento.status)}
                    <span className="ml-2">{getStatusText(agendamento.status)}</span>
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data
                  </label>
                  <p className="text-gray-900 font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    {formatDate(agendamento.data)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Horário
                  </label>
                  <p className="text-gray-900 font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    {agendamento.hora}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Funcionário Responsável
                  </label>
                  <p className="text-gray-900 font-medium flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    {agendamento.funcionario || 'Não atribuído'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor
                  </label>
                  <p className="text-gray-900 font-medium flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                    {agendamento.preco ? `R$ ${agendamento.preco.toFixed(2)}` : 'Não informado'}
                  </p>
                </div>
              </div>

              {agendamento.observacoes && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="inline h-4 w-4 mr-1" />
                    Observações
                  </label>
                  <div className="bg-gray-50 rounded-md p-4">
                    <p className="text-gray-900">{agendamento.observacoes}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Informações do Cliente */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <User className="h-5 w-5 mr-2 text-pink-600" />
                Informações do Cliente
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome
                  </label>
                  <p className="text-gray-900 font-medium">
                    {mockClienteDetalhes.nome}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CPF
                  </label>
                  <p className="text-gray-900 font-medium">
                    {formatCPF(mockClienteDetalhes.cpf)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900 font-medium flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    {mockClienteDetalhes.email}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <p className="text-gray-900 font-medium flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    {mockClienteDetalhes.telefone}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Endereço
                  </label>
                  <p className="text-gray-900 font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    {mockClienteDetalhes.endereco}
                  </p>
                </div>
              </div>
            </div>

            {/* Informações do Pet */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <PawPrint className="h-5 w-5 mr-2 text-pink-600" />
                Informações do Pet
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome
                  </label>
                  <p className="text-gray-900 font-medium">
                    {mockPetDetalhes.nome}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Espécie
                  </label>
                  <p className="text-gray-900 font-medium">
                    {mockPetDetalhes.especie}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Raça
                  </label>
                  <p className="text-gray-900 font-medium">
                    {mockPetDetalhes.raca}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Idade
                  </label>
                  <p className="text-gray-900 font-medium">
                    {mockPetDetalhes.idade} anos
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Peso
                  </label>
                  <p className="text-gray-900 font-medium">
                    {mockPetDetalhes.peso} kg
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Card de Resumo */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo</h3>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className="h-16 w-16 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-3">
                    <PawPrint className="h-8 w-8 text-pink-600" />
                  </div>
                  <p className="font-medium text-gray-900">
                    {agendamento.petNome}
                  </p>
                  <p className="text-sm text-gray-600">
                    {agendamento.servico}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Cliente:</span>
                      <span className="font-medium">{agendamento.clienteNome}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Data:</span>
                      <span className="font-medium">{formatDate(agendamento.data)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Horário:</span>
                      <span className="font-medium">{agendamento.hora}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Valor:</span>
                      <span className="font-medium text-green-600">
                        {agendamento.preco ? `R$ ${agendamento.preco.toFixed(2)}` : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Histórico */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico</h3>
              
              <div className="space-y-3">
                <div className="text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Criado em:</span>
                    <span className="font-medium">{formatDateTime(agendamento.dataCriacao || '')}</span>
                  </div>
                </div>
                <div className="text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Última atualização:</span>
                    <span className="font-medium">{formatDateTime(agendamento.dataAtualizacao || '')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
              
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                  Confirmar agendamento
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                  Iniciar atendimento
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                  Enviar lembrete
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                  Ver histórico do pet
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors">
                  Cancelar agendamento
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

