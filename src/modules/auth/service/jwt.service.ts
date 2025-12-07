import type { UserRole } from '@prisma/client';
import { SignJWT, jwtVerify } from 'jose';

// JWT 액세스 토큰 생성
export async function generateAccessToken(payload: {
  userNo: number;
  emlAddr: string;
  userRole: UserRole;
}): Promise<string> {
  const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);
  const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '1h';

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256', })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
}

// JWT 리프레시 토큰 생성
export async function generateRefreshToken(payload: { userNo: number }): Promise<string> {
  const secret = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET);
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256', })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
}

// JWT 액세스 토큰 검증
export async function verifyAccessToken(token: string): Promise<{
  userNo: number;
  emlAddr: string;
  userRole: UserRole;
} | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);
    const { payload, } = await jwtVerify(
      token,
      secret
    );
    return payload as { userNo: number;
      emlAddr: string;
      userRole: UserRole; };
  }
  catch {
    return null;
  }
}

// JWT 리프레시 토큰 검증
export async function verifyRefreshToken(token: string): Promise<{ userNo: number } | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET);
    const { payload, } = await jwtVerify(
      token,
      secret
    );
    return payload as { userNo: number };
  }
  catch {
    return null;
  }
}
