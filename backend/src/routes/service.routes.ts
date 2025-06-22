import { FastifyInstance } from 'fastify';
import { ServicoController } from '../controllers/service.controller';

const servicoController = new ServicoController();

export async function ServiceRoutes(fastify: FastifyInstance) {
    // Rotas para serviços
    fastify.post('/servicos', servicoController.create.bind(servicoController));
    fastify.get('/servicos', servicoController.getAll.bind(servicoController));
    fastify.get('/servicos/:id', servicoController.getById.bind(servicoController));
    fastify.put('/servicos/:id', servicoController.update.bind(servicoController));
    fastify.delete('/servicos/:id', servicoController.delete.bind(servicoController));

    // Rotas para agendamentos
    fastify.post('/agendamentos', servicoController.createAgendamento.bind(servicoController));
    fastify.get('/agendamentos', servicoController.getAgendamentos.bind(servicoController));
    fastify.patch('/agendamentos/:id/status', servicoController.updateAgendamentoStatus.bind(servicoController));
}

