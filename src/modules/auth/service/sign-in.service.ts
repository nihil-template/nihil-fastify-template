import type { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

import { CODE } from '@/code';
import { createServiceResponse } from '@/libs/createResponse';
import type { ResponseType } from '@/modules/common/common.schema';

import {
  findUserByEmail,
  updateRefreshToken,
  updateLastLoginDate
} from '../auth.repository';
import type { SignInType, SignInResponse } from '../auth.schema';

import {
  generateAccessToken,
  generateRefreshToken
} from './jwt.service';

export async function signIn(
  prisma: PrismaClient,
  data: SignInType
): Promise<ResponseType<SignInResponse | null>> {
  // 사용자 조회
  const user = await findUserByEmail(
    prisma,
    data.emlAddr
  );
  if (!user) {
    return createServiceResponse(
      null,
      '이메일 또는 비밀번호가 올바르지 않습니다.',
      true,
      CODE.UNAUTHORIZED
    );
  }

  // 삭제된 사용자 확인
  if (user.delYn === 'Y') {
    return createServiceResponse(
      null,
      '삭제된 계정입니다.',
      true,
      CODE.FORBIDDEN
    );
  }

  // 사용 중지된 사용자 확인
  if (user.useYn === 'N') {
    return createServiceResponse(
      null,
      '사용 중지된 계정입니다.',
      true,
      CODE.FORBIDDEN
    );
  }

  // 비밀번호 확인
  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.encptPswd
  );
  if (!isPasswordValid) {
    return createServiceResponse(
      null,
      '이메일 또는 비밀번호가 올바르지 않습니다.',
      true,
      CODE.UNAUTHORIZED
    );
  }

  // 토큰 생성
  const accessToken = await generateAccessToken({
    userNo: user.userNo,
    emlAddr: user.emlAddr,
    userRole: user.userRole,
  });
  const newRefreshToken = await generateRefreshToken({ userNo: user.userNo, });

  // 리프레시 토큰 저장 및 마지막 로그인 시간 업데이트
  await updateRefreshToken(
    prisma,
    user.userNo,
    newRefreshToken
  );
  await updateLastLoginDate(
    prisma,
    user.userNo
  );

  return createServiceResponse(
    {
      user,
      accessToken,
      refreshToken: newRefreshToken,
    },
    '로그인 성공',
    false,
    CODE.SUCCESS
  );
}
