import type { PrismaClient, UserInfo } from '@prisma/client';
import bcrypt from 'bcrypt';

import {
  findUserByEmail,
  updatePassword
} from '../auth.repository';
import type { ResetPasswordType } from '../auth.schema';

export async function resetPassword(
  prisma: PrismaClient,
  data: ResetPasswordType
): Promise<UserInfo> {
  // 사용자 조회
  const user = await findUserByEmail(
    prisma,
    data.emlAddr
  );
  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }

  // 삭제된 사용자 확인
  if (user.delYn === 'Y') {
    throw new Error('삭제된 계정입니다.');
  }

  // 비밀번호 암호화
  const encptPswd = await bcrypt.hash(
    data.password,
    10
  );

  // 비밀번호 업데이트
  return await updatePassword(
    prisma,
    user.userNo,
    encptPswd
  );
}
