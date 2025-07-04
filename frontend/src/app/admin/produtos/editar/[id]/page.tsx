'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getProdutoById, updateProduto } from '@/lib/api';
import { ArrowLeft, Package, DollarSign, FileText, Tag } from 'lucide-react';
import Link from 'next/link';

export default function EditarProdutoPage() {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    tipo: '',
    estoque: '',
    categoria: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        setLoading(true);
        const response = await getProdutoById(parseInt(id));
        const produto = response.data?.produto || response;
        
        setFormData({
          nome: produto.nome || '',
          descricao: produto.descricao || '',
          preco: produto.preco?.toString() || '',
          tipo: produto.tipo || '',
          estoque: produto.estoque?.toString() || '',
          categoria: produto.categoria || ''
        });
      } catch (error) {
        console.error('Erro ao carregar produto:', error);
        setError('Erro ao carregar produto');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduto();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const produtoData = {
        ...formData,
        preco: parseFloat(formData.preco),
        estoque: parseInt(formData.estoque) || 0
      };

      await updateProduto(parseInt(id), produtoData);
      router.push('/admin/produtos');
    } catch (error: any) {
      console.error('Erro ao atualizar produto:', error);
      setError(error.response?.data?.message || 'Erro ao atualizar produto');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-8 w-64"></div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="space-y-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i}>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-24"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/admin/produtos" 
            className="inline-flex items-center text-pink-600 hover:text-pink-500 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Produtos
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Editar Produto</h1>
          <p className="text-gray-600 mt-2">Atualize as informações do produto</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Formulário */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome do Produto */}
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                <Package className="inline h-4 w-4 mr-1" />
                Nome do Produto *
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Digite o nome do produto"
              />
            </div>

            {/* Descrição */}
            <div>
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="inline h-4 w-4 mr-1" />
                Descrição
              </label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Descreva o produto"
              />
            </div>

            {/* Preço e Estoque */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="preco" className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline h-4 w-4 mr-1" />
                  Preço (R$) *
                </label>
                <input
                  type="number"
                  id="preco"
                  name="preco"
                  value={formData.preco}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="0,00"
                />
              </div>

              <div>
                <label htmlFor="estoque" className="block text-sm font-medium text-gray-700 mb-2">
                  <Package className="inline h-4 w-4 mr-1" />
                  Quantidade em Estoque
                </label>
                <input
                  type="number"
                  id="estoque"
                  name="estoque"
                  value={formData.estoque}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Tipo e Categoria */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="inline h-4 w-4 mr-1" />
                  Tipo
                </label>
                <select
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">Selecione um tipo</option>
                  <option value="ração">Ração</option>
                  <option value="brinquedo">Brinquedo</option>
                  <option value="acessório">Acessório</option>
                  <option value="higiene">Higiene</option>
                  <option value="medicamento">Medicamento</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div>
                <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="inline h-4 w-4 mr-1" />
                  Categoria
                </label>
                <select
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="cão">Cão</option>
                  <option value="gato">Gato</option>
                  <option value="pássaro">Pássaro</option>
                  <option value="peixe">Peixe</option>
                  <option value="roedor">Roedor</option>
                  <option value="geral">Geral</option>
                </select>
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-4 pt-6">
              <Link
                href="/admin/produtos"
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

