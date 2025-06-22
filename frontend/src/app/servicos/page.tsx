'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Heart, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Star,
  Stethoscope,
  Scissors,
  Home,
  Truck
} from 'lucide-react';
import Link from 'next/link';
import {  } from "@/lib/api"

interface Servico {
  id: string;
  nome: string;
  descricao: string;
  preco: string;
  duracao: string;
  icon: React.ReactNode;
  categoria: 'veterinario' | 'estetica' | 'hospedagem' | 'outros';
}

export default function ServicosPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const { isLoggedIn, userType } = useAuth();

  const servicos: Servico[] = [
    {
      id: '1',
      nome: 'Consulta Veterinária',
      descricao: 'Consulta completa com veterinário especializado para check-up geral do seu pet.',
      preco: 'R$ 80,00',
      duracao: '30 min',
      icon: <Stethoscope className="h-6 w-6" />,
      categoria: 'veterinario'
    },
    {
      id: '2',
      nome: 'Vacinação',
      descricao: 'Aplicação de vacinas essenciais para manter a saúde do seu pet em dia.',
      preco: 'R$ 45,00',
      duracao: '15 min',
      icon: <Heart className="h-6 w-6" />,
      categoria: 'veterinario'
    },
    {
      id: '3',
      nome: 'Banho e Tosa',
      descricao: 'Banho completo com produtos especializados e tosa higiênica ou estética.',
      preco: 'R$ 60,00',
      duracao: '2 horas',
      icon: <Scissors className="h-6 w-6" />,
      categoria: 'estetica'
    },
    {
      id: '4',
      nome: 'Hotel para Pets',
      descricao: 'Hospedagem segura e confortável para seu pet quando você precisar viajar.',
      preco: 'R$ 50,00/dia',
      duracao: 'Flexível',
      icon: <Home className="h-6 w-6" />,
      categoria: 'hospedagem'
    },
    {
      id: '5',
      nome: 'Exames Laboratoriais',
      descricao: 'Exames de sangue, urina e fezes para diagnóstico preciso.',
      preco: 'R$ 120,00',
      duracao: '1 hora',
      icon: <Stethoscope className="h-6 w-6" />,
      categoria: 'veterinario'
    },
    {
      id: '6',
      nome: 'Entrega em Domicílio',
      descricao: 'Entregamos produtos e medicamentos na sua casa com segurança.',
      preco: 'R$ 15,00',
      duracao: '2-4 horas',
      icon: <Truck className="h-6 w-6" />,
      categoria: 'outros'
    }
  ];

  const categorias = [
    { id: '', nome: 'Todos os Serviços', color: 'bg-gray-100 text-gray-800' },
    { id: 'veterinario', nome: 'Veterinário', color: 'bg-red-100 text-red-800' },
    { id: 'estetica', nome: 'Estética', color: 'bg-pink-100 text-pink-800' },
    { id: 'hospedagem', nome: 'Hospedagem', color: 'bg-blue-100 text-blue-800' },
    { id: 'outros', nome: 'Outros', color: 'bg-green-100 text-green-800' }
  ];

  const servicosFiltrados = selectedCategory 
    ? servicos.filter(servico => servico.categoria === selectedCategory)
    : servicos;

  const getCategoryColor = (categoria: string) => {
    switch (categoria) {
      case 'veterinario':
        return 'bg-red-100 text-red-800';
      case 'estetica':
        return 'bg-pink-100 text-pink-800';
      case 'hospedagem':
        return 'bg-blue-100 text-blue-800';
      case 'outros':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nossos Serviços
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Oferecemos uma gama completa de serviços para cuidar do seu pet com todo o carinho e profissionalismo que ele merece.
          </p>
        </div>

        {/* Filtros por Categoria */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categorias.map((categoria) => (
            <button
              key={categoria.id}
              onClick={() => setSelectedCategory(categoria.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === categoria.id
                  ? 'bg-pink-500 text-white'
                  : categoria.color + ' hover:bg-pink-100 hover:text-pink-800'
              }`}
            >
              {categoria.nome}
            </button>
          ))}
        </div>

        {/* Grid de Serviços */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {servicosFiltrados.map((servico) => (
            <div key={servico.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Header do Card */}
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white">
                <div className="flex items-center">
                  <div className="p-3 bg-white bg-opacity-20 rounded-full mr-4">
                    {servico.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{servico.nome}</h3>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getCategoryColor(servico.categoria)} bg-white bg-opacity-20 text-white`}>
                      {categorias.find(cat => cat.id === servico.categoria)?.nome}
                    </span>
                  </div>
                </div>
              </div>

              {/* Conteúdo do Card */}
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  {servico.descricao}
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-700">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">Duração: {servico.duracao}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <span className="text-2xl font-bold text-pink-600">{servico.preco}</span>
                  </div>
                </div>

                {/* Botão de Agendamento */}
                {isLoggedIn && userType === 'usuario' ? (
                  <button className="w-full bg-pink-600 text-white py-3 px-4 rounded-lg hover:bg-pink-700 transition-colors font-medium inline-flex items-center justify-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Agendar Serviço
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium inline-flex items-center justify-center"
                  >
                    Faça login para agendar
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Informações de Contato */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Informações de Contato
            </h2>
            <p className="text-gray-600">
              Entre em contato conosco para agendar ou tirar dúvidas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Telefone</h3>
              <p className="text-gray-600">(21) 9999-9999</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Endereço</h3>
              <p className="text-gray-600">Rua dos Pets, 123<br />Rio de Janeiro, RJ</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Horário</h3>
              <p className="text-gray-600">Segunda a Sexta: 8h às 18h<br />Sábado: 8h às 14h</p>
            </div>
          </div>
        </div>

        {/* Avaliações */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            O que nossos clientes dizem
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Excelente atendimento! Minha cachorrinha ficou linda depois do banho e tosa."
              </p>
              <p className="font-semibold text-gray-900">Maria Silva</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "O veterinário é muito atencioso e cuidadoso. Recomendo!"
              </p>
              <p className="font-semibold text-gray-900">João Santos</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Deixei meu gato no hotel por uma semana e ele voltou muito bem cuidado."
              </p>
              <p className="font-semibold text-gray-900">Ana Costa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

