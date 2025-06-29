'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, PlusCircle, Heart } from 'lucide-react';

export default function Header() {
  const { user, userType, isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-pink-500" />
            <span className="text-2xl font-bold text-gray-900">PetShop</span>
          </Link>

          {/* Navegação Central */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-pink-500 transition-colors">
              Início
            </Link>
            <Link href="/produtos" className="text-gray-700 hover:text-pink-500 transition-colors">
              Produtos
            </Link>
            <Link href="/servicos" className="text-gray-700 hover:text-pink-500 transition-colors">
              Serviços
            </Link>
            {isLoggedIn && userType === 'usuario' && (
              <Link href="/meus-pets" className="text-gray-700 hover:text-pink-500 transition-colors">
                Meus Pets
              </Link>
            )}
            {isLoggedIn && userType === 'funcionario' && (
              <Link href="/admin" className="text-gray-700 hover:text-pink-500 transition-colors">
                Administração
              </Link>
            )}
          </nav>

          {/* Ações do Usuário */}
          <div className="flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-pink-500 transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
                >
                  Cadastrar
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">
                    Olá, {user?.nome}
                  </span>
                </div>
                
                {userType === 'usuario' && (
                  <Link
                    href="/cadastrar-pet"
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <PlusCircle className="h-5 w-5" />
                    <span>Cadastrar Pet</span>
                  </Link>
                )}

                {userType === 'funcionario' && (
                  <Link
                    href="/admin/cadastrar-produto/novo"
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <PlusCircle className="h-5 w-5" />
                    <span>Novo Produto</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sair</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      <div className="md:hidden bg-gray-50 border-t">
        <div className="px-4 py-2 space-y-1">
          <Link href="/" className="block py-2 text-gray-700 hover:text-pink-500">
            Início
          </Link>
          <Link href="/produtos" className="block py-2 text-gray-700 hover:text-pink-500">
            Produtos
          </Link>
          <Link href="/servicos" className="block py-2 text-gray-700 hover:text-pink-500">
            Serviços
          </Link>
          {isLoggedIn && userType === 'usuario' && (
            <Link href="/meus-pets" className="block py-2 text-gray-700 hover:text-pink-500">
              Meus Pets
            </Link>
          )}
          {isLoggedIn && userType === 'funcionario' && (
            <Link href="/admin" className="block py-2 text-gray-700 hover:text-pink-500">
              Administração
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

