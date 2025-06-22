import { z } from "zod";

export const createServicoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().optional(),
  preco: z.number().positive('Preço deve ser positivo'),
  duracao: z.string().optional(),
  categoria: z.enum(['Veterinario', 'Estetica', 'Hospedagem', 'Outros']),
  idFuncionario: z.string().optional()
});

export const updateServicoSchema = z.object({
  nome: z.string().min(1).optional(),
  descricao: z.string().optional(),
  preco: z.number().positive().optional(),
  duracao: z.string().optional(),
  categoria: z.enum(['Veterinario', 'Estetica', 'Hospedagem', 'Outros']).optional(),
  ativo: z.boolean().optional(),
  idFuncionario: z.string().optional()
});

export const createAgendamentoSchema = z.object({
  dataHora: z.string().transform((str) => new Date(str)),
  observacoes: z.string().optional(),
  idPet: z.number().int().positive(),
  idServico: z.number().int().positive(),
  idUsuario: z.string()
});

export type CreateServicoInput = z.infer<typeof createServicoSchema>;
export type UpdateServicoInput = z.infer<typeof updateServicoSchema>;
export type CreateAgendamentoInput = z.infer<typeof createAgendamentoSchema>;