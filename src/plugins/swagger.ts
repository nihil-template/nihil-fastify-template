import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fp from 'fastify-plugin';

const API_DESCRIPTION = `
Fastify 기반 백엔드 API 템플릿 프로젝트입니다.

## 기술 스택
- **Fastify**: 고성능 웹 프레임워크
- **TypeBox**: 스키마 검증 및 타입 생성
- **Prisma**: ORM (PostgreSQL)
- **Jose**: JWT 토큰 처리
- **TypeScript**: 타입 안정성

## 인증
이 API는 JWT Bearer 토큰을 사용한 인증을 지원합니다.
인증이 필요한 엔드포인트는 \`Authorization: Bearer <token>\` 헤더를 포함해야 합니다.
`.trim();

export const swaggerPlugin = fp(async (fastify) => {
  // 1. Swagger 코어 등록 (JSON 명세 생성)
  await fastify.register(
    fastifySwagger,
    {
      openapi: {
        info: {
          title: 'Nihil Fastify Template API',
          description: API_DESCRIPTION,
          version: '0.0.1',
          contact: {
            name: 'API Support',
            email: 'support@example.com',
          },
          license: {
            name: 'MIT',
          },
        },
        servers: [
          {
            url: 'http://localhost:8000',
            description: '로컬 개발 서버',
          },
          {
            url: 'https://api.example.com',
            description: '프로덕션 서버',
          },
        ],
        tags: [
          {
            name: 'Auth',
            description: '인증 관련 API (회원가입, 로그인, 토큰 갱신 등)',
          },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
              description: 'JWT 토큰을 사용한 인증. 형식: Bearer <token>',
            },
          },
        },
      },
    }
  );

  // 2. Swagger UI 등록 (화면 그리기)
  await fastify.register(
    fastifySwaggerUi,
    {
      routePrefix: '/docs', // http://localhost:8000/docs 로 접속
      uiConfig: {
        docExpansion: 'full', // 'none'으로 하면 처음에 다 접혀서 보임
        deepLinking: true,
        filter: true, // 검색 필터 활성화
        showExtensions: true,
        showCommonExtensions: true,
      },
      staticCSP: true,
      transformStaticCSP: (header) => header,
    }
  );
});
