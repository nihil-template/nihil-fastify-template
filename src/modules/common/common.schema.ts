import type { CODE } from '@/code';

export interface ResponseType<TData> {
  code: typeof CODE[keyof typeof CODE];
  data: TData;
  error?: boolean;
  message?: string;
}

export interface ListType<TData> {
  list: TData[];
  totalCnt: number;
}
