import type { UserInfo } from '@prisma/client';
import type { FastifyRequest, FastifyReply } from 'fastify';

import { CODE } from '@/code';
import { setTokenCookies } from '@/libs/cookie';
import { createSuccessResponse, createErrorResponse } from '@/libs/createResponse';
import { sanitizeUserInfo } from '@/libs/user';
import type { ResponseType } from '@/modules/common/common.schema';

import type {
  SignUpType,
  SignInType,
  RefreshTokenType,
  GetSessionType,
  ResetPasswordType,
  ChangePasswordType
} from './auth.schema';
import {
  signUp as signUpService,
  signIn as signInService,
  refreshToken as refreshTokenService,
  getSession as getSessionService,
  resetPassword as resetPasswordService,
  changePassword as changePasswordService
} from './auth.service';

// 회원가입
export async function signUp(
  req: FastifyRequest<{ Body: SignUpType }>,
  reply: FastifyReply
): Promise<ResponseType<UserInfo>> {
  try {
    const result = await signUpService(
      req.server.prisma,
      req.body
    );

    if (result.error) {
      return result as ResponseType<any>;
    }

    const {
      user,
      accessToken,
      refreshToken: newRefreshToken,
    } = result.data;

    // 토큰을 쿠키에 저장
    await setTokenCookies(
      reply,
      accessToken,
      newRefreshToken
    );

    // UserInfo 전체를 반환하되 encptPswd와 reshToken을 null로 설정
    const userResponse = sanitizeUserInfo(user);

    return createSuccessResponse(
      userResponse,
      '회원가입이 완료되었습니다.',
      CODE.CREATED
    );
  }
  catch (error) {
    const message = error instanceof Error
      ? error.message
      : '회원가입 중 오류가 발생했습니다.';
    return createErrorResponse(
      message,
      CODE.INTERNAL_SERVER_ERROR
    );
  }
}

// 로그인
export async function signIn(
  req: FastifyRequest<{ Body: SignInType }>,
  reply: FastifyReply
): Promise<ResponseType<UserInfo>> {
  try {
    const result = await signInService(
      req.server.prisma,
      req.body
    );

    if (result.error) {
      return result as ResponseType<any>;
    }

    const {
      user,
      accessToken,
      refreshToken: newRefreshToken,
    } = result.data;

    // 토큰을 쿠키에 저장
    await setTokenCookies(
      reply,
      accessToken,
      newRefreshToken
    );

    // UserInfo 전체를 반환하되 encptPswd와 reshToken을 null로 설정
    const userResponse = sanitizeUserInfo(user);

    return createSuccessResponse(
      userResponse,
      '로그인되었습니다.',
      CODE.SUCCESS
    );
  }
  catch (error) {
    const message = error instanceof Error
      ? error.message
      : '로그인 중 오류가 발생했습니다.';
    return createErrorResponse(
      message,
      CODE.INTERNAL_SERVER_ERROR
    );
  }
}

// 토큰 리프레시
export async function refreshToken(
  req: FastifyRequest<{ Body: RefreshTokenType }>,
  reply: FastifyReply
): Promise<ResponseType<null>> {
  try {
    // 쿠키에서 리프레시 토큰 가져오기
    const refreshTokenFromCookie = req.cookies.refreshToken;
    if (!refreshTokenFromCookie) {
      return createErrorResponse(
        '리프레시 토큰이 필요합니다.',
        CODE.UNAUTHORIZED
      );
    }

    const result = await refreshTokenService(
      req.server.prisma,
      { reshToken: refreshTokenFromCookie, }
    );

    if (result.error) {
      return result as ResponseType<null>;
    }

    const { accessToken, refreshToken: newRefreshToken, } = result.data;

    // 새 토큰을 쿠키에 저장
    await setTokenCookies(
      reply,
      accessToken,
      newRefreshToken
    );

    return createSuccessResponse<null>(
      null,
      '토큰이 갱신되었습니다.',
      CODE.SUCCESS
    );
  }
  catch (error) {
    const message = error instanceof Error
      ? error.message
      : '토큰 리프레시 중 오류가 발생했습니다.';
    return createErrorResponse(
      message,
      CODE.INTERNAL_SERVER_ERROR
    );
  }
}

// 현재 세션 가져오기
export async function getSession(
  req: FastifyRequest<{ Body: GetSessionType }>,
  _reply: FastifyReply
): Promise<ResponseType<UserInfo>> {
  try {
    // 쿠키에서 액세스 토큰 가져오기
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return createErrorResponse(
        '인증 토큰이 필요합니다.',
        CODE.UNAUTHORIZED
      );
    }

    const result = await getSessionService(
      req.server.prisma,
      accessToken
    );

    if (result.error) {
      return result as ResponseType<any>;
    }

    // UserInfo 전체를 반환하되 encptPswd와 reshToken을 null로 설정
    const userResponse = sanitizeUserInfo(result.data);

    return createSuccessResponse(
      userResponse,
      '세션 정보를 조회했습니다.',
      CODE.SUCCESS
    );
  }
  catch (error) {
    const message = error instanceof Error
      ? error.message
      : '세션 조회 중 오류가 발생했습니다.';
    return createErrorResponse(
      message,
      CODE.INTERNAL_SERVER_ERROR
    );
  }
}

// 비밀번호 재설정 (잊었을 때)
export async function resetPassword(
  req: FastifyRequest<{ Body: ResetPasswordType }>,
  _reply: FastifyReply
): Promise<ResponseType<UserInfo>> {
  try {
    const result = await resetPasswordService(
      req.server.prisma,
      req.body
    );

    if (result.error) {
      return result as ResponseType<any>;
    }

    // UserInfo 전체를 반환하되 encptPswd와 reshToken을 null로 설정
    const userResponse = sanitizeUserInfo(result.data);

    return createSuccessResponse(
      userResponse,
      '비밀번호가 재설정되었습니다.',
      CODE.SUCCESS
    );
  }
  catch (error) {
    const message = error instanceof Error
      ? error.message
      : '비밀번호 재설정 중 오류가 발생했습니다.';
    return createErrorResponse(
      message,
      CODE.INTERNAL_SERVER_ERROR
    );
  }
}

// 비밀번호 변경 (로그인 후)
export async function changePassword(
  req: FastifyRequest<{ Body: ChangePasswordType }>,
  _reply: FastifyReply
): Promise<ResponseType<UserInfo>> {
  try {
    // 쿠키에서 액세스 토큰 가져오기
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return createErrorResponse(
        '인증 토큰이 필요합니다.',
        CODE.UNAUTHORIZED
      );
    }

    const sessionResponse = await getSessionService(
      req.server.prisma,
      accessToken
    );

    if (sessionResponse.error || !sessionResponse.data) {
      return sessionResponse as ResponseType<any>;
    }

    const result = await changePasswordService(
      req.server.prisma,
      sessionResponse.data.userNo,
      req.body
    );

    if (result.error) {
      return result as ResponseType<any>;
    }

    // UserInfo 전체를 반환하되 encptPswd와 reshToken을 null로 설정
    const userResponse = sanitizeUserInfo(result.data);

    return createSuccessResponse(
      userResponse,
      '비밀번호가 변경되었습니다.',
      CODE.SUCCESS
    );
  }
  catch (error) {
    const message = error instanceof Error
      ? error.message
      : '비밀번호 변경 중 오류가 발생했습니다.';
    return createErrorResponse(
      message,
      CODE.INTERNAL_SERVER_ERROR
    );
  }
}
