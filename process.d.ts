declare namespace NodeJS {
  interface ProcessEnv {
    // JWT 토큰 설정
    JWT_ACCESS_SECRET: string;
    JWT_ACCESS_EXPIRES_IN: string;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRES_IN: string;

    // 데이터베이스 설정
    DATABASE_HOST: string;
    DATABASE_PORT: string; // 실제로는 parseInt()로 숫자 변환 필요
    DATABASE_NAME: string;
    DATABASE_SCHEMA: string;
    DATABASE_USER: string;
    DATABASE_PASSWORD: string;
    DATABASE_URL: string;

    // Nodemailer 이메일 설정
    NODEMAILER_HOST: string;
    NODEMAILER_PORT: string; // 실제로는 parseInt()로 숫자 변환 필요
    NODEMAILER_SECURE: string; // 실제로는 'true'/'false' 문자열을 boolean으로 변환 필요
    NODEMAILER_AUTH_USER: string;
    NODEMAILER_AUTH_PASS: string;

    // 초기 관리자 계정 설정
    INITIAL_ADMIN_EMAIL: string;
    INITIAL_ADMIN_USERNAME: string;
    INITIAL_ADMIN_PASSWORD: string;

    // Node.js 환경
    NODE_ENV: 'development' | 'production' | 'test';
  }
}