import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/AppError';
import { CreatePetInput, UpdatePetInput, AgendarServicoInput } from '../schemas/pet.schema';

const prisma = new PrismaClient();

export class PetController {
  async create(request: FastifyRequest<{ Body: CreatePetInput }>, reply: FastifyReply) {
    const { nome, tipo, raca, idade, consulta, hotel } = request.body;
    const usuarioId = request.user?.userId;

    const usuario = await prisma.usuario.findUnique({
      where: { cpf: usuarioId }
    });

    if (!usuario) {
      throw new AppError('Usuário não encontrado', 404);
    }

    const pet = await prisma.pet.create({
      data: {
        nome,
        tipo,
        raca,
        idade,
        consulta: consulta ? new Date(consulta) : null,
        hotel: hotel ? new Date(hotel) : null,
        idUsuario: usuarioId!
      },
      include: {
        usuario: {
          select: {
            nome: true,
            sobrenome: true,
            email: true
          }
        }
      }
    });

    return reply.status(201).send({
      status: 'success',
      message: 'Pet cadastrado com sucesso',
      data: { pet }
    });
  }

  async getByUser(request: FastifyRequest, reply: FastifyReply) {
    const usuarioId = request.user?.userId;

    const pets = await prisma.pet.findMany({
      where: { idUsuario: usuarioId },
      orderBy: { idPet: 'desc' }
    });

    return reply.send({
      status: 'success',
      data: { pets }
    });
  }

  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const usuarioId = request.user?.userId;

    const pet = await prisma.pet.findFirst({
      where: { 
        idPet: parseInt(id),
        idUsuario: usuarioId
      },
      include: {
        usuario: {
          select: {
            nome: true,
            sobrenome: true,
            email: true
          }
        }
      }
    });

    if (!pet) {
      throw new AppError('Pet não encontrado', 404);
    }

    return reply.send({
      status: 'success',
      data: { pet }
    });
  }

  async update(request: FastifyRequest<{ Params: { id: string }; Body: UpdatePetInput }>, reply: FastifyReply) {
    const { id } = request.params;
    const updateData = request.body;
    const usuarioId = request.user?.userId;

    const existingPet = await prisma.pet.findFirst({
      where: { 
        idPet: parseInt(id),
        idUsuario: usuarioId
      }
    });

    if (!existingPet) {
      throw new AppError('Pet não encontrado', 404);
    }

    const dataToUpdate: any = { ...updateData };
    if (updateData.consulta) {
      dataToUpdate.consulta = new Date(updateData.consulta);
    }
    if (updateData.hotel) {
      dataToUpdate.hotel = new Date(updateData.hotel);
    }

    const pet = await prisma.pet.update({
      where: { idPet: parseInt(id) },
      data: dataToUpdate,
      include: {
        usuario: {
          select: {
            nome: true,
            sobrenome: true,
            email: true
          }
        }
      }
    });

    return reply.send({
      status: 'success',
      message: 'Pet atualizado com sucesso',
      data: { pet }
    });
  }

  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const usuarioId = request.user?.userId;

    const existingPet = await prisma.pet.findFirst({
      where: { 
        idPet: parseInt(id),
        idUsuario: usuarioId
      }
    });

    if (!existingPet) {
      throw new AppError('Pet não encontrado', 404);
    }

    await prisma.pet.delete({
      where: { idPet: parseInt(id) }
    });

    return reply.send({
      status: 'success',
      message: 'Pet excluído com sucesso'
    });
  }

  async agendarServico(request: FastifyRequest<{ Body: AgendarServicoInput }>, reply: FastifyReply) {
    const { petId, tipoServico, data } = request.body;
    const usuarioId = request.user?.userId;

    const pet = await prisma.pet.findFirst({
      where: { 
        idPet: petId,
        idUsuario: usuarioId
      }
    });

    if (!pet) {
      throw new AppError('Pet não encontrado', 404);
    }

    const updateData: any = {};
    if (tipoServico === 'consulta') {
      updateData.consulta = new Date(data);
    } else if (tipoServico === 'hotel') {
      updateData.hotel = new Date(data);
    }

    const updatedPet = await prisma.pet.update({
      where: { idPet: petId },
      data: updateData,
      include: {
        usuario: {
          select: {
            nome: true,
            sobrenome: true,
            email: true
          }
        }
      }
    });

    return reply.send({
      status: 'success',
      message: `${tipoServico === 'consulta' ? 'Consulta' : 'Hotel'} agendado com sucesso`,
      data: { pet: updatedPet }
    });
  }

  async getAllForFuncionario(request: FastifyRequest, reply: FastifyReply) {
    const funcionarioId = request.user?.userId;

    const funcionario = await prisma.funcionario.findUnique({
      where: { idFuncionario: funcionarioId }
    });

    if (!funcionario) {
      throw new AppError('Acesso negado', 403);
    }

    const pets = await prisma.pet.findMany({
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
      orderBy: { idPet: 'desc' }
    });

    return reply.send({
      status: 'success',
      data: { pets }
    });
  }
}

