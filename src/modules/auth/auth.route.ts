import type { FastifyPluginCallback } from 'fastify';

import { CODE } from '@/code';
import { userExampleData } from '@/libs/exampleData/userExampleData';

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
  nullResponseSchema,
  oneOfResponseSchema
} from './auth.schema';

export const authRoute: FastifyPluginCallback = (instance, _opts, done) => {
  // 회원가입
  instance.post(
    '/signup',
    {
      schema: {
        description: '사용자 회원가입',
        summary: '회원가입',
        tags: [ 'Auth', ],
        body: signUpSchema,
        response: {
          200: {
            description: '회원가입 응답',
            ...oneOfResponseSchema([
              successResponseSchema(userInfoResponseSchema),
              errorResponseSchema,
            ]),
            examples: [
              {
                code: CODE.CREATED,
                data: userExampleData(),
                error: false,
                message: '회원가입이 완료되었습니다.',
              },
              {
                code: CODE.BAD_REQUEST,
                data: null,
                error: true,
                message: '이미 등록된 이메일 주소입니다.',
              },
              {
                code: CODE.CONFLICT,
                data: null,
                error: true,
                message: '이미 등록된 사용자명입니다.',
              },
              {
                code: CODE.INTERNAL_SERVER_ERROR,
                data: null,
                error: true,
                message: '회원가입 중 오류가 발생했습니다.',
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
        description: '로그인',
        summary: '로그인',
        tags: [ 'Auth', ],
        body: signInSchema,
        response: {
          200: {
            description: '로그인 응답',
            ...oneOfResponseSchema([
              successResponseSchema(userInfoResponseSchema),
              errorResponseSchema,
            ]),
            examples: [
              {
                code: CODE.SUCCESS,
                data: userExampleData(),
                error: false,
                message: '로그인되었습니다.',
              },
              {
                code: CODE.UNAUTHORIZED,
                data: null,
                error: true,
                message: '이메일 또는 비밀번호가 올바르지 않습니다.',
              },
              {
                code: CODE.FORBIDDEN,
                data: null,
                error: true,
                message: '삭제된 계정입니다.',
              },
              {
                code: CODE.INTERNAL_SERVER_ERROR,
                data: null,
                error: true,
                message: '로그인 중 오류가 발생했습니다.',
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
        description: '액세스/리프레시 토큰 재발급',
        summary: '토큰 리프레시',
        tags: [ 'Auth', ],
        body: refreshTokenSchema,
        response: {
          200: {
            description: '토큰 리프레시 응답',
            ...oneOfResponseSchema([
              successResponseSchema(nullResponseSchema),
              errorResponseSchema,
            ]),
            examples: [
              {
                code: CODE.SUCCESS,
                data: null,
                error: false,
                message: '토큰이 갱신되었습니다.',
              },
              {
                code: CODE.UNAUTHORIZED,
                data: null,
                error: true,
                message: '리프레시 토큰이 유효하지 않습니다.',
              },
              {
                code: CODE.FORBIDDEN,
                data: null,
                error: true,
                message: '사용 중지된 계정입니다.',
              },
              {
                code: CODE.INTERNAL_SERVER_ERROR,
                data: null,
                error: true,
                message: '토큰 리프레시 중 오류가 발생했습니다.',
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
        description: '내 세션 정보 조회',
        summary: '현재 세션 조회',
        tags: [ 'Auth', ],
        security: [ { bearerAuth: [], }, ],
        response: {
          200: {
            description: '세션 조회 응답',
            ...oneOfResponseSchema([
              successResponseSchema(userInfoResponseSchema),
              errorResponseSchema,
            ]),
            examples: [
              {
                code: CODE.SUCCESS,
                data: userExampleData(),
                error: false,
                message: '세션 정보를 조회했습니다.',
              },
              {
                code: CODE.UNAUTHORIZED,
                data: null,
                error: true,
                message: '인증 토큰이 필요합니다.',
              },
              {
                code: CODE.INTERNAL_SERVER_ERROR,
                data: null,
                error: true,
                message: '세션 조회 중 오류가 발생했습니다.',
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
        description: '비밀번호 재설정',
        summary: '비밀번호 재설정',
        tags: [ 'Auth', ],
        body: resetPasswordSchema,
        response: {
          200: {
            description: '비밀번호 재설정 응답',
            ...oneOfResponseSchema([
              successResponseSchema(userInfoResponseSchema),
              errorResponseSchema,
            ]),
            examples: [
              {
                code: CODE.SUCCESS,
                data: userExampleData(),
                error: false,
                message: '비밀번호가 재설정되었습니다.',
              },
              {
                code: CODE.NOT_FOUND,
                data: null,
                error: true,
                message: '해당 이메일 주소로 등록된 사용자를 찾을 수 없습니다.',
              },
              {
                code: CODE.FORBIDDEN,
                data: null,
                error: true,
                message: '삭제된 계정입니다.',
              },
              {
                code: CODE.INTERNAL_SERVER_ERROR,
                data: null,
                error: true,
                message: '비밀번호 재설정 중 오류가 발생했습니다.',
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
        description: '비밀번호 변경',
        summary: '비밀번호 변경',
        tags: [ 'Auth', ],
        security: [ { bearerAuth: [], }, ],
        body: changePasswordSchema,
        response: {
          200: {
            description: '비밀번호 변경 응답',
            ...oneOfResponseSchema([
              successResponseSchema(userInfoResponseSchema),
              errorResponseSchema,
            ]),
            examples: [
              {
                code: CODE.SUCCESS,
                data: userExampleData(),
                error: false,
                message: '비밀번호가 변경되었습니다.',
              },
              {
                code: CODE.UNAUTHORIZED,
                data: null,
                error: true,
                message: '현재 비밀번호가 올바르지 않습니다.',
              },
              {
                code: CODE.INTERNAL_SERVER_ERROR,
                data: null,
                error: true,
                message: '비밀번호 변경 중 오류가 발생했습니다.',
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
