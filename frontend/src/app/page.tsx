'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllProdutos, Produto } from '@/lib/api';
import { ShoppingBag, Heart, Star, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await getAllProdutos();
        // Pegar apenas os primeiros 6 produtos para exibir na home
        setProdutos(response.data.produtos.slice(0, 6));
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-500 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Cuidando do seu melhor amigo
              </h1>
              <p className="text-xl mb-8 text-pink-100">
                Encontre os melhores produtos e serviços para o seu pet. 
                Qualidade, carinho e dedicação em cada produto.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/produtos"
                  className="bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Ver Produtos
                </Link>
                <Link
                  href="/servicos"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-pink-600 transition-colors inline-flex items-center justify-center"
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Nossos Serviços
                </Link>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/Foto site.png"
                alt="Pet feliz"
                width={600}
                height={400}
                className="rounded-lg shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Produtos em Destaque */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Produtos em Destaque
            </h2>
            <p className="text-xl text-gray-600">
              Os melhores produtos para o seu pet
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {produtos.map((produto) => (
                <div key={produto.idPro} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative h-48 bg-gray-100">
                    <Image
                      src=""
                      alt={produto.nome}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-pink-500 text-white px-2 py-1 rounded-full text-sm">
                      {produto.tipo}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {produto.nome}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {produto.descricao}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-pink-600">
                        {produto.preco}
                      </span>
                      <Link
                        href={`/produtos/${produto.idPro}`}
                        className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors inline-flex items-center"
                      >
                        Ver Detalhes
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/produtos"
              className="bg-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors inline-flex items-center"
            >
              Ver Todos os Produtos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nossos Serviços
            </h2>
            <p className="text-xl text-gray-600">
              Cuidado completo para o seu pet
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Consultas Veterinárias
              </h3>
              <p className="text-gray-600 mb-6">
                Cuidados médicos especializados para manter seu pet sempre saudável e feliz.
              </p>
              <Link
                href="/servicos/consulta"
                className="text-blue-600 font-semibold hover:text-blue-700 inline-flex items-center"
              >
                Agendar Consulta
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Hotel para Pets
              </h3>
              <p className="text-gray-600 mb-6">
                Um lugar seguro e confortável para seu pet ficar quando você precisar viajar.
              </p>
              <Link
                href="/servicos/hotel"
                className="text-green-600 font-semibold hover:text-green-700 inline-flex items-center"
              >
                Reservar Hotel
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Promoções */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Promoções Especiais
            </h2>
            <p className="text-xl text-gray-600">
              Ofertas imperdíveis para o seu pet
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/images/promocao1.jpg"
                alt="Promoção 1"
                width={400}
                height={300}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center text-white">
                  <h3 className="text-2xl font-bold mb-2">Ração Premium</h3>
                  <p className="text-lg">20% OFF</p>
                </div>
              </div>
            </div>

            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/images/promocao2.jpg"
                alt="Promoção 2"
                width={400}
                height={300}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center text-white">
                  <h3 className="text-2xl font-bold mb-2">Brinquedos</h3>
                  <p className="text-lg">Compre 2 Leve 3</p>
                </div>
              </div>
            </div>

            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/images/promocao3.jpg"
                alt="Promoção 3"
                width={400}
                height={300}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center text-white">
                  <h3 className="text-2xl font-bold mb-2">Consulta</h3>
                  <p className="text-lg">Primeira consulta grátis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

