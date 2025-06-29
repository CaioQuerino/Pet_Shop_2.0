import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient, Produto, Funcionario, Loja } from '@prisma/client';
import { AppError } from '../utils/AppError';
import { CreateProdutoInput, UpdateProdutoInput } from '../schemas/produto.schema';

const prisma = new PrismaClient();

type ProdutoWithRelations = Produto & {
  funcionario: Pick<Funcionario, 'nome' | 'sobrenome'>;
  loja: Pick<Loja, 'nome'> | null;
};

export class ProdutoController {
  async create(request: FastifyRequest<{ Body: CreateProdutoInput }>, reply: FastifyReply) {
    try {
      const { nome, descricao, preco, tipo, estoque, idLoja } = request.body;
      const funcionarioId = request.user?.userId;

      if (!funcionarioId) {
        throw new AppError('Usuário não autenticado', 401);
      }

      const [funcionario, loja] = await Promise.all([
        prisma.funcionario.findUnique({
          where: { idFuncionario: funcionarioId }
        }),
        idLoja ? prisma.loja.findUnique({ where: { idLoja } }) : Promise.resolve(null)
      ]);

      if (!funcionario) {
        throw new AppError('Funcionário não encontrado', 404);
      }

      if (idLoja && !loja) {
        throw new AppError('Loja não encontrada', 404);
      }

      const produto = await prisma.produto.create({
        data: {
          nome,
          descricao,
          preco: preco, // Preço já é um number validado pelo schema
          tipo,
          estoque,
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
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Erro ao criar produto:', error);
      throw new AppError('Erro interno ao criar produto', 500);
    }
  }

  async getAll(request: FastifyRequest, reply: FastifyReply) {
    try {
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
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw new AppError('Erro interno ao buscar produtos', 500);
    }
  }

  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const produtoId = parseInt(id);

      if (isNaN(produtoId)) {
        throw new AppError('ID do produto inválido', 400);
      }

      const produto = await prisma.produto.findUnique({
        where: { idPro: produtoId },
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
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Erro ao buscar produto:', error);
      throw new AppError('Erro interno ao buscar produto', 500);
    }
  }

  async getByTipo(request: FastifyRequest<{ Params: { tipo: string } }>, reply: FastifyReply) {
    try {
      const { tipo } = request.params;
      const validTipos = ['Cachorro', 'Gato', 'Passarinho', 'Peixe', 'Outros'];

      if (!validTipos.includes(tipo)) {
        throw new AppError('Tipo de produto inválido', 400);
      }

      const produtos = await prisma.produto.findMany({
        where: { tipo },
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
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Erro ao buscar produtos por tipo:', error);
      throw new AppError('Erro interno ao buscar produtos por tipo', 500);
    }
  }

  async update(request: FastifyRequest<{ Params: { id: string }; Body: UpdateProdutoInput }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const produtoId = parseInt(id);
      const updateData = request.body;
      const funcionarioId = request.user?.userId;

      if (isNaN(produtoId)) {
        throw new AppError('ID do produto inválido', 400);
      }

      if (!funcionarioId) {
        throw new AppError('Usuário não autenticado', 401);
      }

      const [existingProduto, funcionario] = await Promise.all([
        prisma.produto.findUnique({
          where: { idPro: produtoId }
        }),
        prisma.funcionario.findUnique({
          where: { idFuncionario: funcionarioId }
        })
      ]);

      if (!existingProduto) {
        throw new AppError('Produto não encontrado', 404);
      }

      if (!funcionario) {
        throw new AppError('Funcionário não encontrado', 404);
      }

      if (existingProduto.idFuncionario !== funcionarioId && 
          funcionario.funcao !== 'Master' && 
          funcionario.funcao !== 'Gerente') {
        throw new AppError('Sem permissão para editar este produto', 403);
      }

      // No need to format price if being updated, schema already validates as number
      // if (updateData.preco) {
      //   updateData.preco = Number(updateData.preco);
      // }

      const produto = await prisma.produto.update({
        where: { idPro: produtoId },
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
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Erro ao atualizar produto:', error);
      throw new AppError('Erro interno ao atualizar produto', 500);
    }
  }

  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const produtoId = parseInt(id);
      const funcionarioId = request.user?.userId;

      if (isNaN(produtoId)) {
        throw new AppError('ID do produto inválido', 400);
      }

      if (!funcionarioId) {
        throw new AppError('Usuário não autenticado', 401);
      }

      const [existingProduto, funcionario] = await Promise.all([
        prisma.produto.findUnique({
          where: { idPro: produtoId }
        }),
        prisma.funcionario.findUnique({
          where: { idFuncionario: funcionarioId }
        })
      ]);

      if (!existingProduto) {
        throw new AppError('Produto não encontrado', 404);
      }

      if (!funcionario) {
        throw new AppError('Funcionário não encontrado', 404);
      }

      if (existingProduto.idFuncionario !== funcionarioId && 
          funcionario.funcao !== 'Master' && 
          funcionario.funcao !== 'Gerente') {
        throw new AppError('Sem permissão para excluir este produto', 403);
      }

      await prisma.produto.delete({
        where: { idPro: produtoId }
      });

      return reply.send({
        status: 'success',
        message: 'Produto excluído com sucesso'
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Erro ao excluir produto:', error);
      throw new AppError('Erro interno ao excluir produto', 500);
    }
  }
}