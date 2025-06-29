'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getAgendamentoById, updateAgendamento, getAllUsuarios, getAllServicos, getAllFuncionarios, Agendamento } from '@/lib/api';
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
  Save,
  AlertTriangle
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
  observacoes: 'Pet muito agitado, precisa de cuidado especial durante o banho.',
  funcionario: 'Ana Costa',
  funcionarioId: 'func001',
  preco: 50.00
};

const mockServicos = [
  { id: 1, nome: 'Banho e Tosa', preco: 50.00 },
  { id: 2, nome: 'Consulta Veterinária', preco: 80.00 },
  { id: 3, nome: 'Vacinação', preco: 35.00 },
  { id: 4, nome: 'Cirurgia', preco: 200.00 }
];

const mockFuncionarios = [
  { idFuncionario: 'func001', nome: 'Ana', sobrenome: 'Costa' },
  { idFuncionario: 'func002', nome: 'Dr. Carlos', sobrenome: 'Silva' },
  { idFuncionario: 'func003', nome: 'Maria', sobrenome: 'Santos' }
];

export default function EditarAgendamentoPage() {
  const [agendamento, setAgendamento] = useState<Agendamento | null>(null);
  const [formData, setFormData] = useState({
    servicoId: '',
    data: '',
    hora: '',
    status: '',
    observacoes: '',
    funcionarioId: '',
    preco: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
          
          // Preencher o formulário com os dados do agendamento
          setFormData({
            servicoId: mockAgendamento.servicoId.toString(),
            data: mockAgendamento.data,
            hora: mockAgendamento.hora,
            status: mockAgendamento.status,
            observacoes: mockAgendamento.observacoes || '',
            funcionarioId: mockAgendamento.funcionarioId || '',
            preco: mockAgendamento.preco?.toString() || ''
          });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Atualizar preço automaticamente quando o serviço for alterado
    if (name === 'servicoId') {
      const servico = mockServicos.find(s => s.id.toString() === value);
      if (servico) {
        setFormData(prev => ({
          ...prev,
          preco: servico.preco.toString()
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const updateData = {
        ...formData,
        servicoId: parseInt(formData.servicoId),
        preco: parseFloat(formData.preco) || undefined
      };

      // Simular atualização
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess('Agendamento atualizado com sucesso!');
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push(`/admin/agendamentos/${id}`);
      }, 2000);
    } catch (error: any) {
      console.error('Erro ao atualizar agendamento:', error);
      setError(error.response?.data?.message || 'Erro ao atualizar agendamento');
    } finally {
      setSaving(false);
    }
  };

  const getStatusOptions = () => [
    { value: 'agendado', label: 'Agendado' },
    { value: 'confirmado', label: 'Confirmado' },
    { value: 'em_andamento', label: 'Em Andamento' },
    { value: 'concluido', label: 'Concluído' },
    { value: 'cancelado', label: 'Cancelado' }
  ];

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
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
                {[...Array(8)].map((_, i) => (
                  <div key={i}>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-24"></div>
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !agendamento) {
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
            href={`/admin/agendamentos/${id}`}
            className="inline-flex items-center text-pink-600 hover:text-pink-500 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Detalhes
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Editar Agendamento
            </h1>
            <p className="text-gray-600 mt-2">
              Agendamento #{id} - {agendamento?.clienteNome} / {agendamento?.petNome}
            </p>
          </div>
        </div>

        {/* Mensagens de Feedback */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md mb-6">
            {success}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações do Cliente e Pet (Somente Leitura) */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <User className="h-5 w-5 mr-2 text-pink-600" />
              Informações do Cliente e Pet
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente
                </label>
                <p className="text-gray-900 font-medium bg-gray-50 px-3 py-2 rounded-md">
                  {agendamento?.clienteNome}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pet
                </label>
                <p className="text-gray-900 font-medium bg-gray-50 px-3 py-2 rounded-md flex items-center">
                  <PawPrint className="h-4 w-4 mr-2 text-gray-400" />
                  {agendamento?.petNome}
                </p>
              </div>
            </div>
          </div>

          {/* Detalhes do Agendamento */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-pink-600" />
              Detalhes do Agendamento
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="servicoId" className="block text-sm font-medium text-gray-700 mb-2">
                  <Stethoscope className="inline h-4 w-4 mr-1" />
                  Serviço *
                </label>
                <select
                  id="servicoId"
                  name="servicoId"
                  value={formData.servicoId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">Selecione um serviço</option>
                  {mockServicos.map((servico) => (
                    <option key={servico.id} value={servico.id}>
                      {servico.nome} - R$ {servico.preco.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">Selecione um status</option>
                  {getStatusOptions().map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Data *
                </label>
                <input
                  type="date"
                  id="data"
                  name="data"
                  value={formData.data}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="hora" className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Horário *
                </label>
                <select
                  id="hora"
                  name="hora"
                  value={formData.hora}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">Selecione um horário</option>
                  {generateTimeOptions().map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="funcionarioId" className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline h-4 w-4 mr-1" />
                  Funcionário Responsável
                </label>
                <select
                  id="funcionarioId"
                  name="funcionarioId"
                  value={formData.funcionarioId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">Selecione um funcionário</option>
                  {mockFuncionarios.map((funcionario) => (
                    <option key={funcionario.idFuncionario} value={funcionario.idFuncionario}>
                      {funcionario.nome} {funcionario.sobrenome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="preco" className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline h-4 w-4 mr-1" />
                  Valor (R$)
                </label>
                <input
                  type="number"
                  id="preco"
                  name="preco"
                  value={formData.preco}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="0,00"
                />
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="inline h-4 w-4 mr-1" />
                Observações
              </label>
              <textarea
                id="observacoes"
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Observações sobre o agendamento, cuidados especiais, etc."
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-4 pt-6">
            <Link
              href={`/admin/agendamentos/${id}`}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

