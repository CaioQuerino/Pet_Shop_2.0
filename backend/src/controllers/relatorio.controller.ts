import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/AppError';

const prisma = new PrismaClient();

export class RelatorioController {
  // Relatório de usuários por endereço
  async usuariosPorEndereco(request: FastifyRequest, reply: FastifyReply) {
    const funcionarioId = request.user?.userId;

    // Verificar se é funcionário
    const funcionario = await prisma.funcionario.findUnique({
      where: { idFuncionario: funcionarioId }
    });

    if (!funcionario) {
      throw new AppError('Acesso negado', 403);
    }

    const relatorio = await prisma.endereco.findMany({
      include: {
        usuarios: {
          select: {
            cpf: true,
            nome: true,
            sobrenome: true,
            email: true,
            celular: true,
            numero: true,
            complemento: true
          }
        },
        funcionarios: {
          select: {
            idFuncionario: true,
            nome: true,
            sobrenome: true,
            email: true,
            telefone: true,
            funcao: true
          }
        },
        _count: {
          select: {
            usuarios: true,
            funcionarios: true
          }
        }
      },
      orderBy: {
        cidade: 'asc'
      }
    });

    return reply.send({
      status: 'success',
      data: { relatorio }
    });
  }

  // Relatório de pets por tipo
  async petsPorTipo(request: FastifyRequest, reply: FastifyReply) {
    const funcionarioId = request.user?.userId;

    // Verificar se é funcionário
    const funcionario = await prisma.funcionario.findUnique({
      where: { idFuncionario: funcionarioId }
    });

    if (!funcionario) {
      throw new AppError('Acesso negado', 403);
    }

    const relatorio = await prisma.pet.groupBy({
      by: ['tipo'],
      _count: {
        tipo: true
      },
      orderBy: {
        _count: {
          tipo: 'desc'
        }
      }
    });

    // Buscar detalhes dos pets por tipo
    const detalhes = await Promise.all(
      relatorio.map(async (item) => {
        const pets = await prisma.pet.findMany({
          where: { tipo: item.tipo },
          include: {
            usuario: {
              select: {
                nome: true,
                sobrenome: true,
                email: true,
                celular: true
              }
            }
          },
          orderBy: { nome: 'asc' }
        });

        return {
          tipo: item.tipo,
          quantidade: item._count.tipo,
          pets
        };
      })
    );

    return reply.send({
      status: 'success',
      data: { relatorio: detalhes }
    });
  }

  // Relatório de produtos por tipo
  async produtosPorTipo(request: FastifyRequest, reply: FastifyReply) {
    const funcionarioId = request.user?.userId;

    // Verificar se é funcionário
    const funcionario = await prisma.funcionario.findUnique({
      where: { idFuncionario: funcionarioId }
    });

    if (!funcionario) {
      throw new AppError('Acesso negado', 403);
    }

    const relatorio = await prisma.produto.groupBy({
      by: ['tipo'],
      _count: {
        tipo: true
      },
      orderBy: {
        _count: {
          tipo: 'desc'
        }
      }
    });

    // Buscar detalhes dos produtos por tipo
    const detalhes = await Promise.all(
      relatorio.map(async (item) => {
        const produtos = await prisma.produto.findMany({
          where: { tipo: item.tipo },
          include: {
            funcionario: {
              select: {
                nome: true,
                sobrenome: true,
                funcao: true
              }
            },
            loja: {
              select: {
                nome: true
              }
            }
          },
          orderBy: { nome: 'asc' }
        });

        return {
          tipo: item.tipo,
          quantidade: item._count.tipo,
          produtos
        };
      })
    );

    return reply.send({
      status: 'success',
      data: { relatorio: detalhes }
    });
  }

  // Relatório de agendamentos
  async agendamentos(request: FastifyRequest, reply: FastifyReply) {
    const funcionarioId = request.user?.userId;

    // Verificar se é funcionário
    const funcionario = await prisma.funcionario.findUnique({
      where: { idFuncionario: funcionarioId }
    });

    if (!funcionario) {
      throw new AppError('Acesso negado', 403);
    }

    const hoje = new Date();
    const proximoMes = new Date();
    proximoMes.setMonth(hoje.getMonth() + 1);

    // Consultas agendadas
    const consultas = await prisma.pet.findMany({
      where: {
        consulta: {
          gte: hoje,
          lte: proximoMes
        }
      },
      include: {
        usuario: {
          select: {
            nome: true,
            sobrenome: true,
            email: true,
            celular: true
          }
        }
      },
      orderBy: { consulta: 'asc' }
    });

    // Hotel agendado
    const hotel = await prisma.pet.findMany({
      where: {
        hotel: {
          gte: hoje,
          lte: proximoMes
        }
      },
      include: {
        usuario: {
          select: {
            nome: true,
            sobrenome: true,
            email: true,
            celular: true
          }
        }
      },
      orderBy: { hotel: 'asc' }
    });

    return reply.send({
      status: 'success',
      data: {
        consultas,
        hotel,
        periodo: {
          inicio: hoje.toISOString().split('T')[0],
          fim: proximoMes.toISOString().split('T')[0]
        }
      }
    });
  }

  // Dashboard com estatísticas gerais
  async dashboard(request: FastifyRequest, reply: FastifyReply) {
    const funcionarioId = request.user?.userId;

    // Verificar se é funcionário
    const funcionario = await prisma.funcionario.findUnique({
      where: { idFuncionario: funcionarioId }
    });

    if (!funcionario) {
      throw new AppError('Acesso negado', 403);
    }

    // Contar totais
    const totalUsuarios = await prisma.usuario.count();
    const totalPets = await prisma.pet.count();
    const totalProdutos = await prisma.produto.count();
    const totalFuncionarios = await prisma.funcionario.count();
    const totalEnderecos = await prisma.endereco.count();

    // Usuários logados
    const usuariosLogados = await prisma.usuario.count({
      where: { logado: '1' }
    });

    // Funcionários logados
    const funcionariosLogados = await prisma.funcionario.count({
      where: { logado: '1' }
    });

    // Agendamentos próximos (próximos 7 dias)
    const proximaSemana = new Date();
    proximaSemana.setDate(proximaSemana.getDate() + 7);

    const consultasProximas = await prisma.pet.count({
      where: {
        consulta: {
          gte: new Date(),
          lte: proximaSemana
        }
      }
    });

    const hotelProximo = await prisma.pet.count({
      where: {
        hotel: {
          gte: new Date(),
          lte: proximaSemana
        }
      }
    });

    return reply.send({
      status: 'success',
      data: {
        totais: {
          usuarios: totalUsuarios,
          pets: totalPets,
          produtos: totalProdutos,
          funcionarios: totalFuncionarios,
          enderecos: totalEnderecos
        },
        logados: {
          usuarios: usuariosLogados,
          funcionarios: funcionariosLogados
        },
        agendamentosProximos: {
          consultas: consultasProximas,
          hotel: hotelProximo
        }
      }
    });
  }
}

