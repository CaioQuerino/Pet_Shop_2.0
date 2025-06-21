import { z } from 'zod';

export const createProdutoSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  descricao: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  preco: z.string().min(1, 'Preço é obrigatório'),
  tipo: z.enum(['Cachorro', 'Gato', 'Passarinho', 'Peixe', 'Outros']),
  idLoja: z.number().int().positive('ID da loja deve ser um número positivo').optional(),
});

export const updateProdutoSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  descricao: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres').optional(),
  preco: z.string().min(1, 'Preço é obrigatório').optional(),
  tipo: z.enum(['Cachorro', 'Gato', 'Passarinho', 'Peixe', 'Outros']).optional(),
  idLoja: z.number().int().positive('ID da loja deve ser um número positivo').optional(),
});

export type CreateProdutoInput = z.infer<typeof createProdutoSchema>;
export type UpdateProdutoInput = z.infer<typeof updateProdutoSchema>;

