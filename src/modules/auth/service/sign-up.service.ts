import type { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

import { CODE } from '@/code';
import { createServiceResponse } from '@/libs/createResponse';
import type { ResponseType } from '@/modules/common/common.schema';

import {
  createUser,
  findUserByEmail,
  updateRefreshToken
} from '../auth.repository';
import type { SignUpType, SignUpResponse } from '../auth.schema';

import {
  generateAccessToken,
  generateRefreshToken
} from './jwt.service';

export async function signUp(
  prisma: PrismaClient,
  data: SignUpType
): Promise<ResponseType<SignUpResponse | null>> {
  // 이메일 중복 확인
  const existingUser = await findUserByEmail(
    prisma,
    data.emlAddr
  );
  if (existingUser) {
    return createServiceResponse(
      null,
      '이미 등록된 이메일입니다.',
      true,
      CODE.CONFLICT
    );
  }

  // 사용자명 중복 확인
  const existingUserNm = await prisma.userInfo.findUnique({
    where: { userNm: data.userNm, },
  });
  if (existingUserNm) {
    return createServiceResponse(
      null,
      '이미 등록된 사용자명입니다.',
      true,
      CODE.CONFLICT
    );
  }

  // 비밀번호 암호화
  const encptPswd = await bcrypt.hash(
    data.password,
    10
  );

  // 사용자 생성
  const user = await createUser(
    prisma,
    {
      emlAddr: data.emlAddr,
      userNm: data.userNm,
      userRole: data.userRole || 'USER',
      encptPswd,
    }
  );

  // 토큰 생성
  const accessToken = await generateAccessToken({
    userNo: user.userNo,
    emlAddr: user.emlAddr,
    userRole: user.userRole,
  });
  const newRefreshToken = await generateRefreshToken({ userNo: user.userNo, });

  // 리프레시 토큰 저장
  await updateRefreshToken(
    prisma,
    user.userNo,
    newRefreshToken
  );

  return createServiceResponse(
    {
      user,
      accessToken,
      refreshToken: newRefreshToken,
    },
    '회원가입 성공',
    false,
    CODE.CREATED
  );
}
