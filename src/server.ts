import { buildApp } from './app';

const server = buildApp();
const PORT = 8000;

const start = async () => {
  try {
    await server.listen({
      port: PORT,
      host: '0.0.0.0',
    });

    server.log.info(`server listening on ${server.server.address()}`);
  }
  catch (error) {
    server.log.error(error);
    process.exit(1);
  }
};

void start();
