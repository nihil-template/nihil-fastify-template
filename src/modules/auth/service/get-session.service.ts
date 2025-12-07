import type { PrismaClient, UserInfo } from '@prisma/client';

import { findUserByUserNo } from '../auth.repository';

import { verifyAccessToken } from './jwt.service';

export async function getSession(
  prisma: PrismaClient,
  accessToken: string
): Promise<UserInfo> {
  // 액세스 토큰 검증
  const payload = await verifyAccessToken(accessToken);
  if (!payload) {
    throw new Error('유효하지 않은 액세스 토큰입니다.');
  }

  // 사용자 조회
  const user = await findUserByUserNo(
    prisma,
    payload.userNo
  );
  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }

  // 삭제된 사용자 확인
  if (user.delYn === 'Y') {
    throw new Error('삭제된 계정입니다.');
  }

  // 사용 중지된 사용자 확인
  if (user.useYn === 'N') {
    throw new Error('사용 중지된 계정입니다.');
  }

  return user;
}
