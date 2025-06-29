import { FastifyInstance } from 'fastify';
import { ProdutoController } from '../controllers/produto.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { createProdutoSchema, updateProdutoSchema } from '../schemas/produto.schema';

const produtoController = new ProdutoController();

export async function produtoRoutes(fastify: FastifyInstance) {
  fastify.get('/', produtoController.getAll);
  fastify.get('/:id', produtoController.getById);
  fastify.get('/tipo/:tipo', produtoController.getByTipo);

  fastify.register(async function (fastify) {
    fastify.addHook('preHandler', authenticate);

    fastify.post('/', {
      preValidation: async (request, reply) => {
        const result = createProdutoSchema.safeParse(request.body);
        if (!result.success) {
          return reply.status(400).send({
            status: 'error',
            message: 'Dados inválidos',
            errors: result.error.errors
          });
        }
        request.body = result.data;
      }
    }, produtoController.create);

    fastify.put('/:id', {
      preValidation: async (request, reply) => {
        const result = updateProdutoSchema.safeParse(request.body);
        if (!result.success) {
          return reply.status(400).send({
            status: 'error',
            message: 'Dados inválidos',
            errors: result.error.errors
          });
        }
        request.body = result.data;
      }
    }, produtoController.update);

    fastify.delete('/:id', produtoController.delete);
  });
}

