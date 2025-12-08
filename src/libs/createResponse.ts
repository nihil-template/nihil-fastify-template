import { CODE } from '@/code';
import type { ResponseType } from '@/modules/common/common.schema';

export function createSuccessResponse<TData>(
  data: TData,
  message: string,
  code: typeof CODE[keyof typeof CODE]
): ResponseType<TData> {
  return {
    code,
    data,
    error: false,
    message,
  };
}

export function createErrorResponse(
  message: string,
  code: typeof CODE[keyof typeof CODE]
): ResponseType<null> {
  return {
    code,
    data: null,
    error: true,
    message,
  };
}

export function createServiceResponse<TData>(
  data: TData,
  message: string,
  error: boolean,
  code: typeof CODE[keyof typeof CODE]
): ResponseType<TData> {
  return {
    code,
    data,
    error,
    message,
  };
}
