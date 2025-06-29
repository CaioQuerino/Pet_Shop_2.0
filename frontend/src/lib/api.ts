import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor para tratar respostas de erro
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userNickname');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userType');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Tipos de dados
export interface Usuario {
  cpf: string;
  nome: string;
  sobrenome: string;
  email: string;
  celular?: string;
  img?: string;
  cep?: string;
  numero?: string;
  complemento?: string;
  logradouro?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  dataNascimento?: string;
  dataCadastro?: string;
}

export interface Funcionario {
  idFuncionario: string;
  nome: string;
  sobrenome: string;
  email: string;
  funcao: 'Default' | 'Veterinario' | 'Gerente' | 'Master';
  telefone?: string;
  img?: string;
  dataCadastro?: string;
}

export interface Produto {
  idPro: number;
  nome: string;
  descricao: string;
  preco: number | string;
  img?: string;
  tipo: string;
  categoria?: string;
  estoque?: number;
  funcionario?: {
    nome: string;
    sobrenome: string;
  };
  loja?: {
    nome: string;
  };
  dataCadastro?: string;
}

export interface Pet {
  idPet: number;
  nome: string;
  especie: 'Cachorro' | 'Gato' | 'Peixe' | 'Passaro' | 'Outro';
  tipo?: string;
  raca?: string;
  idade?: number;
  peso?: number;
  observacoes?: string;
  usuario?: {
    nome: string;
    sobrenome: string;
    email: string;
    celular?: string;
  };
  dataCadastro?: string;
}

export interface Agendamento {
  id: number;
  clienteNome: string;
  clienteCpf: string;
  petNome: string;
  petId: number;
  servico: string;
  servicoId: number;
  data: string;
  hora: string;
  status: 'agendado' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado';
  observacoes?: string;
  funcionario?: string;
  funcionarioId?: string;
  preco?: number;
  dataCriacao?: string;
  dataAtualizacao?: string;
}

export interface Servico {
  id: number;
  nome: string;
  descricao?: string;
  preco: number;
  duracao: number; // em minutos
  categoria?: string;
  ativo?: boolean;
}

// Tipos para respostas da API
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface LoginResponse {
  token: string;
  user: Usuario | Funcionario;
  userType: 'usuario' | 'funcionario';
}

// Funções da API

// Usuários
export const registerUsuario = async (data: {
  cpf: string;
  nome: string;
  sobrenome: string;
  email: string;
  senha: string;
  celular?: string;
  cep?: string;
  numero?: string;
  complemento?: string;
}) => {
  const response = await api.post('/api/usuarios/register', data);
  return response.data;
};

export const loginUsuario = async (data: { email: string; senha: string }) => {
  const response = await api.post('/api/usuarios/login', data);
  return response.data;
};

export const logoutUsuario = async () => {
  const response = await api.post('/api/usuarios/logout');
  return response.data;
};

export const getUsuarioProfile = async () => {
  const response = await api.get('/api/usuarios/profile');
  return response.data;
};

export const getAllUsuarios = async () => {
  const response = await api.get('/api/usuarios/all');
  return response.data;
};

export const updateUsuarioProfile = async (data: Partial<Usuario>) => {
  const response = await api.put('/api/usuarios/profile', data);
  return response.data;
};

export const getUsuarioByCpf = async (cpf: string) => {
  const response = await api.get(`/api/usuarios/${cpf}`);
  return response.data;
};

export const deleteUsuario = async (cpf: string) => {
  const response = await api.delete(`/api/usuarios/${cpf}`);
  return response.data;
};

// Funcionários
export const registerFuncionario = async (data: {
  idFuncionario: string;
  nome: string;
  sobrenome: string;
  email: string;
  senha: string;
  funcao?: 'Default' | 'Veterinario' | 'Gerente' | 'Master';
  telefone?: string;
  cep?: string;
  numero?: string;
  complemento?: string;
}) => {
  const response = await api.post('/api/funcionarios/register', data);
  return response.data;
};

export const loginFuncionario = async (data: { email: string; senha: string }) => {
  const response = await api.post('/api/funcionarios/login', data);
  return response.data;
};

export const logoutFuncionario = async () => {
  const response = await api.post('/api/funcionarios/logout');
  return response.data;
};

export const getFuncionarioProfile = async () => {
  const response = await api.get('/api/funcionarios/profile');
  return response.data;
};

export const getAllFuncionarios = async () => {
  const response = await api.get('/api/funcionarios/all');
  return response.data;
};

// Produtos
export const getAllProdutos = async () => {
  const response = await api.get('/api/produtos');
  return response.data;
};

export const getProdutoById = async (id: number) => {
  const response = await api.get(`/api/produtos/${id}`);
  return response.data;
};

export const getProdutosByTipo = async (tipo: string) => {
  const response = await api.get(`/api/produtos/tipo/${tipo}`);
  return response.data;
};

export const createProduto = async (data: {
  nome: string;
  descricao?: string;
  preco: number;
  tipo?: string;
  categoria?: string;
  estoque: number;
  idLoja?: number;
}) => {
  const response = await api.post('/api/produtos', data);
  return response.data;
};

export const updateProduto = async (id: number, data: Partial<Produto>) => {
  const response = await api.put(`/api/produtos/${id}`, data);
  return response.data;
};

export const deleteProduto = async (id: number) => {
  const response = await api.delete(`/api/produtos/${id}`);
  return response.data;
};

// Pets
export const createPet = async (data: {
  nome: string;
  tipo: 'Cachorro' | 'Gato' | 'Peixe' | 'Passaro' | 'Outro';
  raca?: string;
  idade?: string;
  peso?: number;
  observacoes?: string;
}) => {
  const response = await api.post('/api/pets', data);
  return response.data;
};

export const getMyPets = async () => {
  const response = await api.get('/api/pets/my-pets');
  return response.data;
};

export const getPetsByUsuario = async () => {
  const response = await api.get('/api/pets/my-pets');
  return response.data;
};

export const getPetById = async (id: number) => {
  const response = await api.get(`/api/pets/${id}`);
  return response.data;
};

export const updatePet = async (id: number, data: Partial<Pet>) => {
  const response = await api.put(`/api/pets/${id}`, data);
  return response.data;
};

export const deletePet = async (id: number) => {
  const response = await api.delete(`/api/pets/${id}`);
  return response.data;
};

export const agendarServico = async (data: {
  petId: number;
  tipoServico: 'consulta' | 'hotel';
  data: string;
}) => {
  const response = await api.post('/api/pets/agendar', data);
  return response.data;
};

export const getAllPetsForFuncionario = async () => {
  const response = await api.get('/api/pets/funcionario/all');
  return response.data;
};

export default api;



// Agendamentos
export const getAllAgendamentos = async () => {
  const response = await api.get('/api/agendamentos');
  return response.data;
};

export const getAgendamentoById = async (id: number) => {
  const response = await api.get(`/api/agendamentos/${id}`);
  return response.data;
};

export const createAgendamento = async (data: {
  clienteCpf: string;
  petId: number;
  servicoId: number;
  data: string;
  hora: string;
  observacoes?: string;
  funcionarioId?: string;
}) => {
  const response = await api.post('/api/agendamentos', data);
  return response.data;
};

export const updateAgendamento = async (id: number, data: Partial<Agendamento>) => {
  const response = await api.put(`/api/agendamentos/${id}`, data);
  return response.data;
};

export const deleteAgendamento = async (id: number) => {
  const response = await api.delete(`/api/agendamentos/${id}`);
  return response.data;
};

export const updateStatusAgendamento = async (id: number, status: Agendamento['status']) => {
  const response = await api.patch(`/api/agendamentos/${id}/status`, { status });
  return response.data;
};

// Serviços
export const getAllServicos = async () => {
  const response = await api.get('/api/servicos');
  return response.data;
};

export const getServicoById = async (id: number) => {
  const response = await api.get(`/api/servicos/${id}`);
  return response.data;
};

export const createServico = async (data: {
  nome: string;
  descricao?: string;
  preco: number;
  duracao: number;
  categoria?: string;
}) => {
  const response = await api.post('/api/servicos', data);
  return response.data;
};

export const updateServico = async (id: number, data: Partial<Servico>) => {
  const response = await api.put(`/api/servicos/${id}`, data);
  return response.data;
};

export const deleteServico = async (id: number) => {
  const response = await api.delete(`/api/servicos/${id}`);
  return response.data;
};

