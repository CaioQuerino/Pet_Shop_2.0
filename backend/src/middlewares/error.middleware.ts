import { FastifyRequest, FastifyReply } from 'fastify';
import { AppError } from '../utils/AppError';
import { ZodError } from 'zod';

export const errorHandler = async (error: Error, request: FastifyRequest, reply: FastifyReply) => {
  // Log do erro para debugging
  console.error('Error:', error);

  // Erro operacional (AppError)
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      status: 'error',
      message: error.message,
    });
  }

  // Erro de validação do Zod
  if (error instanceof ZodError) {
    const formattedErrors = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    return reply.status(400).send({
      status: 'error',
      message: 'Dados de entrada inválidos',
      errors: formattedErrors,
    });
  }

  // Erros do Prisma
  if (error.message.includes('Unique constraint failed')) {
    return reply.status(409).send({
      status: 'error',
      message: 'Registro já existe',
    });
  }

  if (error.message.includes('Foreign key constraint failed')) {
    return reply.status(404).send({
      status: 'error',
      message: 'Registro relacionado não encontrado',
    });
  }

  // Erro interno do servidor
  return reply.status(500).send({
    status: 'error',
    message: 'Erro interno do servidor',
  });
};

