'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getDashboard, 
  getUsuariosPorEndereco, 
  getPetsPorTipo, 
  getProdutosPorTipo, 
  getAgendamentos 
} from '@/lib/api';
import { 
  BarChart3, 
  Users, 
  MapPin, 
  PawPrint, 
  Package, 
  Calendar,
  TrendingUp,
  Activity
} from 'lucide-react';

export default function RelatoriosPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Verificar se é funcionário
    const userType = localStorage.getItem('userType');
    if (userType !== 'funcionario') {
      router.push('/login');
      return;
    }

    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      let response;
      switch (activeTab) {
        case 'dashboard':
          response = await getDashboard();
          break;
        case 'usuarios':
          response = await getUsuariosPorEndereco();
          break;
        case 'pets':
          response = await getPetsPorTipo();
          break;
        case 'produtos':
          response = await getProdutosPorTipo();
          break;
        case 'agendamentos':
          response = await getAgendamentos();
          break;
        default:
          response = await getDashboard();
      }
      setData(response.data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'usuarios', label: 'Usuários por Endereço', icon: MapPin },
    { id: 'pets', label: 'Pets por Tipo', icon: PawPrint },
    { id: 'produtos', label: 'Produtos por Tipo', icon: Package },
    { id: 'agendamentos', label: 'Agendamentos', icon: Calendar },
  ];

  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Totais */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <Users className="h-8 w-8 text-blue-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
            <p className="text-2xl font-bold text-gray-900">{data?.totais?.usuarios || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <PawPrint className="h-8 w-8 text-green-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total de Pets</p>
            <p className="text-2xl font-bold text-gray-900">{data?.totais?.pets || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <Package className="h-8 w-8 text-purple-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total de Produtos</p>
            <p className="text-2xl font-bold text-gray-900">{data?.totais?.produtos || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <Activity className="h-8 w-8 text-orange-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Funcionários</p>
            <p className="text-2xl font-bold text-gray-900">{data?.totais?.funcionarios || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <MapPin className="h-8 w-8 text-red-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Endereços Cadastrados</p>
            <p className="text-2xl font-bold text-gray-900">{data?.totais?.enderecos || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <TrendingUp className="h-8 w-8 text-indigo-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Usuários Online</p>
            <p className="text-2xl font-bold text-gray-900">{data?.logados?.usuarios || 0}</p>
          </div>
        </div>
      </div>

      {/* Agendamentos próximos */}
      <div className="bg-white p-6 rounded-lg shadow md:col-span-2 lg:col-span-3">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Agendamentos Próximos (7 dias)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Calendar className="h-6 w-6 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-900">Consultas</p>
                <p className="text-xl font-bold text-blue-900">{data?.agendamentosProximos?.consultas || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Calendar className="h-6 w-6 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-900">Hotel</p>
                <p className="text-xl font-bold text-green-900">{data?.agendamentosProximos?.hotel || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsuarios = () => (
    <div className="space-y-6">
      {data?.relatorio?.map((endereco: any, index: number) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              CEP: {endereco.cep}
            </h3>
            <p className="text-sm text-gray-600">
              {endereco.rua}, {endereco.bairro} - {endereco.cidade}/{endereco.estado}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {endereco._count.usuarios} usuário(s) • {endereco._count.funcionarios} funcionário(s)
            </p>
          </div>
          
          {endereco.usuarios.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Usuários:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {endereco.usuarios.map((usuario: any) => (
                  <div key={usuario.cpf} className="text-sm text-gray-600">
                    {usuario.nome} {usuario.sobrenome} - {usuario.email}
                  </div>
                ))}
              </div>
            </div>
          )}

          {endereco.funcionarios.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Funcionários:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {endereco.funcionarios.map((funcionario: any) => (
                  <div key={funcionario.idFuncionario} className="text-sm text-gray-600">
                    {funcionario.nome} {funcionario.sobrenome} ({funcionario.funcao}) - {funcionario.email}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderPets = () => (
    <div className="space-y-6">
      {data?.relatorio?.map((grupo: any, index: number) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {grupo.tipo} ({grupo.quantidade} pet{grupo.quantidade !== 1 ? 's' : ''})
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {grupo.pets.map((pet: any) => (
              <div key={pet.idPet} className="border rounded-lg p-3">
                <h4 className="font-medium text-gray-900">{pet.nome}</h4>
                <p className="text-sm text-gray-600">Raça: {pet.raca || 'Não informada'}</p>
                <p className="text-sm text-gray-600">Idade: {pet.idade || 'Não informada'}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Dono: {pet.usuario.nome} {pet.usuario.sobrenome}
                </p>
                <p className="text-sm text-gray-500">{pet.usuario.email}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderProdutos = () => (
    <div className="space-y-6">
      {data?.relatorio?.map((grupo: any, index: number) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {grupo.tipo} ({grupo.quantidade} produto{grupo.quantidade !== 1 ? 's' : ''})
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {grupo.produtos.map((produto: any) => (
              <div key={produto.idPro} className="border rounded-lg p-3">
                <h4 className="font-medium text-gray-900">{produto.nome}</h4>
                <p className="text-sm text-gray-600">{produto.descricao}</p>
                <p className="text-sm font-medium text-green-600">R$ {produto.preco}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Cadastrado por: {produto.funcionario?.nome} {produto.funcionario?.sobrenome}
                </p>
                {produto.loja && (
                  <p className="text-sm text-gray-500">Loja: {produto.loja.nome}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderAgendamentos = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Consultas Agendadas ({data?.consultas?.length || 0})
        </h3>
        <div className="space-y-3">
          {data?.consultas?.map((pet: any) => (
            <div key={`consulta-${pet.idPet}`} className="border-l-4 border-blue-500 pl-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">{pet.nome} ({pet.tipo})</h4>
                  <p className="text-sm text-gray-600">
                    Dono: {pet.usuario.nome} {pet.usuario.sobrenome}
                  </p>
                  <p className="text-sm text-gray-500">{pet.usuario.email}</p>
                  {pet.usuario.celular && (
                    <p className="text-sm text-gray-500">{pet.usuario.celular}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-blue-600">
                    {new Date(pet.consulta).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(pet.consulta).toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Hotel Agendado ({data?.hotel?.length || 0})
        </h3>
        <div className="space-y-3">
          {data?.hotel?.map((pet: any) => (
            <div key={`hotel-${pet.idPet}`} className="border-l-4 border-green-500 pl-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">{pet.nome} ({pet.tipo})</h4>
                  <p className="text-sm text-gray-600">
                    Dono: {pet.usuario.nome} {pet.usuario.sobrenome}
                  </p>
                  <p className="text-sm text-gray-500">{pet.usuario.email}</p>
                  {pet.usuario.celular && (
                    <p className="text-sm text-gray-500">{pet.usuario.celular}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">
                    {new Date(pet.hotel).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(pet.hotel).toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'usuarios':
        return renderUsuarios();
      case 'pets':
        return renderPets();
      case 'produtos':
        return renderProdutos();
      case 'agendamentos':
        return renderAgendamentos();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="mt-2 text-gray-600">Visualize estatísticas e dados do sistema</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-pink-500 text-pink-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
}

