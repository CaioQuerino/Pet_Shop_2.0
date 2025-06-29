import { FastifyInstance } from 'fastify';
import { CepController } from '../controllers/cep.controller';

const cepController = new CepController();

export async function cepRoutes(fastify: FastifyInstance) {
  fastify.get('/consultar/:cep', cepController.consultarCep);
  
  fastify.get('/enderecos', cepController.listarEnderecos);
}

