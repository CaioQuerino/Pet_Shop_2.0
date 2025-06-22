'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getMyPets, Pet, agendarServico } from '@/lib/api';
import { Calendar, Clock, Stethoscope, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ConsultaPage() {
  const { isLoggedIn, userType } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isLoggedIn && userType === 'usuario') {
      fetchPets();
    }
  }, [isLoggedIn, userType]);

  const fetchPets = async () => {
    try {
      const response = await getMyPets();
      setPets(response.data.pets || []);
    } catch (error) {
      console.error('Erro ao carregar pets:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPet || !selectedDate || !selectedTime) return;

    setLoading(true);
    try {
      const dataHora = `${selectedDate}T${selectedTime}:00`;
      await agendarServico({
        petId: selectedPet,
        tipoServico: 'consulta',
        data: dataHora
      });
      setSuccess(true);
    } catch (error) {
      console.error('Erro ao agendar consulta:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  if (!isLoggedIn || userType !== 'usuario') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Stethoscope className="mx-auto h-12 w-12 text-pink-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Acesso Restrito
            </h1>
            <p className="text-gray-600 mb-6">
              Você precisa estar logado como usuário para agendar uma consulta.
            </p>
            <Link
              href="/login"
              className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
            >
              Fazer Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Consulta Agendada com Sucesso!
            </h1>
            <p className="text-gray-600 mb-6">
              Sua consulta foi agendada. Você receberá uma confirmação por email em breve.
            </p>
            <div className="space-y-3">
              <Link
                href="/meus-pets"
                className="block bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
              >
                Ver Meus Pets
              </Link>
              <Link
                href="/servicos"
                className="block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Voltar aos Serviços
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/servicos"
            className="inline-flex items-center space-x-2 text-pink-600 hover:text-pink-700 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar aos Serviços</span>
          </Link>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="h-8 w-8 text-pink-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Agendar Consulta Veterinária
            </h1>
            <p className="text-gray-600">
              Agende uma consulta para o seu pet com nossos veterinários especializados
            </p>
          </div>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Seleção do Pet */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecione o Pet
              </label>
              {pets.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-4">
                    Você ainda não tem pets cadastrados.
                  </p>
                  <Link
                    href="/cadastrar-pet"
                    className="text-pink-600 hover:text-pink-700 font-medium"
                  >
                    Cadastrar Primeiro Pet
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {pets.map((pet) => (
                    <label
                      key={pet.idPet}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedPet === pet.idPet
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="pet"
                        value={pet.idPet}
                        checked={selectedPet === pet.idPet}
                        onChange={() => setSelectedPet(pet.idPet)}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900">{pet.nome}</h3>
                          <span className="text-sm text-gray-500">{pet.especie}</span>
                        </div>
                        {pet.raca && (
                          <p className="text-sm text-gray-600">Raça: {pet.raca}</p>
                        )}
                        {pet.idade && (
                          <p className="text-sm text-gray-600">Idade: {pet.idade} anos</p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Seleção da Data */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Data da Consulta
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={getMinDate()}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            {/* Seleção do Horário */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                Horário da Consulta
              </label>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`p-2 text-sm border rounded-lg transition-colors ${
                      selectedTime === time
                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Informações do Serviço */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Detalhes do Serviço</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>• Consulta completa com veterinário especializado</p>
                <p>• Duração: aproximadamente 30 minutos</p>
                <p>• Valor: R$ 80,00</p>
                <p>• Inclui: exame físico geral e orientações</p>
              </div>
            </div>

            {/* Botão de Envio */}
            <button
              type="submit"
              disabled={!selectedPet || !selectedDate || !selectedTime || loading || pets.length === 0}
              className="w-full bg-pink-600 text-white py-3 px-4 rounded-lg hover:bg-pink-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Agendando...' : 'Agendar Consulta'}
            </button>
          </form>
        </div>

        {/* Informações Adicionais */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Informações Importantes</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Chegue 15 minutos antes do horário agendado</li>
            <li>• Traga a carteira de vacinação do seu pet</li>
            <li>• Em caso de emergência, ligue para (21) 9999-9999</li>
            <li>• Cancelamentos devem ser feitos com 24h de antecedência</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

