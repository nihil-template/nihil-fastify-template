import type { PrismaClient } from '@prisma/client';

import { CODE } from '@/code';
import { createServiceResponse } from '@/libs/createResponse';
import type { ResponseType } from '@/modules/common/common.schema';

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
): Promise<ResponseType<RefreshTokenResponse | null>> {
  // 리프레시 토큰 검증
  const payload = await verifyRefreshToken(data.reshToken);
  if (!payload) {
    return createServiceResponse(
      null,
      '유효하지 않은 리프레시 토큰입니다.',
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

  // 저장된 리프레시 토큰과 일치하는지 확인
  if (user.reshToken !== data.reshToken) {
    return createServiceResponse(
      null,
      '유효하지 않은 리프레시 토큰입니다.',
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

  return createServiceResponse(
    {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    },
    '토큰 갱신 성공',
    false,
    CODE.SUCCESS
  );
}
