'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getMyPets, Pet, agendarServico } from '@/lib/api';
import { Calendar, Clock, Home, ArrowLeft, CheckCircle, Star, Wifi, Camera, Utensils } from 'lucide-react';
import Link from 'next/link';

export default function HotelPage() {
  const { isLoggedIn, userType } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<number | null>(null);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('basico');
  const [observations, setObservations] = useState('');
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
    if (!selectedPet || !checkInDate || !checkOutDate) return;

    setLoading(true);
    try {
      await agendarServico({
        petId: selectedPet,
        tipoServico: 'hotel',
        data: `${checkInDate}T10:00:00`
      });
      setSuccess(true);
    } catch (error) {
      console.error('Erro ao reservar hotel:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const calculateDays = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const packages = [
    {
      id: 'basico',
      name: 'Pacote Básico',
      price: 50,
      features: [
        'Acomodação confortável',
        'Alimentação 2x ao dia',
        'Passeios diários',
        'Cuidados básicos de higiene'
      ]
    },
    {
      id: 'premium',
      name: 'Pacote Premium',
      price: 80,
      features: [
        'Suíte privativa',
        'Alimentação premium 3x ao dia',
        'Passeios personalizados',
        'Banho e escovação',
        'Relatório diário com fotos'
      ]
    },
    {
      id: 'vip',
      name: 'Pacote VIP',
      price: 120,
      features: [
        'Suíte de luxo com TV',
        'Alimentação gourmet',
        'Passeios individuais',
        'Spa completo',
        'Videochamadas diárias',
        'Serviço veterinário 24h'
      ]
    }
  ];

  const selectedPackageData = packages.find(p => p.id === selectedPackage);
  const totalDays = calculateDays();
  const totalPrice = selectedPackageData ? selectedPackageData.price * totalDays : 0;

  if (!isLoggedIn || userType !== 'usuario') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Home className="mx-auto h-12 w-12 text-pink-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Acesso Restrito
            </h1>
            <p className="text-gray-600 mb-6">
              Você precisa estar logado como usuário para reservar o hotel.
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
              Reserva Confirmada!
            </h1>
            <p className="text-gray-600 mb-6">
              Sua reserva foi confirmada. Você receberá mais informações por email.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Resumo da Reserva</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Check-in: {new Date(checkInDate).toLocaleDateString('pt-BR')}</p>
                <p>Check-out: {new Date(checkOutDate).toLocaleDateString('pt-BR')}</p>
                <p>Pacote: {selectedPackageData?.name}</p>
                <p>Total: R$ {totalPrice.toFixed(2)}</p>
              </div>
            </div>
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <Home className="h-8 w-8 text-pink-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Hotel para Pets
            </h1>
            <p className="text-gray-600">
              Um lar longe de casa para o seu melhor amigo
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2">
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
                            {pet.peso && (
                              <p className="text-sm text-gray-600">Peso: {pet.peso}kg</p>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Datas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Check-in
                    </label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      min={getMinDate()}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Check-out
                    </label>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      min={checkInDate || getMinDate()}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Pacotes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Escolha o Pacote
                  </label>
                  <div className="space-y-4">
                    {packages.map((pkg) => (
                      <label
                        key={pkg.id}
                        className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedPackage === pkg.id
                            ? 'border-pink-500 bg-pink-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="package"
                          value={pkg.id}
                          checked={selectedPackage === pkg.id}
                          onChange={() => setSelectedPackage(pkg.id)}
                          className="sr-only"
                        />
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-2">{pkg.name}</h3>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {pkg.features.map((feature, index) => (
                                <li key={index} className="flex items-center">
                                  <Star className="h-3 w-3 text-yellow-400 mr-2 flex-shrink-0" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="text-right ml-4">
                            <span className="text-2xl font-bold text-pink-600">
                              R$ {pkg.price}
                            </span>
                            <p className="text-sm text-gray-500">/dia</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Observações */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações Especiais
                  </label>
                  <textarea
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    rows={4}
                    placeholder="Informe qualquer cuidado especial, medicamentos, preferências alimentares, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                {/* Botão de Envio */}
                <button
                  type="submit"
                  disabled={!selectedPet || !checkInDate || !checkOutDate || loading || pets.length === 0}
                  className="w-full bg-pink-600 text-white py-3 px-4 rounded-lg hover:bg-pink-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processando...' : 'Confirmar Reserva'}
                </button>
              </form>
            </div>
          </div>

          {/* Resumo da Reserva */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Resumo da Reserva
              </h3>
              
              {totalDays > 0 && (
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Período:</span>
                    <span className="font-medium">{totalDays} dia(s)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pacote:</span>
                    <span className="font-medium">{selectedPackageData?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Valor/dia:</span>
                    <span className="font-medium">R$ {selectedPackageData?.price}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-pink-600">R$ {totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Facilidades */}
              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-900 mb-3">Nossas Facilidades</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Wifi className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Monitoramento 24h</span>
                  </div>
                  <div className="flex items-center">
                    <Camera className="h-4 w-4 mr-2 text-green-500" />
                    <span>Câmeras de segurança</span>
                  </div>
                  <div className="flex items-center">
                    <Utensils className="h-4 w-4 mr-2 text-orange-500" />
                    <span>Alimentação personalizada</span>
                  </div>
                  <div className="flex items-center">
                    <Home className="h-4 w-4 mr-2 text-purple-500" />
                    <span>Ambiente climatizado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-medium text-blue-900 mb-3">Informações Importantes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">Check-in/Check-out:</h4>
              <ul className="space-y-1">
                <li>• Check-in: 10h às 18h</li>
                <li>• Check-out: 8h às 17h</li>
                <li>• Documentos necessários: carteira de vacinação</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Políticas:</h4>
              <ul className="space-y-1">
                <li>• Cancelamento gratuito até 48h antes</li>
                <li>• Pets devem estar com vacinas em dia</li>
                <li>• Não aceitamos pets doentes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

