import type { PrismaClient, UserInfo } from '@prisma/client';
import bcrypt from 'bcrypt';

import { CODE } from '@/code';
import { createServiceResponse } from '@/libs/createResponse';
import type { ResponseType } from '@/modules/common/common.schema';

import {
  findUserByEmail,
  updatePassword
} from '../auth.repository';
import type { ResetPasswordType } from '../auth.schema';

export async function resetPassword(
  prisma: PrismaClient,
  data: ResetPasswordType
): Promise<ResponseType<UserInfo | null>> {
  // 사용자 조회
  const user = await findUserByEmail(
    prisma,
    data.emlAddr
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

  // 비밀번호 암호화
  const encptPswd = await bcrypt.hash(
    data.password,
    10
  );

  // 비밀번호 업데이트
  const updatedUser = await updatePassword(
    prisma,
    user.userNo,
    encptPswd
  );

  return createServiceResponse(
    updatedUser,
    '비밀번호 재설정 성공',
    false,
    CODE.SUCCESS
  );
}
