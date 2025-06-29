import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import { CreateFuncionarioInput, LoginFuncionarioInput, UpdateFuncionarioInput } from '../schemas/funcionario.schema';

const prisma = new PrismaClient();

export class FuncionarioController {
  async register(request: FastifyRequest<{ Body: CreateFuncionarioInput }>, reply: FastifyReply) {
    const { idFuncionario, nome, sobrenome, email, senha, funcao, telefone, cep, numero, complemento } = request.body;

    // Verificar se funcionário já existe
    const existingFuncionario = await prisma.funcionario.findFirst({
      where: {
        OR: [
          { idFuncionario },
          { email }
        ]
      }
    });

    if (existingFuncionario) {
      throw new AppError('Funcionário já existe com este ID ou email', 409);
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    if (cep && cep !== 'Nenhum') {
      await prisma.endereco.upsert({
        where: { cep },
        update: {},
        create: {
          cep,
          rua: '',
          bairro: '',
          cidade: '',
          estado: ''
        }
      });
    }

    const funcionario = await prisma.funcionario.create({
      data: {
        idFuncionario,
        nome,
        sobrenome,
        email,
        senha: hashedPassword,
        funcao,
        telefone,
        cep: cep || 'Nenhum',
        numero,
        complemento,
        logado: '0',
        img: './img/UsuarioOFF.png'
      },
      select: {
        idFuncionario: true,
        nome: true,
        sobrenome: true,
        email: true,
        funcao: true,
        telefone: true,
        img: true
      }
    });

    return reply.status(201).send({
      status: 'success',
      message: 'Funcionário criado com sucesso',
      data: { funcionario }
    });
  }

  async login(request: FastifyRequest<{ Body: LoginFuncionarioInput }>, reply: FastifyReply) {
    const { email, senha } = request.body;

    const funcionario = await prisma.funcionario.findFirst({
      where: { email }
    });

    if (!funcionario) {
      throw new AppError('Credenciais inválidas', 401);
    }

    const isPasswordValid = await bcrypt.compare(senha, funcionario.senha!);

    if (!isPasswordValid) {
      throw new AppError('Credenciais inválidas', 401);
    }

    await prisma.funcionario.update({
      where: { idFuncionario: funcionario.idFuncionario },
      data: { logado: '1' }
    });

    const token = jwt.sign(
      { userId: funcionario.idFuncionario, userType: 'funcionario' },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return reply.send({
      status: 'success',
      message: 'Login realizado com sucesso',
      data: {
        funcionario: {
          idFuncionario: funcionario.idFuncionario,
          nome: funcionario.nome,
          sobrenome: funcionario.sobrenome,
          email: funcionario.email,
          funcao: funcionario.funcao,
          img: funcionario.img
        },
        token
      }
    });
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user?.userId;

    if (userId) {
      await prisma.funcionario.update({
        where: { idFuncionario: userId },
        data: { logado: '0' }
      });
    }

    return reply.send({
      status: 'success',
      message: 'Logout realizado com sucesso'
    });
  }

  async getProfile(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user?.userId;

    const funcionario = await prisma.funcionario.findUnique({
      where: { idFuncionario: userId },
      select: {
        idFuncionario: true,
        nome: true,
        sobrenome: true,
        email: true,
        funcao: true,
        telefone: true,
        img: true,
        cep: true,
        numero: true,
        complemento: true,
        endereco: true
      }
    });

    if (!funcionario) {
      throw new AppError('Funcionário não encontrado', 404);
    }

    return reply.send({
      status: 'success',
      data: { funcionario }
    });
  }

  async updateProfile(request: FastifyRequest<{ Body: UpdateFuncionarioInput }>, reply: FastifyReply) {
    const userId = request.user?.userId;
    const updateData = request.body;

    const funcionario = await prisma.funcionario.update({
      where: { idFuncionario: userId },
      data: updateData,
      select: {
        idFuncionario: true,
        nome: true,
        sobrenome: true,
        email: true,
        funcao: true,
        telefone: true,
        img: true,
        cep: true,
        numero: true,
        complemento: true
      }
    });

    return reply.send({
      status: 'success',
      message: 'Perfil atualizado com sucesso',
      data: { funcionario }
    });
  }

  async getAllFuncionarios(request: FastifyRequest, reply: FastifyReply) {
    const funcionarios = await prisma.funcionario.findMany({
      select: {
        idFuncionario: true,
        nome: true,
        sobrenome: true,
        email: true,
        funcao: true,
        telefone: true,
        img: true
      }
    });

    return reply.send({
      status: 'success',
      data: { funcionarios }
    });
  }
}

