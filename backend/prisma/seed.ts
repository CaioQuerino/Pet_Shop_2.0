import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar endereços
  await prisma.endereco.upsert({
    where: { cep: '23092-620' },
    update: {},
    create: {
      cep: '23092-620',
      rua: 'Rua das Flores',
      bairro: 'Campo Grande',
      cidade: 'Rio de Janeiro',
      estado: 'RJ'
    }
  });

  await prisma.endereco.upsert({
    where: { cep: 'Nenhum' },
    update: {},
    create: {
      cep: 'Nenhum',
      rua: 'Vazio',
      bairro: 'Vazio',
      cidade: 'Vazio',
      estado: 'Vazio'
    }
  });

  // Criar funcionário master
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  await prisma.funcionario.upsert({
    where: { idFuncionario: '1' },
    update: {},
    create: {
      idFuncionario: '1',
      logado: '0',
      nome: 'Master',
      sobrenome: 'Isaque',
      telefone: '21900000000',
      funcao: 'Master',
      img: './img/UsuarioOFF.png',
      email: 'master@gmail.com',
      senha: hashedPassword,
      cep: '23092-620',
      numero: '150',
      complemento: 'Apartamento 101'
    }
  });

  // Criar loja exemplo
  await prisma.loja.create({
    data: {
      nome: 'PetShop Central',
      img: './img/loja.png',
      cep: '23092-620',
      numero: '150',
      complemento: 'Loja 1',
      idFuncionario: '1'
    }
  });

  // Criar alguns produtos exemplo
  const loja = await prisma.loja.findFirst();
  
  if (loja) {
    await prisma.produto.createMany({
      data: [
        {
          nome: 'Ração Premium para Cães',
          descricao: 'Ração super premium para cães adultos de todas as raças',
          preco: 'R$ 89,90',
          tipo: 'Cachorro',
          img: './img/imagemProdutoOFF.png',
          idLoja: loja.idLoja,
          idFuncionario: '1'
        },
        {
          nome: 'Ração Premium para Gatos',
          descricao: 'Ração super premium para gatos adultos',
          preco: 'R$ 79,90',
          tipo: 'Gato',
          img: './img/imagemProdutoOFF.png',
          idLoja: loja.idLoja,
          idFuncionario: '1'
        },
        {
          nome: 'Ração para Peixes Tropicais',
          descricao: 'Alimento completo para peixes tropicais de água doce',
          preco: 'R$ 24,90',
          tipo: 'Peixe',
          img: './img/imagemProdutoOFF.png',
          idLoja: loja.idLoja,
          idFuncionario: '1'
        }
      ]
    });
  }

  console.log('✅ Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

