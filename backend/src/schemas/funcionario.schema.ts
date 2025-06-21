import { z } from 'zod';

export const createFuncionarioSchema = z.object({
  idFuncionario: z.string().min(1, 'ID do funcionário é obrigatório'),
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  sobrenome: z.string().min(2, 'Sobrenome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  funcao: z.enum(['Default', 'Veterinario', 'Gerente', 'Master']).default('Default'),
  telefone: z.string().optional(),
  cep: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
});

export const loginFuncionarioSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

export const updateFuncionarioSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  sobrenome: z.string().min(2, 'Sobrenome deve ter pelo menos 2 caracteres').optional(),
  email: z.string().email('Email inválido').optional(),
  funcao: z.enum(['Default', 'Veterinario', 'Gerente', 'Master']).optional(),
  telefone: z.string().optional(),
  cep: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
});

export type CreateFuncionarioInput = z.infer<typeof createFuncionarioSchema>;
export type LoginFuncionarioInput = z.infer<typeof loginFuncionarioSchema>;
export type UpdateFuncionarioInput = z.infer<typeof updateFuncionarioSchema>;

