'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getPetsByUsuario, Pet } from '@/lib/api';
import { Heart, Plus, Edit, Calendar, Weight, Clock } from 'lucide-react';

export default function MeusPetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { userType, isLoggedIn } = useAuth();
  const router = useRouter();

  // Verificar se o usuário está logado e é um cliente
  useEffect(() => {
    if (!isLoggedIn || userType !== 'usuario') {
      router.push('/login');
      return;
    }

    const fetchPets = async () => {
      try {
        const response = await getPetsByUsuario();
        setPets(response.data.pets || []);
      } catch (error: any) {
        setError(error.response?.data?.message || 'Erro ao carregar pets');
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [isLoggedIn, userType, router]);

  const getSpeciesIcon = (especie?: string) => {
    if (!especie) return '🐾';
    
    switch (especie.toLowerCase()) {
      case 'cachorro':
        return '🐕';
      case 'gato':
        return '🐱';
      case 'peixe':
        return '🐠';
      case 'passaro':
        return '🐦';
      default:
        return '🐾';
    }
  };

  const getSpeciesColor = (especie?: string) => {
    if (!especie) return 'bg-gray-100 text-gray-800';
    
    switch (especie.toLowerCase()) {
      case 'cachorro':
        return 'bg-blue-100 text-blue-800';
      case 'gato':
        return 'bg-purple-100 text-purple-800';
      case 'peixe':
        return 'bg-cyan-100 text-cyan-800';
      case 'passaro':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isLoggedIn || userType !== 'usuario') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Heart className="mx-auto h-12 w-12 text-pink-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Restrito</h2>
          <p className="text-gray-600 mb-4">Você precisa estar logado como cliente para ver seus pets.</p>
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Meus Pets</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Meus Pets
            </h1>
            <p className="text-gray-600">
              Gerencie as informações dos seus pets
            </p>
          </div>
          <Link
            href="/cadastrar-pet"
            className="mt-4 sm:mt-0 inline-flex items-center bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors font-medium"
          >
            <Plus className="h-5 w-5 mr-2" />
            Cadastrar Pet
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Lista de Pets */}
        {pets.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🐾</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum pet cadastrado
            </h3>
            <p className="text-gray-600 mb-6">
              Cadastre seu primeiro pet para começar a usar nossos serviços
            </p>
            <Link
              href="/cadastrar-pet"
              className="inline-flex items-center bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors font-medium"
            >
              <Plus className="h-5 w-5 mr-2" />
              Cadastrar Primeiro Pet
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => {
              const safePet = {
                idPet: pet.idPet || '',
                nome: pet.nome || 'Sem nome',
                especie: pet.especie || 'Desconhecido',
                raca: pet.raca || 'Desconhecida',
                idade: pet.idade || 0,
                peso: pet.peso || 0,
                observacoes: pet.observacoes || ''
              };

              return (
                <div key={safePet.idPet} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Header do Card */}
                  <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">
                          {getSpeciesIcon(safePet.especie)}
                        </span>
                        <div>
                          <h3 className="text-xl font-bold">{safePet.nome}</h3>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getSpeciesColor(safePet.especie)} bg-white bg-opacity-20 text-white`}>
                            {safePet.especie}
                          </span>
                        </div>
                      </div>
                      <button className="text-white hover:text-gray-200 transition-colors">
                        <Edit className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Conteúdo do Card */}
                  <div className="p-6">
                    <div className="space-y-3">
                      {safePet.raca && (
                        <div className="flex items-center text-gray-600">
                          <span className="font-medium">Raça:</span>
                          <span className="ml-2">{safePet.raca}</span>
                        </div>
                      )}

                      {safePet.idade > 0 && (
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          <span className="font-medium">Idade:</span>
                          <span className="ml-2">{safePet.idade} {safePet.idade === 1 ? 'ano' : 'anos'}</span>
                        </div>
                      )}

                      {safePet.peso > 0 && (
                        <div className="flex items-center text-gray-600">
                          <Weight className="h-4 w-4 mr-2" />
                          <span className="font-medium">Peso:</span>
                          <span className="ml-2">{safePet.peso} kg</span>
                        </div>
                      )}

                      {safePet.observacoes && (
                        <div className="text-gray-600">
                          <span className="font-medium">Observações:</span>
                          <p className="mt-1 text-sm line-clamp-3">{safePet.observacoes}</p>
                        </div>
                      )}
                    </div>

                    {/* Ações */}
                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium inline-flex items-center justify-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Agendar Consulta
                      </button>
                      <button className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium inline-flex items-center justify-center">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Estatísticas */}
        {pets.length > 0 && (
          <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Resumo dos seus pets
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">{pets.length}</div>
                <div className="text-sm text-gray-600">Total de Pets</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {pets.filter(pet => pet.especie?.toLowerCase() === 'cachorro').length}
                </div>
                <div className="text-sm text-gray-600">Cachorros</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {pets.filter(pet => pet.especie?.toLowerCase() === 'gato').length}
                </div>
                <div className="text-sm text-gray-600">Gatos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {pets.filter(pet => {
                    const especie = pet.especie?.toLowerCase();
                    return especie !== 'cachorro' && especie !== 'gato';
                  }).length}
                </div>
                <div className="text-sm text-gray-600">Outros</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}