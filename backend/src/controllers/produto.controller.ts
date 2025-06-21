import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/AppError';
import { CreateProdutoInput, UpdateProdutoInput } from '../schemas/produto.schema';

const prisma = new PrismaClient();

export class ProdutoController {
  async create(request: FastifyRequest<{ Body: CreateProdutoInput }>, reply: FastifyReply) {
    const { nome, descricao, preco, tipo, idLoja } = request.body;
    const funcionarioId = request.user?.userId;

    // Verificar se o funcionário existe
    const funcionario = await prisma.funcionario.findUnique({
      where: { idFuncionario: funcionarioId }
    });

    if (!funcionario) {
      throw new AppError('Funcionário não encontrado', 404);
    }

    // Verificar se a loja existe (se fornecida)
    if (idLoja) {
      const loja = await prisma.loja.findUnique({
        where: { idLoja }
      });

      if (!loja) {
        throw new AppError('Loja não encontrada', 404);
      }
    }

    const produto = await prisma.produto.create({
      data: {
        nome,
        descricao,
        preco,
        tipo,
        idLoja,
        idFuncionario: funcionarioId,
        img: './img/imagemProdutoOFF.png'
      },
      include: {
        funcionario: {
          select: {
            nome: true,
            sobrenome: true
          }
        },
        loja: {
          select: {
            nome: true
          }
        }
      }
    });

    return reply.status(201).send({
      status: 'success',
      message: 'Produto criado com sucesso',
      data: { produto }
    });
  }

  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const produtos = await prisma.produto.findMany({
      include: {
        funcionario: {
          select: {
            nome: true,
            sobrenome: true
          }
        },
        loja: {
          select: {
            nome: true
          }
        }
      },
      orderBy: {
        idPro: 'desc'
      }
    });

    return reply.send({
      status: 'success',
      data: { produtos }
    });
  }

  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;

    const produto = await prisma.produto.findUnique({
      where: { idPro: parseInt(id) },
      include: {
        funcionario: {
          select: {
            nome: true,
            sobrenome: true
          }
        },
        loja: {
          select: {
            nome: true
          }
        }
      }
    });

    if (!produto) {
      throw new AppError('Produto não encontrado', 404);
    }

    return reply.send({
      status: 'success',
      data: { produto }
    });
  }

  async getByTipo(request: FastifyRequest<{ Params: { tipo: string } }>, reply: FastifyReply) {
    const { tipo } = request.params;

    const produtos = await prisma.produto.findMany({
      where: { tipo: tipo as any },
      include: {
        funcionario: {
          select: {
            nome: true,
            sobrenome: true
          }
        },
        loja: {
          select: {
            nome: true
          }
        }
      },
      orderBy: {
        idPro: 'desc'
      }
    });

    return reply.send({
      status: 'success',
      data: { produtos }
    });
  }

  async update(request: FastifyRequest<{ Params: { id: string }; Body: UpdateProdutoInput }>, reply: FastifyReply) {
    const { id } = request.params;
    const updateData = request.body;
    const funcionarioId = request.user?.userId;

    // Verificar se o produto existe
    const existingProduto = await prisma.produto.findUnique({
      where: { idPro: parseInt(id) }
    });

    if (!existingProduto) {
      throw new AppError('Produto não encontrado', 404);
    }

    // Verificar se o funcionário é o criador do produto ou tem permissão
    const funcionario = await prisma.funcionario.findUnique({
      where: { idFuncionario: funcionarioId }
    });

    if (!funcionario) {
      throw new AppError('Funcionário não encontrado', 404);
    }

    // Permitir edição se for o criador ou se for Master/Gerente
    if (existingProduto.idFuncionario !== funcionarioId && 
        funcionario.funcao !== 'Master' && 
        funcionario.funcao !== 'Gerente') {
      throw new AppError('Sem permissão para editar este produto', 403);
    }

    const produto = await prisma.produto.update({
      where: { idPro: parseInt(id) },
      data: updateData,
      include: {
        funcionario: {
          select: {
            nome: true,
            sobrenome: true
          }
        },
        loja: {
          select: {
            nome: true
          }
        }
      }
    });

    return reply.send({
      status: 'success',
      message: 'Produto atualizado com sucesso',
      data: { produto }
    });
  }

  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const funcionarioId = request.user?.userId;

    // Verificar se o produto existe
    const existingProduto = await prisma.produto.findUnique({
      where: { idPro: parseInt(id) }
    });

    if (!existingProduto) {
      throw new AppError('Produto não encontrado', 404);
    }

    // Verificar se o funcionário é o criador do produto ou tem permissão
    const funcionario = await prisma.funcionario.findUnique({
      where: { idFuncionario: funcionarioId }
    });

    if (!funcionario) {
      throw new AppError('Funcionário não encontrado', 404);
    }

    // Permitir exclusão se for o criador ou se for Master/Gerente
    if (existingProduto.idFuncionario !== funcionarioId && 
        funcionario.funcao !== 'Master' && 
        funcionario.funcao !== 'Gerente') {
      throw new AppError('Sem permissão para excluir este produto', 403);
    }

    await prisma.produto.delete({
      where: { idPro: parseInt(id) }
    });

    return reply.send({
      status: 'success',
      message: 'Produto excluído com sucesso'
    });
  }
}

