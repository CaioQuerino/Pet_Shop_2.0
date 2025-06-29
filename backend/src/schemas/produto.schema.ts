import { z } from 'zod';

export const createProdutoSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  descricao: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  preco: z.number().positive("Preço deve ser um número positivo"),
  tipo: z.enum(["Cachorro", "Gato", "Passarinho", "Peixe", "Outros"]),
  estoque: z.number().int().optional(),
  idLoja: z.number().int().positive("ID da loja deve ser um número positivo").optional(),
});

export const updateProdutoSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").optional(),
  descricao: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres").optional(),
  preco: z.number().positive("Preço deve ser um número positivo").optional(),
  tipo: z.enum(["Cachorro", "Gato", "Passarinho", "Peixe", "Outros"]).optional(),
  estoque: z.number().int().optional(),
  idLoja: z.number().int().positive("ID da loja deve ser um número positivo").optional(),
});

export type CreateProdutoInput = z.infer<typeof createProdutoSchema>;
export type UpdateProdutoInput = z.infer<typeof updateProdutoSchema>;

