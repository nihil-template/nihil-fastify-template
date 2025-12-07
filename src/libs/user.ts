import type { UserInfo } from '@prisma/client';

/**
 * UserInfo에서 민감한 정보(encptPswd, reshToken)를 null로 설정하여 반환
 */
export function sanitizeUserInfo(user: UserInfo): UserInfo {
  return {
    ...user,
    encptPswd: null as unknown as string,
    reshToken: null,
  };
}
