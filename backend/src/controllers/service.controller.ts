import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/AppError';
import {
   createAgendamentoSchema, 
   createServicoSchema, 
   updateServicoSchema, 
   CreateServicoInput, 
   UpdateServicoInput, 
   CreateAgendamentoInput 
  } from '../schemas/servico.schema'
import { z } from 'zod';

const prisma = new PrismaClient();


export class ServicoController {

  async create(request: FastifyRequest<{ Body: CreateServicoInput }>, reply: FastifyReply) {
    try {
      const data = createServicoSchema.parse(request.body);

      if (data.idFuncionario) {
        const funcionario = await prisma.funcionario.findUnique({
          where: { idFuncionario: data.idFuncionario }
        });

        if (!funcionario) {
          throw new AppError('Funcionário não encontrado', 404);
        }
      }

      const servico = await prisma.servico.create({
        data,
        include: {
          funcionario: {
            select: {
              idFuncionario: true,
              nome: true,
              sobrenome: true,
              funcao: true
            }
          }
        }
      });

      return reply.status(201).send({
        success: true,
        message: 'Serviço criado com sucesso',
        data: { servico }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          message: 'Dados inválidos',
          errors: error.errors
        });
      }

      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({
          success: false,
          message: error.message
        });
      }

      console.error('Erro ao criar serviço:', error);
      return reply.status(500).send({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async getAll(request: FastifyRequest<{ Querystring: { categoria?: string; ativo?: string } }>, reply: FastifyReply) {
    try {
      const { categoria, ativo } = request.query;

      const where: any = {};
      
      if (categoria) {
        where.categoria = categoria;
      }
      
      if (ativo !== undefined) {
        where.ativo = ativo === 'true';
      }

      const servicos = await prisma.servico.findMany({
        where,
        include: {
          funcionario: {
            select: {
              idFuncionario: true,
              nome: true,
              sobrenome: true,
              funcao: true
            }
          },
          _count: {
            select: {
              agendamentos: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return reply.send({
        success: true,
        data: { servicos }
      });
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      return reply.status(500).send({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const servicoId = parseInt(id);

      if (isNaN(servicoId)) {
        throw new AppError('ID do serviço inválido', 400);
      }

      const servico = await prisma.servico.findUnique({
        where: { idServico: servicoId },
        include: {
          funcionario: {
            select: {
              idFuncionario: true,
              nome: true,
              sobrenome: true,
              funcao: true
            }
          },
          agendamentos: {
            include: {
              pet: {
                select: {
                  idPet: true,
                  nome: true,
                  tipo: true
                }
              },
              usuario: {
                select: {
                  cpf: true,
                  nome: true,
                  sobrenome: true
                }
              }
            },
            orderBy: {
              dataHora: 'desc'
            }
          }
        }
      });

      if (!servico) {
        throw new AppError('Serviço não encontrado', 404);
      }

      return reply.send({
        success: true,
        data: { servico }
      });
    } catch (error) {
      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({
          success: false,
          message: error.message
        });
      }

      console.error('Erro ao buscar serviço:', error);
      return reply.status(500).send({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async update(request: FastifyRequest<{ Params: { id: string }; Body: UpdateServicoInput }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const servicoId = parseInt(id);

      if (isNaN(servicoId)) {
        throw new AppError('ID do serviço inválido', 400);
      }

      const data = updateServicoSchema.parse(request.body);

      const servicoExistente = await prisma.servico.findUnique({
        where: { idServico: servicoId }
      });

      if (!servicoExistente) {
        throw new AppError('Serviço não encontrado', 404);
      }

      if (data.idFuncionario) {
        const funcionario = await prisma.funcionario.findUnique({
          where: { idFuncionario: data.idFuncionario }
        });

        if (!funcionario) {
          throw new AppError('Funcionário não encontrado', 404);
        }
      }

      const servico = await prisma.servico.update({
        where: { idServico: servicoId },
        data,
        include: {
          funcionario: {
            select: {
              idFuncionario: true,
              nome: true,
              sobrenome: true,
              funcao: true
            }
          }
        }
      });

      return reply.send({
        success: true,
        message: 'Serviço atualizado com sucesso',
        data: { servico }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          message: 'Dados inválidos',
          errors: error.errors
        });
      }

      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({
          success: false,
          message: error.message
        });
      }

      console.error('Erro ao atualizar serviço:', error);
      return reply.status(500).send({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const servicoId = parseInt(id);

      if (isNaN(servicoId)) {
        throw new AppError('ID do serviço inválido', 400);
      }

      const servicoExistente = await prisma.servico.findUnique({
        where: { idServico: servicoId }
      });

      if (!servicoExistente) {
        throw new AppError('Serviço não encontrado', 404);
      }

      const agendamentosAtivos = await prisma.agendamento.count({
        where: {
          idServico: servicoId,
          status: {
            in: ['Agendado', 'Confirmado', 'EmAndamento']
          }
        }
      });

      if (agendamentosAtivos > 0) {
        throw new AppError('Não é possível deletar serviço com agendamentos ativos', 400);
      }

      await prisma.servico.update({
        where: { idServico: servicoId },
        data: { ativo: false }
      });

      return reply.send({
        success: true,
        message: 'Serviço desativado com sucesso'
      });
    } catch (error) {
      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({
          success: false,
          message: error.message
        });
      }

      console.error('Erro ao deletar serviço:', error);
      return reply.status(500).send({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async createAgendamento(request: FastifyRequest<{ Body: CreateAgendamentoInput }>, reply: FastifyReply) {
    try {
      const data = createAgendamentoSchema.parse(request.body);

      const pet = await prisma.pet.findUnique({
        where: { idPet: data.idPet },
        include: { usuario: true }
      });

      if (!pet) {
        throw new AppError('Pet não encontrado', 404);
      }

      if (pet.idUsuario !== data.idUsuario) {
        throw new AppError('Pet não pertence ao usuário', 403);
      }

      const servico = await prisma.servico.findUnique({
        where: { idServico: data.idServico }
      });

      if (!servico) {
        throw new AppError('Serviço não encontrado', 404);
      }

      if (!servico.ativo) {
        throw new AppError('Serviço não está disponível', 400);
      }

      const agendamentoExistente = await prisma.agendamento.findFirst({
        where: {
          dataHora: data.dataHora,
          idServico: data.idServico,
          status: {
            in: ['Agendado', 'Confirmado', 'EmAndamento']
          }
        }
      });

      if (agendamentoExistente) {
        throw new AppError('Já existe um agendamento para este horário', 400);
      }

      const agendamento = await prisma.agendamento.create({
        data,
        include: {
          pet: {
            select: {
              idPet: true,
              nome: true,
              tipo: true,
              raca: true
            }
          },
          servico: {
            select: {
              idServico: true,
              nome: true,
              preco: true,
              duracao: true,
              categoria: true
            }
          },
          usuario: {
            select: {
              cpf: true,
              nome: true,
              sobrenome: true,
              email: true,
              celular: true
            }
          }
        }
      });

      return reply.status(201).send({
        success: true,
        message: 'Agendamento criado com sucesso',
        data: { agendamento }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          message: 'Dados inválidos',
          errors: error.errors
        });
      }

      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({
          success: false,
          message: error.message
        });
      }

      console.error('Erro ao criar agendamento:', error);
      return reply.status(500).send({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async getAgendamentos(request: FastifyRequest<{ Querystring: { usuario?: string; status?: string } }>, reply: FastifyReply) {
    try {
      const { usuario, status } = request.query;

      const where: any = {};
      
      if (usuario) {
        where.idUsuario = usuario;
      }
      
      if (status) {
        where.status = status;
      }

      const agendamentos = await prisma.agendamento.findMany({
        where,
        include: {
          pet: {
            select: {
              idPet: true,
              nome: true,
              tipo: true,
              raca: true
            }
          },
          servico: {
            select: {
              idServico: true,
              nome: true,
              preco: true,
              duracao: true,
              categoria: true
            }
          },
          usuario: {
            select: {
              cpf: true,
              nome: true,
              sobrenome: true,
              email: true,
              celular: true
            }
          }
        },
        orderBy: {
          dataHora: 'asc'
        }
      });

      return reply.send({
        success: true,
        data: { agendamentos }
      });
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      return reply.status(500).send({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async updateAgendamentoStatus(request: FastifyRequest<{ Params: { id: string }; Body: { status: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const { status } = request.body;
      const agendamentoId = parseInt(id);

      if (isNaN(agendamentoId)) {
        throw new AppError('ID do agendamento inválido', 400);
      }

      const statusValidos = ['Agendado', 'Confirmado', 'EmAndamento', 'Concluido', 'Cancelado'];
      if (!statusValidos.includes(status)) {
        throw new AppError('Status inválido', 400);
      }

      const agendamentoExistente = await prisma.agendamento.findUnique({
        where: { idAgendamento: agendamentoId }
      });

      if (!agendamentoExistente) {
        throw new AppError('Agendamento não encontrado', 404);
      }

      const agendamento = await prisma.agendamento.update({
        where: { idAgendamento: agendamentoId },
        data: { status: status as any },
        include: {
          pet: {
            select: {
              idPet: true,
              nome: true,
              tipo: true,
              raca: true
            }
          },
          servico: {
            select: {
              idServico: true,
              nome: true,
              preco: true,
              duracao: true,
              categoria: true
            }
          },
          usuario: {
            select: {
              cpf: true,
              nome: true,
              sobrenome: true,
              email: true,
              celular: true
            }
          }
        }
      });

      return reply.send({
        success: true,
        message: 'Status do agendamento atualizado com sucesso',
        data: { agendamento }
      });
    } catch (error) {
      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({
          success: false,
          message: error.message
        });
      }

      console.error('Erro ao atualizar status do agendamento:', error);
      return reply.status(500).send({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
}

