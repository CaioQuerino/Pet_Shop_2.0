import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';

interface JwtPayload {
  userId: string;
  userType: 'usuario' | 'funcionario';
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: JwtPayload;
  }
}

export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token de acesso requerido', 401);
  }

  const token = authHeader.replace('Bearer ', '');

  if (!token) {
    throw new AppError('Token de acesso requerido', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    request.user = decoded;
  } catch (error) {
    throw new AppError('Token inválido', 401);
  }
};

