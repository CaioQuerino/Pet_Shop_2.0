import { FastifyInstance } from 'fastify';
import { CepController } from '../controllers/cep.controller';

const cepController = new CepController();

export async function cepRoutes(fastify: FastifyInstance) {
  // Rota para consultar CEP
  fastify.get('/consultar/:cep', cepController.consultarCep);
  
  // Rota para listar todos os endereços cadastrados
  fastify.get('/enderecos', cepController.listarEnderecos);
}

