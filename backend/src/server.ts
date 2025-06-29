import Fastify from 'fastify';
import cors from '@fastify/cors';
import { routes } from './routes';
import { errorHandler } from './middlewares/error.middleware';

const fastify = Fastify({
  logger: true
});

async function start() {
  try {
    await fastify.register(cors, {
      origin: true, 
      methods: ["POST", "GET", "PUT", "DELETE"],
      credentials: true
    });

    await fastify.register(routes);

    fastify.setErrorHandler(errorHandler);

    const port = process.env.PORT ? parseInt(process.env.PORT) : 3333;
    await fastify.listen({ port, host: '0.0.0.0' });
    
    console.log(`🚀 Servidor rodando na porta ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();

