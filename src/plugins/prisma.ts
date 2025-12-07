import { PrismaClient } from '@prisma/client';
import { type FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const prisma: PrismaClient = new PrismaClient();

declare module 'fastify' {
  interface FastifyInstance {
    prisma: typeof prisma;
  }
}

const prismaPluginCallback: FastifyPluginAsync = async (instance) => {
  try {
    await prisma.$connect();
    instance.log.info('프리즈마가 연결되었습니다.');
  }
  catch (error: unknown) {
    instance.log.error(error instanceof Error
      ? error
      : new Error('프리즈마 연결중 문제가 발생했습니다.'));
  }

  instance.decorate(
    'prisma',
    prisma
  );

  instance.addHook(
    'onClose',
    async (fastify) => {
      await fastify.prisma.$disconnect();
      fastify.log.info('프리즈마 연결이 해제되었습니다.');
    }
  );
};

export const prismaPlugin = fp(
  prismaPluginCallback,
  {
    name: 'prisma-plugin',
  }
);
