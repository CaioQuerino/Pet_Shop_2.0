'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getAllUsuarios, deleteUsuario, Usuario } from '@/lib/api';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar,
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

export default function GerenciarClientesPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Usuario | null>(null);

  const { user, userType, isLoggedIn } = useAuth();
  const router = useRouter();

  // Verificar se o usuário está logado e é um funcionário
  useEffect(() => {
    if (!isLoggedIn || userType !== 'funcionario') {
      router.push('/login');
      return;
    }

    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        const response = await getAllUsuarios();
        const usuariosData = response.data?.usuarios || [];
        setUsuarios(usuariosData);
        setFilteredUsuarios(usuariosData);
      } catch (error: any) {
        console.error('Erro ao carregar usuários:', error);
        setError('Erro ao carregar lista de clientes');
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, [isLoggedIn, userType, router]);

  // Filtrar usuários baseado no termo de busca
  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsuarios(usuarios);
      return;
    }

    const filtered = usuarios.filter(usuario =>
      usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.sobrenome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.cpf.includes(searchTerm)
    );
    setFilteredUsuarios(filtered);
  }, [searchTerm, usuarios]);

  const handleDeleteClick = (usuario: Usuario) => {
    setUserToDelete(usuario);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      setDeletingId(userToDelete.cpf);
      await deleteUsuario(userToDelete.cpf);
      setUsuarios(prev => prev.filter(u => u.cpf !== userToDelete.cpf));
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error: any) {
      console.error('Erro ao deletar usuário:', error);
      setError('Erro ao excluir cliente');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Não informado';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  };

  if (!isLoggedIn || userType !== 'funcionario') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <UserCheck className="mx-auto h-12 w-12 text-pink-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Restrito</h2>
          <p className="text-gray-600 mb-4">Você precisa estar logado como funcionário para acessar esta área.</p>
          <Link href="/login" className="text-pink-600 hover:text-pink-500">
            Fazer Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-8 w-64"></div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Gerenciar Clientes
              </h1>
              <p className="text-gray-600">
                Visualize e gerencie todos os clientes cadastrados
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-lg px-4 py-2 shadow">
                <span className="text-sm text-gray-600">Total de clientes:</span>
                <span className="ml-2 font-bold text-pink-600">{usuarios.length}</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Filtros e Busca */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome, email ou CPF..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                Mostrando {filteredUsuarios.length} de {usuarios.length} clientes
              </span>
            </div>
          </div>
        </div>

        {/* Lista de Clientes */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {filteredUsuarios.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
              </h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? 'Tente ajustar os termos de busca' 
                  : 'Os clientes aparecerão aqui quando se cadastrarem'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CPF
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data de Cadastro
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsuarios.map((usuario) => (
                    <tr key={usuario.cpf} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-pink-600">
                                {usuario.nome.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {usuario.nome} {usuario.sobrenome}
                            </div>
                            <div className="text-sm text-gray-500">
                              Cliente
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center mb-1">
                            <Mail className="h-3 w-3 text-gray-400 mr-1" />
                            {usuario.email}
                          </div>
                          {usuario.celular && (
                            <div className="flex items-center">
                              <Phone className="h-3 w-3 text-gray-400 mr-1" />
                              {usuario.celular}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {usuario.cpf}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                          {formatDate(usuario.dataCadastro)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/admin/usuarios/${usuario.cpf}`}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="Visualizar detalhes"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(usuario)}
                            disabled={deletingId === usuario.cpf}
                            className="text-red-600 hover:text-red-900 p-1 rounded disabled:opacity-50"
                            title="Excluir cliente"
                          >
                            {deletingId === usuario.cpf ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal de Confirmação de Exclusão */}
        {showDeleteModal && userToDelete && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Confirmar Exclusão
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Tem certeza que deseja excluir o cliente{' '}
                  <strong>{userToDelete.nome} {userToDelete.sobrenome}</strong>?
                  Esta ação não pode ser desfeita.
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setUserToDelete(null);
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={deletingId === userToDelete.cpf}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    {deletingId === userToDelete.cpf ? 'Excluindo...' : 'Excluir'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

