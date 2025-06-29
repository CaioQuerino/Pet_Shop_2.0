'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllProdutos, deleteProduto, Produto } from '@/lib/api';

export default function AdmProducts() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [filteredProdutos, setFilteredProdutos] = useState<Produto[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        setLoading(true);
        const response = await getAllProdutos();
        const produtosData = Array.isArray(response) ? response : 
                          response.data?.produtos || [];
        setProdutos(produtosData);
        setFilteredProdutos(produtosData);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        setError('Falha ao carregar produtos');
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  useEffect(() => {
    let filtered = [...produtos];

    if (searchTerm) {
      filtered = filtered.filter(produto =>
        produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produto.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter(produto => produto.tipo === selectedType);
    }

    setFilteredProdutos(filtered);
  }, [searchTerm, selectedType, produtos]);

  const handleDelete = async (idPro: number) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }
    
    try {
      setDeletingId(idPro);
      await deleteProduto(idPro);
      setProdutos(prev => prev.filter(produto => produto.idPro !== idPro));
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      setError('Falha ao excluir produto');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className="p-4">Carregando produtos...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className='bg-white p-4'>
      <div className='flex justify-between items-center mb-6'>
        <div className='flex gap-4'>
          <input
            type="text"
            placeholder="Buscar produtos..."
            className="border p-2 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="border p-2 rounded"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">Todos os tipos</option>
            <option value="tipo1">Tipo 1</option>
            <option value="tipo2">Tipo 2</option>
          </select>
        </div>
        <Link 
          href="/admin/produtos/novo" 
          className='bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 font-medium'
        >
          Adicionar produto
        </Link>
      </div>

      {filteredProdutos.length === 0 ? (
        <p>Nenhum produto encontrado</p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {filteredProdutos.map((product) => (
            <div key={product.idPro} className='border rounded-lg p-4 hover:shadow-md transition-shadow'>
              <h3 className='font-bold text-lg'>{product.nome}</h3>
              <p className='text-gray-600 my-2'>{product.descricao}</p>
              <p className='text-amber-500 font-medium'>
                R$ {product.preco}
              </p>
              <div className='mt-4 flex gap-2'>
                <Link 
                  href={`/admin/produtos/editar/${product.idPro}`} 
                  className='text-blue-500 hover:text-blue-700'
                >
                  Editar
                </Link>
                <button 
                  className='text-red-500 hover:text-red-700'
                  onClick={() => handleDelete(product.idPro)}
                  disabled={deletingId === product.idPro}
                >
                  {deletingId === product.idPro ? 'Excluindo...' : 'Excluir'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}