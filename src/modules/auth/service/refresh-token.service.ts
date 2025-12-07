import type { PrismaClient } from '@prisma/client';

import {
  findUserByUserNo,
  updateRefreshToken
} from '../auth.repository';
import type { RefreshTokenType, RefreshTokenResponse } from '../auth.schema';

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from './jwt.service';

export async function refreshToken(
  prisma: PrismaClient,
  data: RefreshTokenType
): Promise<RefreshTokenResponse> {
  // 리프레시 토큰 검증
  const payload = await verifyRefreshToken(data.reshToken);
  if (!payload) {
    throw new Error('유효하지 않은 리프레시 토큰입니다.');
  }

  // 사용자 조회
  const user = await findUserByUserNo(
    prisma,
    payload.userNo
  );
  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }

  // 저장된 리프레시 토큰과 일치하는지 확인
  if (user.reshToken !== data.reshToken) {
    throw new Error('유효하지 않은 리프레시 토큰입니다.');
  }

  // 삭제된 사용자 확인
  if (user.delYn === 'Y') {
    throw new Error('삭제된 계정입니다.');
  }

  // 사용 중지된 사용자 확인
  if (user.useYn === 'N') {
    throw new Error('사용 중지된 계정입니다.');
  }

  // 새 토큰 생성
  const newAccessToken = await generateAccessToken({
    userNo: user.userNo,
    emlAddr: user.emlAddr,
    userRole: user.userRole,
  });
  const newRefreshToken = await generateRefreshToken({ userNo: user.userNo, });

  // 새 리프레시 토큰 저장
  await updateRefreshToken(
    prisma,
    user.userNo,
    newRefreshToken
  );

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}
