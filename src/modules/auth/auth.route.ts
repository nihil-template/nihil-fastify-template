import type { FastifyPluginCallback } from 'fastify';

import {
  signUp,
  signIn,
  refreshToken,
  getSession,
  resetPassword,
  changePassword
} from './auth.controller';
import {
  signUpSchema,
  signInSchema,
  refreshTokenSchema,
  resetPasswordSchema,
  changePasswordSchema,
  successResponseSchema,
  errorResponseSchema,
  userInfoResponseSchema,
  nullResponseSchema
} from './auth.schema';

export const authRoute: FastifyPluginCallback = (instance, _opts, done) => {
  // 회원가입
  instance.post(
    '/signup',
    {
      schema: {
        description: '새로운 사용자를 등록합니다. 회원가입 성공 시 JWT 토큰이 쿠키에 자동으로 설정됩니다.',
        summary: '회원가입',
        tags: [ 'Auth', ],
        body: signUpSchema,
        response: {
          200: {
            description: '회원가입 성공',
            ...successResponseSchema(userInfoResponseSchema),
            examples: [
              {
                success: true,
                data: {
                  userNo: 1,
                  emlAddr: 'user@example.com',
                  userNm: '홍길동',
                  userRole: 'USER',
                  proflImg: null,
                  userBiogp: null,
                  useYn: 'Y',
                  delYn: 'N',
                  lastLgnDt: '2024-01-01T00:00:00Z',
                  lastPswdChgDt: '2024-01-01T00:00:00Z',
                  crtNo: null,
                  crtDt: '2024-01-01T00:00:00Z',
                  updtNo: null,
                  updtDt: '2024-01-01T00:00:00Z',
                  delNo: null,
                  delDt: null,
                },
                error: false,
                message: '회원가입이 완료되었습니다.',
              },
            ],
          },
          400: {
            description: '잘못된 요청',
            ...errorResponseSchema,
            examples: [
              {
                success: false,
                data: null,
                error: true,
                message: '이미 등록된 이메일 주소입니다.',
              },
            ],
          },
        },
      },
    },
    signUp
  );

  // 로그인
  instance.post(
    '/signin',
    {
      schema: {
        description: '이메일과 비밀번호로 로그인합니다. 로그인 성공 시 JWT 토큰이 쿠키에 자동으로 설정됩니다.',
        summary: '로그인',
        tags: [ 'Auth', ],
        body: signInSchema,
        response: {
          200: {
            description: '로그인 성공',
            ...successResponseSchema(userInfoResponseSchema),
            examples: [
              {
                success: true,
                data: {
                  userNo: 1,
                  emlAddr: 'user@example.com',
                  userNm: '홍길동',
                  userRole: 'USER',
                  proflImg: null,
                  userBiogp: null,
                  useYn: 'Y',
                  delYn: 'N',
                  lastLgnDt: '2024-01-01T00:00:00Z',
                  lastPswdChgDt: '2024-01-01T00:00:00Z',
                  crtNo: null,
                  crtDt: '2024-01-01T00:00:00Z',
                  updtNo: null,
                  updtDt: '2024-01-01T00:00:00Z',
                  delNo: null,
                  delDt: null,
                },
                error: false,
                message: '로그인되었습니다.',
              },
            ],
          },
          401: {
            description: '인증 실패',
            ...errorResponseSchema,
            examples: [
              {
                success: false,
                data: null,
                error: true,
                message: '이메일 또는 비밀번호가 올바르지 않습니다.',
              },
            ],
          },
        },
      },
    },
    signIn
  );

  // 토큰 리프레시
  instance.post(
    '/refresh',
    {
      schema: {
        description: '리프레시 토큰을 사용하여 새로운 액세스 토큰과 리프레시 토큰을 발급받습니다. 새 토큰은 쿠키에 자동으로 설정됩니다.',
        summary: '토큰 리프레시',
        tags: [ 'Auth', ],
        body: refreshTokenSchema,
        response: {
          200: {
            description: '토큰 갱신 성공',
            ...successResponseSchema(nullResponseSchema),
            examples: [
              {
                success: true,
                data: null,
                error: false,
                message: '토큰이 갱신되었습니다.',
              },
            ],
          },
          401: {
            description: '인증 실패',
            ...errorResponseSchema,
            examples: [
              {
                success: false,
                data: null,
                error: true,
                message: '리프레시 토큰이 유효하지 않습니다.',
              },
            ],
          },
        },
      },
    },
    refreshToken
  );

  // 현재 세션 가져오기
  instance.get(
    '/me',
    {
      schema: {
        description: '현재 로그인한 사용자의 세션 정보를 조회합니다. 쿠키의 액세스 토큰을 사용하여 인증합니다.',
        summary: '현재 세션 조회',
        tags: [ 'Auth', ],
        security: [ { bearerAuth: [], }, ],
        response: {
          200: {
            description: '세션 조회 성공',
            ...successResponseSchema(userInfoResponseSchema),
            examples: [
              {
                success: true,
                data: {
                  userNo: 1,
                  emlAddr: 'user@example.com',
                  userNm: '홍길동',
                  userRole: 'USER',
                  proflImg: null,
                  userBiogp: null,
                  useYn: 'Y',
                  delYn: 'N',
                  lastLgnDt: '2024-01-01T00:00:00Z',
                  lastPswdChgDt: '2024-01-01T00:00:00Z',
                  crtNo: null,
                  crtDt: '2024-01-01T00:00:00Z',
                  updtNo: null,
                  updtDt: '2024-01-01T00:00:00Z',
                  delNo: null,
                  delDt: null,
                },
                error: false,
                message: '세션 정보를 조회했습니다.',
              },
            ],
          },
          401: {
            description: '인증 실패',
            ...errorResponseSchema,
            examples: [
              {
                success: false,
                data: null,
                error: true,
                message: '인증 토큰이 필요합니다.',
              },
            ],
          },
        },
      },
    },
    getSession
  );

  // 비밀번호 재설정 (잊었을 때)
  instance.post(
    '/reset-password',
    {
      schema: {
        description: '비밀번호를 잊은 경우 이메일 주소로 비밀번호를 재설정합니다.',
        summary: '비밀번호 재설정',
        tags: [ 'Auth', ],
        body: resetPasswordSchema,
        response: {
          200: {
            description: '비밀번호 재설정 성공',
            ...successResponseSchema(userInfoResponseSchema),
            examples: [
              {
                success: true,
                data: {
                  userNo: 1,
                  emlAddr: 'user@example.com',
                  userNm: '홍길동',
                  userRole: 'USER',
                  proflImg: null,
                  userBiogp: null,
                  useYn: 'Y',
                  delYn: 'N',
                  lastLgnDt: '2024-01-01T00:00:00Z',
                  lastPswdChgDt: '2024-01-01T00:00:00Z',
                  crtNo: null,
                  crtDt: '2024-01-01T00:00:00Z',
                  updtNo: null,
                  updtDt: '2024-01-01T00:00:00Z',
                  delNo: null,
                  delDt: null,
                },
                error: false,
                message: '비밀번호가 재설정되었습니다.',
              },
            ],
          },
          404: {
            description: '사용자를 찾을 수 없음',
            ...errorResponseSchema,
            examples: [
              {
                success: false,
                data: null,
                error: true,
                message: '해당 이메일 주소로 등록된 사용자를 찾을 수 없습니다.',
              },
            ],
          },
        },
      },
    },
    resetPassword
  );

  // 비밀번호 변경 (로그인 후)
  instance.post(
    '/change-password',
    {
      schema: {
        description: '로그인한 사용자가 현재 비밀번호를 확인하고 새 비밀번호로 변경합니다. 쿠키의 액세스 토큰을 사용하여 인증합니다.',
        summary: '비밀번호 변경',
        tags: [ 'Auth', ],
        security: [ { bearerAuth: [], }, ],
        body: changePasswordSchema,
        response: {
          200: {
            description: '비밀번호 변경 성공',
            ...successResponseSchema(userInfoResponseSchema),
            examples: [
              {
                success: true,
                data: {
                  userNo: 1,
                  emlAddr: 'user@example.com',
                  userNm: '홍길동',
                  userRole: 'USER',
                  proflImg: null,
                  userBiogp: null,
                  useYn: 'Y',
                  delYn: 'N',
                  lastLgnDt: '2024-01-01T00:00:00Z',
                  lastPswdChgDt: '2024-01-01T00:00:00Z',
                  crtNo: null,
                  crtDt: '2024-01-01T00:00:00Z',
                  updtNo: null,
                  updtDt: '2024-01-01T00:00:00Z',
                  delNo: null,
                  delDt: null,
                },
                error: false,
                message: '비밀번호가 변경되었습니다.',
              },
            ],
          },
          401: {
            description: '인증 실패',
            ...errorResponseSchema,
            examples: [
              {
                success: false,
                data: null,
                error: true,
                message: '현재 비밀번호가 올바르지 않습니다.',
              },
            ],
          },
        },
      },
    },
    changePassword
  );

  done();
};
