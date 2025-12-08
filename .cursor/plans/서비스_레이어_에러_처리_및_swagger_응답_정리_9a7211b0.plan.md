---
name: 서비스 레이어 에러 처리 및 Swagger 응답 정리
overview: 서비스 레이어에서 throw 대신 createServiceResponse로 응답 객체를 리턴하도록 변경하고, 모든 응답을 200으로 통일하며 Swagger에서 여러 응답 스키마를 선택할 수 있도록 구성합니다.
todos:
  - id: modify_services
    content: 모든 서비스 함수를 ResponseType으로 변경하고 throw 대신 createServiceResponse 사용
    status: pending
  - id: modify_controllers
    content: 컨트롤러에서 서비스 응답의 error 필드를 확인하여 처리하도록 수정
    status: pending
  - id: update_route_schemas
    content: auth.route.ts에서 모든 응답을 200으로 통일하고 oneOf로 여러 스키마 정의
    status: pending
  - id: update_response_schemas
    content: auth.schema.ts에 oneOf를 지원하는 응답 스키마 생성 함수 추가
    status: pending
---

# 서비스 레이어 에러 처리 및 Swagger 응답 정리

## 1. 서비스 레이어 수정 (모든 서비스 파일)

모든 서비스 함수를 `ResponseType<TData>`를 리턴하도록 변경하고, `throw new Error()` 대신 `createServiceResponse`를 사용합니다.

### 수정할 파일들:

- `src/modules/auth/service/sign-in.service.ts`
- `src/modules/auth/service/sign-up.service.ts`
- `src/modules/auth/service/refresh-token.service.ts`
- `src/modules/auth/service/get-session.service.ts`
- `src/modules/auth/service/reset-password.service.ts`
- `src/modules/auth/service/change-password.service.ts`

### 각 서비스의 에러 상황 및 CODE 매핑:

**sign-in.service.ts:**

- 사용자 없음 → `CODE.UNAUTHORIZED`
- 삭제된 계정 → `CODE.FORBIDDEN`
- 사용 중지된 계정 → `CODE.FORBIDDEN`
- 비밀번호 불일치 → `CODE.UNAUTHORIZED`
- 정상 → `CODE.SUCCESS`

**sign-up.service.ts:**

- 이메일 중복 → `CODE.CONFLICT`
- 사용자명 중복 → `CODE.CONFLICT`
- 정상 → `CODE.CREATED`

**refresh-token.service.ts:**

- 토큰 검증 실패 → `CODE.UNAUTHORIZED`
- 사용자 없음 → `CODE.NOT_FOUND`
- 토큰 불일치 → `CODE.UNAUTHORIZED`
- 삭제된 계정 → `CODE.FORBIDDEN`
- 사용 중지된 계정 → `CODE.FORBIDDEN`
- 정상 → `CODE.SUCCESS`

**get-session.service.ts:**

- 토큰 검증 실패 → `CODE.UNAUTHORIZED`
- 사용자 없음 → `CODE.NOT_FOUND`
- 삭제된 계정 → `CODE.FORBIDDEN`
- 사용 중지된 계정 → `CODE.FORBIDDEN`
- 정상 → `CODE.SUCCESS`

**reset-password.service.ts:**

- 사용자 없음 → `CODE.NOT_FOUND`
- 삭제된 계정 → `CODE.FORBIDDEN`
- 정상 → `CODE.SUCCESS`

**change-password.service.ts:**

- 사용자 없음 → `CODE.NOT_FOUND`
- 비밀번호 불일치 → `CODE.UNAUTHORIZED`
- 정상 → `CODE.SUCCESS`

## 2. 컨트롤러 수정

서비스에서 리턴된 `ResponseType`의 `error` 필드를 확인하여:

- `error: true`면 그대로 리턴
- `error: false`면 정상 처리 후 `createSuccessResponse`로 변환

컨트롤러 레벨에서 발생할 수 있는 서버 에러는 `CODE.INTERNAL_SERVER_ERROR`로 처리합니다.

## 3. auth.route.ts 수정

- 모든 응답을 `200`으로 통일
- `error: true/false`로 에러 상황 구분
- 서비스에서 발생할 수 있는 모든 에러 응답과 정상 응답, 컨트롤러 레벨 서버 에러를 집계하여 `200` 응답에 `oneOf`로 여러 스키마를 정의
- Swagger UI에서 선택할 수 있도록 각 스키마에 적절한 description과 examples 추가

### 예시 구조 (로그인):

```typescript
response: {
  200: {
    description: '로그인 응답',
    oneOf: [
      successResponseSchema(userInfoResponseSchema), // error: false
      errorResponseSchema, // error: true (서비스 에러들)
      errorResponseSchema, // error: true (서버 에러)
    ],
    examples: [
      { code: CODE.SUCCESS, error: false, ... },
      { code: CODE.UNAUTHORIZED, error: true, ... },
      { code: CODE.FORBIDDEN, error: true, ... },
      { code: CODE.INTERNAL_SERVER_ERROR, error: true, ... },
    ]
  }
}
```

## 4. auth.schema.ts 수정

`oneOf`를 사용하기 위해 TypeBox의 `Type.Union` 또는 OpenAPI 스펙에 맞는 형식으로 응답 스키마를 구성합니다.