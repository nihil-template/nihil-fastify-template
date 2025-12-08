import type { PrismaClient, UserInfo } from '@prisma/client';
import bcrypt from 'bcrypt';

import { CODE } from '@/code';
import { createServiceResponse } from '@/libs/createResponse';
import type { ResponseType } from '@/modules/common/common.schema';

import {
  findUserByUserNo,
  updatePassword
} from '../auth.repository';
import type { ChangePasswordType } from '../auth.schema';

export async function changePassword(
  prisma: PrismaClient,
  userNo: number,
  data: ChangePasswordType
): Promise<ResponseType<UserInfo | null>> {
  // 사용자 조회
  const user = await findUserByUserNo(
    prisma,
    userNo
  );
  if (!user) {
    return createServiceResponse(
      null,
      '사용자를 찾을 수 없습니다.',
      true,
      CODE.NOT_FOUND
    );
  }

  // 현재 비밀번호 확인
  const isPasswordValid = await bcrypt.compare(
    data.currentPassword,
    user.encptPswd
  );
  if (!isPasswordValid) {
    return createServiceResponse(
      null,
      '현재 비밀번호가 올바르지 않습니다.',
      true,
      CODE.UNAUTHORIZED
    );
  }

  // 새 비밀번호 암호화
  const encptPswd = await bcrypt.hash(
    data.newPassword,
    10
  );

  // 비밀번호 업데이트
  const updatedUser = await updatePassword(
    prisma,
    userNo,
    encptPswd
  );

  return createServiceResponse(
    updatedUser,
    '비밀번호 변경 성공',
    false,
    CODE.SUCCESS
  );
}
