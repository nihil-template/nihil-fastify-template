import { buildApp } from './app';

const server = buildApp();
const PORT = 8000;

const start = async () => {
  try {
    await server.listen({
      port: PORT,
      host: '0.0.0.0',
    });

    const address = server.server.address();
    let addressString: string;
    if (address === null) {
      addressString = `0.0.0.0:${PORT}`;
    }
    else if (typeof address === 'string') {
      addressString = address;
    }
    else {
      addressString = `${address.address}:${address.port}`;
    }

    server.log.info(`server listening on ${addressString}`);
  }
  catch (error) {
    server.log.error(error);
    process.exit(1);
  }
};

void start();
