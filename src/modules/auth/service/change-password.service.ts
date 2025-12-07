import type { PrismaClient, UserInfo } from '@prisma/client';
import bcrypt from 'bcrypt';

import {
  findUserByUserNo,
  updatePassword
} from '../auth.repository';
import type { ChangePasswordType } from '../auth.schema';

export async function changePassword(
  prisma: PrismaClient,
  userNo: number,
  data: ChangePasswordType
): Promise<UserInfo> {
  // 사용자 조회
  const user = await findUserByUserNo(
    prisma,
    userNo
  );
  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }

  // 현재 비밀번호 확인
  const isPasswordValid = await bcrypt.compare(
    data.currentPassword,
    user.encptPswd
  );
  if (!isPasswordValid) {
    throw new Error('현재 비밀번호가 올바르지 않습니다.');
  }

  // 새 비밀번호 암호화
  const encptPswd = await bcrypt.hash(
    data.newPassword,
    10
  );

  // 비밀번호 업데이트
  return await updatePassword(
    prisma,
    userNo,
    encptPswd
  );
}
