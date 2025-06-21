import { z } from 'zod';

export const createUsuarioSchema = z.object({
  cpf: z.string().min(11, 'CPF deve ter pelo menos 11 caracteres'),
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  sobrenome: z.string().min(2, 'Sobrenome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  celular: z.string().optional(),
  cep: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
});

export const loginUsuarioSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

export const updateUsuarioSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  sobrenome: z.string().min(2, 'Sobrenome deve ter pelo menos 2 caracteres').optional(),
  email: z.string().email('Email inválido').optional(),
  celular: z.string().optional(),
  cep: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
});

export type CreateUsuarioInput = z.infer<typeof createUsuarioSchema>;
export type LoginUsuarioInput = z.infer<typeof loginUsuarioSchema>;
export type UpdateUsuarioInput = z.infer<typeof updateUsuarioSchema>;

