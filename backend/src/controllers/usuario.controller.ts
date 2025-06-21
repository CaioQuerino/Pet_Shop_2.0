import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import { CreateUsuarioInput, LoginUsuarioInput, UpdateUsuarioInput } from '../schemas/usuario.schema';

const prisma = new PrismaClient();

export class UsuarioController {
  async register(request: FastifyRequest<{ Body: CreateUsuarioInput }>, reply: FastifyReply) {
    const { cpf, nome, sobrenome, email, senha, celular, cep, numero, complemento } = request.body;

    // Verificar se usuário já existe
    const existingUser = await prisma.usuario.findFirst({
      where: {
        OR: [
          { cpf },
          { email }
        ]
      }
    });

    if (existingUser) {
      throw new AppError('Usuário já existe com este CPF ou email', 409);
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Criar endereço se fornecido
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

    // Criar usuário
    const user = await prisma.usuario.create({
      data: {
        cpf,
        nome,
        sobrenome,
        email,
        senha: hashedPassword,
        celular,
        cep: cep || 'Nenhum',
        numero,
        complemento,
        logado: '0',
        img: './img/UsuarioOFF.png'
      },
      select: {
        cpf: true,
        nome: true,
        sobrenome: true,
        email: true,
        celular: true,
        img: true
      }
    });

    return reply.status(201).send({
      status: 'success',
      message: 'Usuário criado com sucesso',
      data: { user }
    });
  }

  async login(request: FastifyRequest<{ Body: LoginUsuarioInput }>, reply: FastifyReply) {
    const { email, senha } = request.body;

    // Buscar usuário
    const user = await prisma.usuario.findFirst({
      where: { email }
    });

    if (!user) {
      throw new AppError('Credenciais inválidas', 401);
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(senha, user.senha!);

    if (!isPasswordValid) {
      throw new AppError('Credenciais inválidas', 401);
    }

    // Atualizar status de logado
    await prisma.usuario.update({
      where: { cpf: user.cpf },
      data: { logado: '1' }
    });

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.cpf, userType: 'usuario' },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return reply.send({
      status: 'success',
      message: 'Login realizado com sucesso',
      data: {
        user: {
          cpf: user.cpf,
          nome: user.nome,
          sobrenome: user.sobrenome,
          email: user.email,
          img: user.img
        },
        token
      }
    });
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user?.userId;

    if (userId) {
      await prisma.usuario.update({
        where: { cpf: userId },
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

    const user = await prisma.usuario.findUnique({
      where: { cpf: userId },
      select: {
        cpf: true,
        nome: true,
        sobrenome: true,
        email: true,
        celular: true,
        img: true,
        cep: true,
        numero: true,
        complemento: true,
        endereco: true,
        pets: {
          select: {
            idPet: true,
            nome: true,
            tipo: true,
            raca: true,
            idade: true,
            consulta: true,
            hotel: true
          }
        }
      }
    });

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    return reply.send({
      status: 'success',
      data: { user }
    });
  }

  async updateProfile(request: FastifyRequest<{ Body: UpdateUsuarioInput }>, reply: FastifyReply) {
    const userId = request.user?.userId;
    const updateData = request.body;

    const user = await prisma.usuario.update({
      where: { cpf: userId },
      data: updateData,
      select: {
        cpf: true,
        nome: true,
        sobrenome: true,
        email: true,
        celular: true,
        img: true,
        cep: true,
        numero: true,
        complemento: true
      }
    });

    return reply.send({
      status: 'success',
      message: 'Perfil atualizado com sucesso',
      data: { user }
    });
  }

  async getAllUsuarios(request: FastifyRequest, reply: FastifyReply) {
    const usuarios = await prisma.usuario.findMany({
      select: {
        cpf: true,
        nome: true,
        sobrenome: true,
        email: true,
        celular: true,
        cep: true,
        numero: true,
        complemento: true,
        endereco: true,
        pets: {
          select: {
            idPet: true,
            nome: true,
            tipo: true,
            raca: true,
            idade: true
          }
        }
      },
      orderBy: { cpf: 'desc' }
    });

    return reply.send({
      status: 'success',
      data: { usuarios }
    });
  }
}

