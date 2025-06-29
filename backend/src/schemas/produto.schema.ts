import { z } from 'zod';

export const createProdutoSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  descricao: z.string().optional(),
  preco: z.number().positive("Preço deve ser um número positivo"),
  tipo: z.string().optional(),
  categoria: z.string().optional(),
  estoque: z.number().int().optional(),
  idLoja: z.number().int().positive("ID da loja deve ser um número positivo").optional(),
});

export const updateProdutoSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").optional(),
  descricao: z.string().optional(),
  preco: z.number().positive("Preço deve ser um número positivo").optional(),
  tipo: z.string().optional(),
  categoria: z.string().optional(),
  estoque: z.number().int().optional(),
  idLoja: z.number().int().positive("ID da loja deve ser um número positivo").optional(),
});

export type CreateProdutoInput = z.infer<typeof createProdutoSchema>;
export type UpdateProdutoInput = z.infer<typeof updateProdutoSchema>;

