import { FastifyInstance } from 'fastify';
import { PetController } from '../controllers/pet.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { createPetSchema, updatePetSchema, agendarServicoSchema } from '../schemas/pet.schema';

const petController = new PetController();

export async function petRoutes(fastify: FastifyInstance) {
  // Todas as rotas de pets são protegidas
  fastify.register(async function (fastify) {
    fastify.addHook('preHandler', authenticate);

    // Rotas para usuários
    fastify.post('/', {
      preValidation: async (request, reply) => {
        const result = createPetSchema.safeParse(request.body);
        if (!result.success) {
          return reply.status(400).send({
            status: 'error',
            message: 'Dados inválidos',
            errors: result.error.errors
          });
        }
        request.body = result.data;
      }
    }, petController.create);

    fastify.get('/my-pets', petController.getByUser);
    fastify.get('/:id', petController.getById);
    
    fastify.put('/:id', {
      preValidation: async (request, reply) => {
        const result = updatePetSchema.safeParse(request.body);
        if (!result.success) {
          return reply.status(400).send({
            status: 'error',
            message: 'Dados inválidos',
            errors: result.error.errors
          });
        }
        request.body = result.data;
      }
    }, petController.update);

    fastify.delete('/:id', petController.delete);

    fastify.post('/agendar', {
      preValidation: async (request, reply) => {
        const result = agendarServicoSchema.safeParse(request.body);
        if (!result.success) {
          return reply.status(400).send({
            status: 'error',
            message: 'Dados inválidos',
            errors: result.error.errors
          });
        }
        request.body = result.data;
      }
    }, petController.agendarServico);

    // Rota para funcionários visualizarem todos os pets
    fastify.get('/funcionario/all', petController.getAllForFuncionario);
  });
}

