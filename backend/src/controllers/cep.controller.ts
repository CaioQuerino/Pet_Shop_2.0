import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export class CepController {
  async consultarCep(request: FastifyRequest<{ Params: { cep: string } }>, reply: FastifyReply) {
    const { cep } = request.params;

    // Remover caracteres não numéricos do CEP
    const cepLimpo = cep.replace(/\D/g, '');

    // Validar formato do CEP
    if (cepLimpo.length !== 8) {
      return reply.status(400).send({
        status: 'error',
        message: 'CEP deve conter 8 dígitos'
      });
    }

    try {
      // Verificar se o CEP já existe no banco de dados
      const enderecoExistente = await prisma.endereco.findUnique({
        where: { cep: cepLimpo }
      });

      if (enderecoExistente) {
        return reply.send({
          status: 'success',
          message: 'CEP encontrado no banco de dados',
          data: {
            cep: enderecoExistente.cep,
            rua: enderecoExistente.rua,
            bairro: enderecoExistente.bairro,
            cidade: enderecoExistente.cidade,
            estado: enderecoExistente.estado,
            jaExiste: true
          }
        });
      }

      // Consultar CEP na API do ViaCEP
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data: ViaCepResponse = await response.json();

      if (data.erro) {
        return reply.status(404).send({
          status: 'error',
          message: 'CEP não encontrado'
        });
      }

      // Criar novo endereço no banco de dados
      const novoEndereco = await prisma.endereco.create({
        data: {
          cep: data.cep.replace(/\D/g, ''),
          rua: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf
        }
      });

      return reply.send({
        status: 'success',
        message: 'CEP consultado e cadastrado com sucesso',
        data: {
          cep: novoEndereco.cep,
          rua: novoEndereco.rua,
          bairro: novoEndereco.bairro,
          cidade: novoEndereco.cidade,
          estado: novoEndereco.estado,
          jaExiste: false
        }
      });

    } catch (error) {
      console.error('Erro ao consultar CEP:', error);
      return reply.status(500).send({
        status: 'error',
        message: 'Erro interno do servidor ao consultar CEP'
      });
    }
  }

  async listarEnderecos(request: FastifyRequest, reply: FastifyReply) {
    try {
      const enderecos = await prisma.endereco.findMany({
        orderBy: {
          cep: 'asc'
        }
      });

      return reply.send({
        status: 'success',
        data: { enderecos }
      });
    } catch (error) {
      console.error('Erro ao listar endereços:', error);
      return reply.status(500).send({
        status: 'error',
        message: 'Erro interno do servidor ao listar endereços'
      });
    }
  }
}

