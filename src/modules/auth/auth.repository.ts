import type { PrismaClient, UserInfo } from '@prisma/client';
import { DateTime } from 'luxon';

import type { SignUpType, SignInType } from './auth.schema';

export async function createUser(
  prisma: PrismaClient,
  data: Omit<SignUpType, 'password'> & { encptPswd: string }
): Promise<UserInfo> {
  return await prisma.userInfo.create({
    data: {
      emlAddr: data.emlAddr,
      userNm: data.userNm,
      userRole: data.userRole || 'USER',
      encptPswd: data.encptPswd,
    },
  });
}

export async function findUserByEmail(
  prisma: PrismaClient,
  emlAddr: SignInType['emlAddr']
): Promise<UserInfo | null> {
  return await prisma.userInfo.findUnique({
    where: { emlAddr, },
  });
}

export async function findUserByUserNo(
  prisma: PrismaClient,
  userNo: number
): Promise<UserInfo | null> {
  return await prisma.userInfo.findUnique({
    where: { userNo, },
  });
}

export async function updateRefreshToken(
  prisma: PrismaClient,
  userNo: number,
  refreshToken: string | null
): Promise<UserInfo> {
  return await prisma.userInfo.update({
    where: { userNo, },
    data: {
      reshToken: refreshToken,
      updtNo: userNo,
      updtDt: DateTime.now().toUTC().toISO(),
    },
  });
}

export async function updatePassword(
  prisma: PrismaClient,
  userNo: number,
  encptPswd: string
): Promise<UserInfo> {
  return await prisma.userInfo.update({
    where: { userNo, },
    data: {
      encptPswd,
      updtNo: userNo,
      updtDt: DateTime.now().toUTC().toISO(),
    },
  });
}

export async function updateLastLoginDate(
  prisma: PrismaClient,
  userNo: number
): Promise<UserInfo> {
  const now = DateTime.now().toUTC().toISO();
  return await prisma.userInfo.update({
    where: { userNo, },
    data: {
      lastLgnDt: now,
      updtNo: userNo,
      updtDt: now,
    },
  });
}
