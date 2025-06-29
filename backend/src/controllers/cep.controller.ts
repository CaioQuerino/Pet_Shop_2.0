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


    const cepLimpo = cep.replace(/\D/g, '');


    if (cepLimpo.length !== 8) {
      return reply.status(400).send({
        status: 'error',
        message: 'CEP deve conter 8 dígitos'
      });
    }

    try {

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


      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      // Verificar se a resposta é válida
      if (!this.isViaCepResponse(data)) {
        return reply.status(500).send({
          status: 'error',
          message: 'Resposta inválida da API ViaCEP'
        });
      }

      if (data.erro) {
        return reply.status(404).send({
          status: 'error',
          message: 'CEP não encontrado'
        });
      }


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

 
  private isViaCepResponse(obj: any): obj is ViaCepResponse {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'cep' in obj &&
      'logradouro' in obj &&
      'bairro' in obj &&
      'localidade' in obj &&
      'uf' in obj
    );
  }
}