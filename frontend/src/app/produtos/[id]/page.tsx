'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getProdutoById, Produto } from '@/lib/api';
import { ArrowLeft, ShoppingCart, Heart, Star, Package, Truck, Shield } from 'lucide-react';

export default function ProdutoDetalhePage() {
  const params = useParams();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState<number | null>(null);

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const id = parseInt(params.id as string);
        const response = await getProdutoById(id);
        setProduto(response.data.produto);
      } catch (error) {
        console.error('Erro ao carregar produto:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduto();
    }
  }, [params.id]);

  // Função para obter imagem baseada no tipo do produto
  const getProductImage = (tipo: string) => {
    switch (tipo) {
      case 'Cachorro':
        return '/images/comida_cachorro.png';
      case 'Gato':
        return '/images/comida_gato.png';
      case 'Peixe':
        return '/images/racaodepeixe.jpg';
      default:
        return '/images/foto_site.png';
    }
  };

  // Função para verificar e formatar URLs de imagem
  const getSafeImageUrl = (url: string | undefined, fallback: string) => {
    if (!url) return fallback;
    try {
      new URL(url);
      return url;
    } catch {
      return fallback;
    }
  };

  const handleImageError = (index: number) => {
    setImageError(index);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!produto) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Produto não encontrado</h1>
            <Link
              href="/produtos"
              className="text-pink-600 hover:text-pink-700 font-medium"
            >
              Voltar aos produtos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const productImages = [
    getSafeImageUrl(produto.img, getProductImage(produto.tipo)),
    getProductImage(produto.tipo),
    '/images/foto_site.png'
  ];

  const formatPrice = (price: string) => {
    if (!price.includes('€')) {
      return `€${price}`;
    }
    return price;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-pink-600">Início</Link>
          <span>/</span>
          <Link href="/produtos" className="hover:text-pink-600">Produtos</Link>
          <span>/</span>
          <span className="text-gray-900">{produto.nome}</span>
        </nav>

        {/* Botão Voltar */}
        <Link
          href="/produtos"
          className="inline-flex items-center space-x-2 text-pink-600 hover:text-pink-700 mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Voltar aos produtos</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galeria de Imagens */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
              <Image
                src={imageError === selectedImage ? getProductImage(produto.tipo) : productImages[selectedImage]}
                alt={produto.nome}
                fill
                className="object-cover"
                onError={() => handleImageError(selectedImage)}
                priority
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square bg-white rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-pink-500' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={imageError === index ? getProductImage(produto.tipo) : image}
                    alt={`${produto.nome} - Imagem ${index + 1}`}
                    fill
                    className="object-cover"
                    onError={() => handleImageError(index)}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Informações do Produto */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-sm font-medium">
                  {produto.tipo}
                </span>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">(4.8) 124 avaliações</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{produto.nome}</h1>
              <p className="text-4xl font-bold text-pink-600">{formatPrice(produto.preco)}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Descrição</h3>
              <p className="text-gray-600 leading-relaxed">{produto.descricao}</p>
            </div>

            {/* Informações do Vendedor */}
            {produto.funcionario && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Vendido por</h3>
                <p className="text-gray-600">
                  {produto.funcionario.nome} {produto.funcionario.sobrenome}
                </p>
                {produto.loja && (
                  <p className="text-sm text-gray-500">{produto.loja.nome}</p>
                )}
              </div>
            )}

            {/* Quantidade e Compra */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantidade
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button className="flex-1 bg-pink-600 text-white py-3 px-6 rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center space-x-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Adicionar ao Carrinho</span>
                </button>
                <button className="w-12 h-12 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50">
                  <Heart className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Benefícios */}
            <div className="space-y-3 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-600">Entrega grátis para compras acima de €50</span>
              </div>
              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">Produto em stock</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-purple-600" />
                <span className="text-sm text-gray-600">Garantia de qualidade</span>
              </div>
            </div>
          </div>
        </div>

        {/* Produtos Relacionados */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Produtos Relacionados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48 bg-gray-100">
                  <Image
                    src={getProductImage(produto.tipo)}
                    alt={`Produto relacionado ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Produto Similar {i + 1}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Descrição do produto similar
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-pink-600">€29.99</span>
                    <button className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors text-sm font-medium">
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}