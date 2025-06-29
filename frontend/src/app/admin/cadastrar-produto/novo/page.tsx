'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, Upload, X, Check } from 'lucide-react';
import { createProduto } from '@/lib/api';

export default function CadastrarProdutoPage() {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    tipo: 'Cachorro' as 'Cachorro' | 'Gato' | 'Passarinho' | 'Peixe' | 'Outros',
    idLoja: '',
    idFuncionario: '',
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let imagePath = '';

      // Upload da imagem primeiro, se selecionada
      if (selectedImage) {
        const imageFormData = new FormData();
        imageFormData.append('file', selectedImage);

        const imageResponse = await fetch('http://localhost:3333/api/upload/produto', {
          method: 'POST',
          body: imageFormData,
        });

        if (!imageResponse.ok) {
          throw new Error('Erro ao fazer upload da imagem');
        }

        const imageResult = await imageResponse.json();
        imagePath = imageResult.data.path;
      }

      // Criar produto usando a função da API
      const productData = {
        nome: formData.nome,
        descricao: formData.descricao,
        preco: formData.preco,
        tipo: formData.tipo,
        idLoja: formData.idLoja ? parseInt(formData.idLoja) : undefined,
        idFuncionario: formData.idFuncionario || undefined,
        img: imagePath || '/images/imagemProdutoOFF.png',
      };

      const result = await createProduto(productData);

      if (result.status === 'success') {
        setSuccess('Produto cadastrado com sucesso! Redirecionando...');
        setTimeout(() => {
          router.push('/produtos');
        }, 2000);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || error.message || 'Erro ao cadastrar produto');
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setError('Tipo de arquivo não permitido. Use JPG, PNG, WebP ou GIF.');
        return;
      }

      // Validar tamanho (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Arquivo muito grande. Tamanho máximo: 5MB.');
        return;
      }

      setSelectedImage(file);
      
      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-pink-600 text-white">
            <div className="flex items-center">
              <Package className="h-6 w-6 mr-3" />
              <h1 className="text-xl font-bold">Cadastrar Produto</h1>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <Link 
                href="/admin/produtos" 
                className="text-pink-600 hover:text-pink-500 text-sm font-medium"
              >
                ← Voltar para produtos
              </Link>
            </div>

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

              {/* Nome do Produto */}
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Produto *
                </label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  required
                  value={formData.nome}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Digite o nome do produto"
                />
              </div>

              {/* Descrição */}
              <div>
                <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  id="descricao"
                  name="descricao"
                  rows={4}
                  value={formData.descricao}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Descreva o produto..."
                />
              </div>

              {/* Preço e Tipo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="preco" className="block text-sm font-medium text-gray-700 mb-2">
                    Preço *
                  </label>
                  <input
                    id="preco"
                    name="preco"
                    type="text"
                    required
                    value={formData.preco}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Ex: 29.90"
                  />
                </div>

                <div>
                  <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Animal *
                  </label>
                  <select
                    id="tipo"
                    name="tipo"
                    required
                    value={formData.tipo}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  >
                    <option value="Cachorro">Cachorro</option>
                    <option value="Gato">Gato</option>
                    <option value="Passarinho">Passarinho</option>
                    <option value="Peixe">Peixe</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
              </div>

              {/* ID da Loja e ID do Funcionário */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="idLoja" className="block text-sm font-medium text-gray-700 mb-2">
                    ID da Loja
                  </label>
                  <input
                    id="idLoja"
                    name="idLoja"
                    type="number"
                    value={formData.idLoja}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="ID da loja (opcional)"
                  />
                </div>

                <div>
                  <label htmlFor="idFuncionario" className="block text-sm font-medium text-gray-700 mb-2">
                    ID do Funcionário
                  </label>
                  <input
                    id="idFuncionario"
                    name="idFuncionario"
                    type="text"
                    value={formData.idFuncionario}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="ID do funcionário (opcional)"
                  />
                </div>
              </div>

              {/* Upload de Imagem */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagem do Produto
                </label>
                
                {!imagePreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-pink-400 transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="h-12 w-12 text-gray-400 mb-4" />
                      <span className="text-sm text-gray-600 mb-2">
                        Clique para selecionar uma imagem
                      </span>
                      <span className="text-xs text-gray-500">
                        JPG, PNG, WebP ou GIF (máx. 5MB)
                      </span>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-green-500 text-white rounded-full p-1">
                      <Check className="h-4 w-4" />
                    </div>
                  </div>
                )}
              </div>

              {/* Botões */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 px-4 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Cadastrando...' : 'Cadastrar Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

