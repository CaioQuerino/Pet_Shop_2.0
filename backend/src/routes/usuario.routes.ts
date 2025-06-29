import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { UsuarioController } from '../controllers/usuario.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { createUsuarioSchema, loginUsuarioSchema, updateUsuarioSchema } from '../schemas/usuario.schema';

const usuarioController = new UsuarioController();

export async function usuarioRoutes(fastify: FastifyInstance) {

  fastify.post('/register', {
    preValidation: async (request, reply) => {
      const result = createUsuarioSchema.safeParse(request.body);
      if (!result.success) {
        return reply.status(400).send({
          status: 'error',
          message: 'Dados inválidos',
          errors: result.error.errors
        });
      }
      request.body = result.data;
    }
  }, usuarioController.register);

  fastify.post('/login', {
    preValidation: async (request, reply) => {
      const result = loginUsuarioSchema.safeParse(request.body);
      if (!result.success) {
        return reply.status(400).send({
          status: 'error',
          message: 'Dados inválidos',
          errors: result.error.errors
        });
      }
      request.body = result.data;
    }
  }, usuarioController.login);


  fastify.register(async function (fastify) {
    fastify.addHook('preHandler', authenticate);

    fastify.post('/logout', usuarioController.logout);
    fastify.get('/profile', usuarioController.getProfile);
    fastify.put('/profile', {
      preValidation: async (request, reply) => {
        const result = updateUsuarioSchema.safeParse(request.body);
        if (!result.success) {
          return reply.status(400).send({
            status: 'error',
            message: 'Dados inválidos',
            errors: result.error.errors
          });
        }
        request.body = result.data;
      }
    }, usuarioController.updateProfile);
    fastify.get('/all', usuarioController.getAllUsuarios);
  });
}

