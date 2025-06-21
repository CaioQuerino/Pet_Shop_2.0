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
}

export interface Funcionario {
  idFuncionario: string;
  nome: string;
  sobrenome: string;
  email: string;
  funcao: 'Default' | 'Veterinario' | 'Gerente' | 'Master';
  telefone?: string;
  img?: string;
}

export interface Produto {
  idPro: number;
  nome: string;
  descricao: string;
  preco: string;
  img?: string;
  tipo: 'Cachorro' | 'Gato' | 'Passarinho' | 'Peixe' | 'Outros';
  funcionario?: {
    nome: string;
    sobrenome: string;
  };
  loja?: {
    nome: string;
  };
}

export interface Pet {
  idPet: number;
  nome: string;
  especie: 'Cachorro' | 'Gato' | 'Peixe' | 'Passaro' | 'Outro';
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
  descricao: string;
  preco: string;
  tipo: 'Cachorro' | 'Gato' | 'Passarinho' | 'Peixe' | 'Outros';
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

