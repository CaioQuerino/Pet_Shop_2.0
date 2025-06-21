'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getAllProdutos, Produto } from '@/lib/api';
import { Search, Filter, ShoppingBag } from 'lucide-react';

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [filteredProdutos, setFilteredProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await getAllProdutos();
        setProdutos(response.data.produtos);
        setFilteredProdutos(response.data.produtos);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  useEffect(() => {
    let filtered = produtos;

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(produto =>
        produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produto.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por tipo
    if (selectedType) {
      filtered = filtered.filter(produto => produto.tipo === selectedType);
    }

    setFilteredProdutos(filtered);
  }, [produtos, searchTerm, selectedType]);

  const tipos = [...new Set(produtos.map(produto => produto.tipo))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Nossos Produtos</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                  </div>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nossos Produtos
          </h1>
          <p className="text-xl text-gray-600">
            Encontre os melhores produtos para o seu pet
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            {/* Filtro por tipo */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white"
              >
                <option value="">Todos os tipos</option>
                {tipos.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="mb-6">
          <p className="text-gray-600">
            Mostrando {filteredProdutos.length} de {produtos.length} produtos
          </p>
        </div>

        {/* Grid de produtos */}
        {filteredProdutos.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-500">
              Tente ajustar os filtros ou termos de busca
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProdutos.map((produto) => (
              <div key={produto.idPro} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48 bg-gray-100">
                  <Image
                    src="/images/imagemProdutoOFF.png"
                    alt={produto.nome}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-pink-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                    {produto.tipo}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                    {produto.nome}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {produto.descricao}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-pink-600">
                      {produto.preco}
                    </span>
                    <Link
                      href={`/produtos/${produto.idPro}`}
                      className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors text-sm font-medium"
                    >
                      Ver Detalhes
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginação (placeholder para implementação futura) */}
        {filteredProdutos.length > 12 && (
          <div className="mt-12 flex justify-center">
            <div className="flex space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Anterior
              </button>
              <button className="px-4 py-2 bg-pink-500 text-white rounded-lg">
                1
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                2
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Próximo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

