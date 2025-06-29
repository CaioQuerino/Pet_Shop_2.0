'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProdutoById, updateProduto, Produto } from '@/lib/api';
import Image from 'next/image';
import { stringify } from 'querystring';

export default function EditarProduto({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: 0,
    img: '',
    tipo: '',
    idLoja: 0
  });
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        setLoading(true);
        const produtoData = await getProdutoById(Number(params.id));
        setProduto(produtoData);
        setFormData({
          nome: produtoData.nome,
          descricao: produtoData.descricao || '',
          preco: produtoData.preco,
          img: produtoData.img || '',
          tipo: produtoData.tipo || '',
          idLoja: produtoData.idLoja || 0
        });
        if (produtoData.img) {
          setImagePreview(produtoData.img);
        }
      } catch (error) {
        console.error('Erro ao carregar produto:', error);
        setError('Falha ao carregar produto');
      } finally {
        setLoading(false);
      }
    };

    fetchProduto();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'preco' || name === 'idLoja' ? Number(value) : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData(prev => ({
          ...prev,
          img: reader.result as string
        }));
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await updateProduto(Number(params.id), formData);
      router.push('/admin/produtos');
      alert('Produto atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      setError('Falha ao atualizar produto');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !produto) {
    return <div className="p-4">Carregando produto...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!produto) {
    return <div className="p-4">Produto não encontrado</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Editar Produto</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Descrição</label>
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Preço (R$)</label>
            <input
              type="number"
              name="preco"
              value={formData.preco}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">ID da Loja</label>
            <input
              type="number"
              name="idLoja"
              value={formData.idLoja}
              onChange={handleChange}
              min="1"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo</label>
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Selecione um tipo</option>
            <option value="tipo1">Tipo 1</option>
            <option value="tipo2">Tipo 2</option>
            <option value="tipo3">Tipo 3</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Imagem do Produto</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-amber-50 file:text-amber-700
              hover:file:bg-amber-100"
          />
          {imagePreview && (
            <div className="mt-2">
              <Image
                src={imagePreview}
                alt="Preview da imagem"
                width={150}
                height={150}
                className="rounded-md"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => router.push('/admin/produtos')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 disabled:bg-amber-300"
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}