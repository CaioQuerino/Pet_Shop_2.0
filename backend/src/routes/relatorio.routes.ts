import { FastifyInstance } from 'fastify';
import { RelatorioController } from '../controllers/relatorio.controller';
import { authenticate } from '../middlewares/auth.middleware';

const relatorioController = new RelatorioController();

export async function relatorioRoutes(fastify: FastifyInstance) {

  fastify.register(async function (fastify) {

    fastify.addHook('preHandler', authenticate);

    fastify.get('/dashboard', relatorioController.dashboard);
    
    fastify.get('/usuarios-por-endereco', relatorioController.usuariosPorEndereco);
    

    fastify.get('/pets-por-tipo', relatorioController.petsPorTipo);
    

    fastify.get('/produtos-por-tipo', relatorioController.produtosPorTipo);
    
    fastify.get('/agendamentos', relatorioController.agendamentos);
  });
}

