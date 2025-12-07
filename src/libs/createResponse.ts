import type { ResponseType } from '@/modules/common/common.schema';

export function createSuccessResponse<TData>(data: TData, message: string): ResponseType<TData> {
  return {
    success: true,
    data,
    error: false,
    message,
  };
}

export function createErrorResponse(errorMessage: string): ResponseType<null> {
  return {
    success: false,
    data: null,
    error: true,
    message: errorMessage,
  };
}
