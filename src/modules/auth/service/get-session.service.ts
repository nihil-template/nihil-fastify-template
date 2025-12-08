import type { PrismaClient, UserInfo } from '@prisma/client';

import { CODE } from '@/code';
import { createServiceResponse } from '@/libs/createResponse';
import type { ResponseType } from '@/modules/common/common.schema';

import { findUserByUserNo } from '../auth.repository';

import { verifyAccessToken } from './jwt.service';

export async function getSession(
  prisma: PrismaClient,
  accessToken: string
): Promise<ResponseType<UserInfo | null>> {
  // 액세스 토큰 검증
  const payload = await verifyAccessToken(accessToken);
  if (!payload) {
    return createServiceResponse(
      null,
      '유효하지 않은 액세스 토큰입니다.',
      true,
      CODE.UNAUTHORIZED
    );
  }

  // 사용자 조회
  const user = await findUserByUserNo(
    prisma,
    payload.userNo
  );
  if (!user) {
    return createServiceResponse(
      null,
      '사용자를 찾을 수 없습니다.',
      true,
      CODE.NOT_FOUND
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

  return createServiceResponse(
    user,
    '세션 조회 성공',
    false,
    CODE.SUCCESS
  );
}
