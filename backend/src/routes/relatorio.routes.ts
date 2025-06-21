import { FastifyInstance } from 'fastify';
import { RelatorioController } from '../controllers/relatorio.controller';
import { authenticate } from '../middlewares/auth.middleware';

const relatorioController = new RelatorioController();

export async function relatorioRoutes(fastify: FastifyInstance) {
  // Todas as rotas de relatório são protegidas
  fastify.register(async function (fastify) {
    fastify.addHook('preHandler', authenticate);

    // Dashboard com estatísticas gerais
    fastify.get('/dashboard', relatorioController.dashboard);
    
    // Relatório de usuários por endereço
    fastify.get('/usuarios-por-endereco', relatorioController.usuariosPorEndereco);
    
    // Relatório de pets por tipo
    fastify.get('/pets-por-tipo', relatorioController.petsPorTipo);
    
    // Relatório de produtos por tipo
    fastify.get('/produtos-por-tipo', relatorioController.produtosPorTipo);
    
    // Relatório de agendamentos
    fastify.get('/agendamentos', relatorioController.agendamentos);
  });
}

