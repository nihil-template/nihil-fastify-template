import { Type, type Static } from '@fastify/type-provider-typebox';
import type { UserInfo } from '@prisma/client';
import { UserRole } from '@prisma/client';

// 회원가입 스키마
export const signUpSchema = Type.Object({
  emlAddr: Type.String({
    description: '이메일 주소',
    examples: [ 'user@example.com', ],
    format: 'email',
  }),
  userNm: Type.String({
    description: '사용자 이름',
    examples: [
      '홍길동',
      'John Doe',
    ],
    minLength: 1,
    maxLength: 50,
  }),
  userRole: Type.Optional(Type.Enum(
    UserRole,
    {
      description: '사용자 권한',
      examples: [
        'USER',
        'ADMIN',
      ],
      default: 'USER',
    }
  )),
  password: Type.String({
    description: '비밀번호 (최소 8자 이상 권장)',
    examples: [ 'SecurePassword123!', ],
    minLength: 8,
  }),
});

// 로그인 스키마
export const signInSchema = Type.Object({
  emlAddr: Type.String({
    description: '이메일 주소',
    examples: [ 'user@example.com', ],
    format: 'email',
  }),
  password: Type.String({
    description: '비밀번호',
    examples: [ 'SecurePassword123!', ],
  }),
});

// 토큰 리프레시 스키마
export const refreshTokenSchema = Type.Object({
  reshToken: Type.String({
    description: '리프레시 토큰',
    examples: [ 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', ],
  }),
});

// 현재 세션 가져오기 스키마 (요청 본문 없음, 헤더에서 토큰 추출)
export const getSessionSchema = Type.Object({});

// 비밀번호 재설정 스키마 (잊었을 때)
export const resetPasswordSchema = Type.Object({
  emlAddr: Type.String({
    description: '이메일 주소',
    examples: [ 'user@example.com', ],
    format: 'email',
  }),
  password: Type.String({
    description: '새 비밀번호 (최소 8자 이상 권장)',
    examples: [ 'NewSecurePassword123!', ],
    minLength: 8,
  }),
});

// 비밀번호 변경 스키마 (로그인 후)
export const changePasswordSchema = Type.Object({
  currentPassword: Type.String({
    description: '현재 비밀번호',
    examples: [ 'CurrentPassword123!', ],
  }),
  newPassword: Type.String({
    description: '새 비밀번호 (최소 8자 이상 권장)',
    examples: [ 'NewSecurePassword123!', ],
    minLength: 8,
  }),
});

export type SignUpType = Static<typeof signUpSchema>;
export type SignInType = Static<typeof signInSchema>;
export type RefreshTokenType = Static<typeof refreshTokenSchema>;
export type GetSessionType = Static<typeof getSessionSchema>;
export type ResetPasswordType = Static<typeof resetPasswordSchema>;
export type ChangePasswordType = Static<typeof changePasswordSchema>;

// 응답 타입
export type SignUpResponse = {
  user: UserInfo;
  accessToken: string;
  refreshToken: string;
};

export type SignInResponse = {
  user: UserInfo;
  accessToken: string;
  refreshToken: string;
};

export type RefreshTokenResponse = {
  accessToken: string;
  refreshToken: string;
};

// 응답 스키마
export const successResponseSchema = <T extends Type.TSchema>(dataSchema: T) => Type.Object({
  success: Type.Boolean({
    description: '성공 여부',
    examples: [ true, ],
  }),
  data: dataSchema,
  error: Type.Boolean({
    description: '에러 여부',
    examples: [ false, ],
  }),
  message: Type.Optional(Type.String({
    description: '응답 메시지',
    examples: [ '요청이 성공적으로 처리되었습니다.', ],
  })),
});

export const errorResponseSchema = Type.Object({
  success: Type.Boolean({
    description: '성공 여부',
    examples: [ false, ],
  }),
  data: Type.Null({ description: '에러 시 데이터는 null', }),
  error: Type.Boolean({
    description: '에러 여부',
    examples: [ true, ],
  }),
  message: Type.String({
    description: '에러 메시지',
    examples: [ '요청 처리 중 오류가 발생했습니다.', ],
  }),
});

// null 응답 스키마
export const nullResponseSchema = Type.Null();

// UserInfo 스키마 (응답용, 민감 정보 제외)
export const userInfoResponseSchema = Type.Object({
  userNo: Type.Number({
    description: '사용자 번호',
    examples: [ 1, ],
  }),
  emlAddr: Type.String({
    description: '이메일 주소',
    examples: [ 'user@example.com', ],
  }),
  userNm: Type.String({
    description: '사용자 이름',
    examples: [ '홍길동', ],
  }),
  userRole: Type.Enum(
    UserRole,
    {
      description: '사용자 권한',
      examples: [ 'USER', ],
    }
  ),
  proflImg: Type.Union(
    [
      Type.String(),
      Type.Null(),
    ],
    {
      description: '프로필 이미지 URL',
      examples: [ 'https://example.com/profile.jpg', ],
    }
  ),
  userBiogp: Type.Union(
    [
      Type.String(),
      Type.Null(),
    ],
    {
      description: '사용자 소개',
      examples: [ '안녕하세요!', ],
    }
  ),
  useYn: Type.String({
    description: '사용 여부',
    examples: [ 'Y', ],
  }),
  delYn: Type.String({
    description: '삭제 여부',
    examples: [ 'N', ],
  }),
  lastLgnDt: Type.Union(
    [
      Type.String(),
      Type.Null(),
    ],
    {
      description: '마지막 로그인 일시',
      examples: [ '2024-01-01T00:00:00Z', ],
    }
  ),
  lastPswdChgDt: Type.Union(
    [
      Type.String(),
      Type.Null(),
    ],
    {
      description: '마지막 비밀번호 변경 일시',
      examples: [ '2024-01-01T00:00:00Z', ],
    }
  ),
  crtNo: Type.Union(
    [
      Type.Number(),
      Type.Null(),
    ],
    { description: '생성자 번호', }
  ),
  crtDt: Type.String({
    description: '생성 일시',
    examples: [ '2024-01-01T00:00:00Z', ],
  }),
  updtNo: Type.Union(
    [
      Type.Number(),
      Type.Null(),
    ],
    { description: '수정자 번호', }
  ),
  updtDt: Type.String({
    description: '수정 일시',
    examples: [ '2024-01-01T00:00:00Z', ],
  }),
  delNo: Type.Union(
    [
      Type.Number(),
      Type.Null(),
    ],
    { description: '삭제자 번호', }
  ),
  delDt: Type.Union(
    [
      Type.String(),
      Type.Null(),
    ],
    { description: '삭제 일시', }
  ),
});
