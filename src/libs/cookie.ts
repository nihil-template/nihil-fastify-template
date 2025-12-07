import type { FastifyReply } from 'fastify';

/**
 * 액세스 토큰을 쿠키에 설정
 */
export async function setAccessTokenCookie(
  reply: FastifyReply,
  token: string
): Promise<void> {
  await reply.setCookie(
    'accessToken',
    token,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1시간
      path: '/',
    }
  );
}

/**
 * 리프레시 토큰을 쿠키에 설정
 */
export async function setRefreshTokenCookie(
  reply: FastifyReply,
  token: string
): Promise<void> {
  await reply.setCookie(
    'refreshToken',
    token,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: '/',
    }
  );
}

/**
 * 액세스 토큰과 리프레시 토큰을 모두 쿠키에 설정
 */
export async function setTokenCookies(
  reply: FastifyReply,
  accessToken: string,
  refreshToken: string
): Promise<void> {
  await setAccessTokenCookie(
    reply,
    accessToken
  );
  await setRefreshTokenCookie(
    reply,
    refreshToken
  );
}
