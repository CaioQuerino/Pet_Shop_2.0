import { z } from 'zod';

export const createPetSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  tipo: z.string().min(2, 'Tipo é obrigatório'),
  raca: z.string().optional(),
  idade: z.string().optional(),
  consulta: z.string().datetime().optional(),
  hotel: z.string().datetime().optional(),
});

export const updatePetSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  tipo: z.string().min(2, 'Tipo é obrigatório').optional(),
  raca: z.string().optional(),
  idade: z.string().optional(),
  consulta: z.string().datetime().optional(),
  hotel: z.string().datetime().optional(),
});

export const agendarServicoSchema = z.object({
  petId: z.number().int().positive('ID do pet deve ser um número positivo'),
  tipoServico: z.enum(['consulta', 'hotel']),
  data: z.string().datetime('Data deve estar no formato ISO'),
});

export type CreatePetInput = z.infer<typeof createPetSchema>;
export type UpdatePetInput = z.infer<typeof updatePetSchema>;
export type AgendarServicoInput = z.infer<typeof agendarServicoSchema>;

