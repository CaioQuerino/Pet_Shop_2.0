import { FastifyInstance } from 'fastify';
import { usuarioRoutes } from './usuario.routes';
import { funcionarioRoutes } from './funcionario.routes';
import { produtoRoutes } from './produto.routes';
import { petRoutes } from './pet.routes';

export async function routes(fastify: FastifyInstance) {
  // Rota de health check
  fastify.get('/health', async (request, reply) => {
    return { status: 'ok', message: 'PetShop API está funcionando!' };
  });

  // Registrar rotas
  fastify.register(usuarioRoutes, { prefix: '/api/usuarios' });
  fastify.register(funcionarioRoutes, { prefix: '/api/funcionarios' });
  fastify.register(produtoRoutes, { prefix: '/api/produtos' });
  fastify.register(petRoutes, { prefix: '/api/pets' });
}

