'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createPet } from '@/lib/api';
import { Heart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CadastrarPetPage() {
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'Cachorro' as 'Cachorro' | 'Gato' | 'Peixe' | 'Passaro' | 'Outro',
    raca: '',
    idade: '',
    peso: '',
    observacoes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { user, userType, isLoggedIn } = useAuth();
  const router = useRouter();

  // Verificar se o usuário está logado e é um cliente
  React.useEffect(() => {
    if (!isLoggedIn || userType !== 'usuario') {
      router.push('/login');
    }
  }, [isLoggedIn, userType, router]);

  const validateForm = () => {
    if (!formData.nome.trim()) {
      setError('O nome do pet é obrigatório');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Preparar os dados para a API
      const petData = {
        nome: formData.nome,
        tipo: formData.tipo,
        ...(formData.raca && { raca: formData.raca }),
        ...(formData.idade && { idade: formData.idade }),
      };

      await createPet(petData);
      
      setSuccess('Pet cadastrado com sucesso!');
      setTimeout(() => {
        router.push('/meus-pets');
      }, 2000);
    } catch (error: any) {
      console.error('Erro ao cadastrar pet:', error);
      setError(
        error.response?.data?.message || 
        error.message || 
        'Erro ao cadastrar pet. Por favor, verifique os dados e tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isLoggedIn || userType !== 'usuario') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Heart className="mx-auto h-12 w-12 text-pink-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Restrito</h2>
          <p className="text-gray-600 mb-4">Você precisa estar logado como cliente para cadastrar pets.</p>
          <Link href="/login" className="text-pink-600 hover:text-pink-500">
            Fazer Login
          </Link>
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
            href="/meus-pets"
            className="inline-flex items-center text-pink-600 hover:text-pink-500 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Meus Pets
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Cadastrar Novo Pet</h1>
          <p className="text-gray-600 mt-2">
            Adicione as informações do seu pet para um atendimento personalizado
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
                {success}
              </div>
            )}

            {/* Nome do Pet */}
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Pet *
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                required
                value={formData.nome}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:opacity-50"
                placeholder="Digite o nome do seu pet"
              />
            </div>

            {/* Tipo */}
            <div>
              <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-2">
                Tipo *
              </label>
              <select
                id="tipo"
                name="tipo"
                required
                value={formData.tipo}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:opacity-50"
              >
                <option value="Cachorro">Cachorro</option>
                <option value="Gato">Gato</option>
                <option value="Peixe">Peixe</option>
                <option value="Passaro">Pássaro</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            {/* Raça */}
            <div>
              <label htmlFor="raca" className="block text-sm font-medium text-gray-700 mb-2">
                Raça
              </label>
              <input
                id="raca"
                name="raca"
                type="text"
                value={formData.raca}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:opacity-50"
                placeholder="Digite a raça do seu pet"
              />
            </div>

            {/* Idade e Peso */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="idade" className="block text-sm font-medium text-gray-700 mb-2">
                  Idade (anos)
                </label>
                <input
                  id="idade"
                  name="idade"
                  type="number"
                  min="0"
                  max="30"
                  value={formData.idade}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:opacity-50"
                  placeholder="0"
                />
              </div>

              <div>
                <label htmlFor="peso" className="block text-sm font-medium text-gray-700 mb-2">
                  Peso (kg)
                </label>
                <input
                  id="peso"
                  name="peso"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.peso}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:opacity-50"
                  placeholder="0.0"
                />
              </div>
            </div>

            {/* Observações */}
            <div>
              <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 mb-2">
                Observações
              </label>
              <textarea
                id="observacoes"
                name="observacoes"
                rows={4}
                value={formData.observacoes}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:opacity-50"
                placeholder="Informações adicionais sobre o seu pet (temperamento, alergias, medicamentos, etc.)"
              />
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-pink-600 text-white py-3 px-6 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors duration-200"
              >
                {loading ? 'Cadastrando...' : 'Cadastrar Pet'}
              </button>
              
              <Link
                href="/meus-pets"
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium text-center transition-colors duration-200"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>

        {/* Dicas */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            💡 Dicas para um cadastro completo
          </h3>
          <ul className="text-blue-800 space-y-2">
            <li>• Mantenha as informações sempre atualizadas</li>
            <li>• Inclua informações sobre alergias ou medicamentos nas observações</li>
            <li>• O peso e idade ajudam nossos veterinários a dar o melhor atendimento</li>
            <li>• Você pode editar essas informações a qualquer momento</li>
          </ul>
        </div>
      </div>
    </div>
  );
}