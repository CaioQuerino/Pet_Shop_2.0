'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getAllUsuarios, Usuario } from '@/lib/api';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Scissors,
  FileText,
  DollarSign,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';

interface Pet {
  id: number;
  nome: string;
  tipo: string;
  raca?: string;
}

interface Servico {
  id: number;
  nome: string;
  preco: number;
  duracao: number; // em minutos
  descricao?: string;
}

export default function NovoAgendamentoPage() {
  const [formData, setFormData] = useState({
    clienteCpf: '',
    petId: '',
    servicoId: '',
    data: '',
    hora: '',
    observacoes: '',
    funcionario: ''
  });
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { user, userType, isLoggedIn } = useAuth();
  const router = useRouter();

  // Serviços disponíveis (mockados)
  const servicos: Servico[] = [
    { id: 1, nome: 'Banho e Tosa', preco: 50.00, duracao: 120, descricao: 'Banho completo com tosa higiênica' },
    { id: 2, nome: 'Consulta Veterinária', preco: 80.00, duracao: 60, descricao: 'Consulta clínica geral' },
    { id: 3, nome: 'Vacinação', preco: 35.00, duracao: 30, descricao: 'Aplicação de vacinas' },
    { id: 4, nome: 'Tosa Completa', preco: 70.00, duracao: 180, descricao: 'Tosa completa com acabamento' },
    { id: 5, nome: 'Limpeza de Ouvido', preco: 25.00, duracao: 30, descricao: 'Limpeza e higienização dos ouvidos' },
    { id: 6, nome: 'Corte de Unhas', preco: 20.00, duracao: 20, descricao: 'Corte e lixamento das unhas' }
  ];

  // Pets mockados para demonstração
  const mockPets: Pet[] = [
    { id: 1, nome: 'Rex', tipo: 'Cão', raca: 'Golden Retriever' },
    { id: 2, nome: 'Mimi', tipo: 'Gato', raca: 'Persa' },
    { id: 3, nome: 'Bolt', tipo: 'Cão', raca: 'Border Collie' },
    { id: 4, nome: 'Luna', tipo: 'Gato', raca: 'Siamês' }
  ];

  // Verificar se o usuário está logado e é um funcionário
  useEffect(() => {
    if (!isLoggedIn || userType !== 'funcionario') {
      router.push('/login');
      return;
    }

    const fetchUsuarios = async () => {
      try {
        const response = await getAllUsuarios();
        const usuariosData = response.data?.usuarios || [];
        setUsuarios(usuariosData);
      } catch (error: any) {
        console.error('Erro ao carregar usuários:', error);
        setError('Erro ao carregar lista de clientes');
      }
    };

    fetchUsuarios();
  }, [isLoggedIn, userType, router]);

  // Quando um cliente é selecionado, carregar seus pets
  useEffect(() => {
    if (formData.clienteCpf) {
      const cliente = usuarios.find(u => u.cpf === formData.clienteCpf);
      setSelectedCliente(cliente || null);
      // Aqui você carregaria os pets do cliente da API
      // Por enquanto, usando dados mockados
      setPets(mockPets);
    } else {
      setSelectedCliente(null);
      setPets([]);
    }
  }, [formData.clienteCpf, usuarios]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Aqui você faria a chamada para a API para criar o agendamento
      console.log('Dados do agendamento:', formData);
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirecionar para a lista de agendamentos
      router.push('/admin/agendamentos');
    } catch (error: any) {
      console.error('Erro ao criar agendamento:', error);
      setError('Erro ao criar agendamento');
    } finally {
      setLoading(false);
    }
  };

  const getSelectedServico = () => {
    return servicos.find(s => s.id.toString() === formData.servicoId);
  };

  // Gerar horários disponíveis
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
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
          <h1 className="text-3xl font-bold text-gray-900">Novo Agendamento</h1>
          <p className="text-gray-600 mt-2">Agende um novo serviço para um cliente</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário Principal */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Seleção do Cliente */}
                <div>
                  <label htmlFor="clienteCpf" className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline h-4 w-4 mr-1" />
                    Cliente *
                  </label>
                  <select
                    id="clienteCpf"
                    name="clienteCpf"
                    value={formData.clienteCpf}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">Selecione um cliente</option>
                    {usuarios.map((usuario) => (
                      <option key={usuario.cpf} value={usuario.cpf}>
                        {usuario.nome} {usuario.sobrenome} - {usuario.cpf}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Seleção do Pet */}
                <div>
                  <label htmlFor="petId" className="block text-sm font-medium text-gray-700 mb-2">
                    Pet *
                  </label>
                  <select
                    id="petId"
                    name="petId"
                    value={formData.petId}
                    onChange={handleChange}
                    required
                    disabled={!formData.clienteCpf}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value="">
                      {formData.clienteCpf ? 'Selecione um pet' : 'Primeiro selecione um cliente'}
                    </option>
                    {pets.map((pet) => (
                      <option key={pet.id} value={pet.id}>
                        {pet.nome} - {pet.tipo} {pet.raca && `(${pet.raca})`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Seleção do Serviço */}
                <div>
                  <label htmlFor="servicoId" className="block text-sm font-medium text-gray-700 mb-2">
                    <Scissors className="inline h-4 w-4 mr-1" />
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
                    {servicos.map((servico) => (
                      <option key={servico.id} value={servico.id}>
                        {servico.nome} - R$ {servico.preco.toFixed(2)} ({servico.duracao}min)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Data e Hora */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      min={new Date().toISOString().split('T')[0]}
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
                      {generateTimeSlots().map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Funcionário Responsável */}
                <div>
                  <label htmlFor="funcionario" className="block text-sm font-medium text-gray-700 mb-2">
                    Funcionário Responsável
                  </label>
                  <select
                    id="funcionario"
                    name="funcionario"
                    value={formData.funcionario}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">Atribuir automaticamente</option>
                    <option value="Ana Costa">Ana Costa</option>
                    <option value="Dr. Carlos">Dr. Carlos</option>
                    <option value="Maria Santos">Maria Santos</option>
                  </select>
                </div>

                {/* Observações */}
                <div>
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
                    placeholder="Informações adicionais sobre o agendamento..."
                  />
                </div>

                {/* Botões */}
                <div className="flex justify-end space-x-4 pt-6">
                  <Link
                    href="/admin/agendamentos"
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Agendando...' : 'Agendar Serviço'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar com Resumo */}
          <div className="space-y-6">
            {/* Resumo do Agendamento */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Agendamento</h3>
              
              <div className="space-y-4">
                {selectedCliente && (
                  <div>
                    <p className="text-sm text-gray-600">Cliente:</p>
                    <p className="font-medium">{selectedCliente.nome} {selectedCliente.sobrenome}</p>
                  </div>
                )}

                {formData.petId && (
                  <div>
                    <p className="text-sm text-gray-600">Pet:</p>
                    <p className="font-medium">
                      {pets.find(p => p.id.toString() === formData.petId)?.nome}
                    </p>
                  </div>
                )}

                {getSelectedServico() && (
                  <div>
                    <p className="text-sm text-gray-600">Serviço:</p>
                    <p className="font-medium">{getSelectedServico()?.nome}</p>
                    <p className="text-sm text-gray-500">{getSelectedServico()?.descricao}</p>
                  </div>
                )}

                {formData.data && formData.hora && (
                  <div>
                    <p className="text-sm text-gray-600">Data e Hora:</p>
                    <p className="font-medium">
                      {new Date(formData.data).toLocaleDateString('pt-BR')} às {formData.hora}
                    </p>
                  </div>
                )}

                {getSelectedServico() && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Duração:</span>
                      <span className="font-medium">{getSelectedServico()?.duracao} min</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-600">Valor:</span>
                      <span className="font-bold text-pink-600 flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        R$ {getSelectedServico()?.preco.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Dicas */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Dicas:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Verifique a disponibilidade antes de confirmar</li>
                <li>• Adicione observações importantes sobre o pet</li>
                <li>• Confirme os dados de contato do cliente</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

