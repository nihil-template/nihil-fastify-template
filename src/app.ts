import cookie from '@fastify/cookie';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import Fastify, { type FastifyInstance } from 'fastify';

import { authRoute } from '@/modules/auth/auth.route';
import { swaggerPlugin } from '@/plugins/swagger';

import { prismaPlugin } from './plugins/prisma';

export const buildApp = (): FastifyInstance => {
  const app = Fastify({
    logger: true,
  }).withTypeProvider<TypeBoxTypeProvider>();

  app.register(cookie);
  app.register(prismaPlugin);
  app.register(swaggerPlugin);

  app.register(
    authRoute,
    {
      prefix: '/auth',
    }
  );

  return app;
};
