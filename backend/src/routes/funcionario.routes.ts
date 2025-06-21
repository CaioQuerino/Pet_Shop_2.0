import { FastifyInstance } from 'fastify';
import { FuncionarioController } from '../controllers/funcionario.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { createFuncionarioSchema, loginFuncionarioSchema, updateFuncionarioSchema } from '../schemas/funcionario.schema';

const funcionarioController = new FuncionarioController();

export async function funcionarioRoutes(fastify: FastifyInstance) {
  // Rotas públicas
  fastify.post('/register', {
    preValidation: async (request, reply) => {
      const result = createFuncionarioSchema.safeParse(request.body);
      if (!result.success) {
        return reply.status(400).send({
          status: 'error',
          message: 'Dados inválidos',
          errors: result.error.errors
        });
      }
      request.body = result.data;
    }
  }, funcionarioController.register);

  fastify.post('/login', {
    preValidation: async (request, reply) => {
      const result = loginFuncionarioSchema.safeParse(request.body);
      if (!result.success) {
        return reply.status(400).send({
          status: 'error',
          message: 'Dados inválidos',
          errors: result.error.errors
        });
      }
      request.body = result.data;
    }
  }, funcionarioController.login);

  // Rotas protegidas
  fastify.register(async function (fastify) {
    fastify.addHook('preHandler', authenticate);

    fastify.post('/logout', funcionarioController.logout);
    fastify.get('/profile', funcionarioController.getProfile);
    fastify.put('/profile', {
      preValidation: async (request, reply) => {
        const result = updateFuncionarioSchema.safeParse(request.body);
        if (!result.success) {
          return reply.status(400).send({
            status: 'error',
            message: 'Dados inválidos',
            errors: result.error.errors
          });
        }
        request.body = result.data;
      }
    }, funcionarioController.updateProfile);
    fastify.get('/all', funcionarioController.getAllFuncionarios);
  });
}

