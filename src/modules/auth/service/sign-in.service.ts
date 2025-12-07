import type { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

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
): Promise<SignInResponse> {
  // 사용자 조회
  const user = await findUserByEmail(
    prisma,
    data.emlAddr
  );
  if (!user) {
    throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
  }

  // 삭제된 사용자 확인
  if (user.delYn === 'Y') {
    throw new Error('삭제된 계정입니다.');
  }

  // 사용 중지된 사용자 확인
  if (user.useYn === 'N') {
    throw new Error('사용 중지된 계정입니다.');
  }

  // 비밀번호 확인
  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.encptPswd
  );
  if (!isPasswordValid) {
    throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
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

  return {
    user,
    accessToken,
    refreshToken: newRefreshToken,
  };
}
