export interface ResponseType<TData> {
  success: boolean;
  data: TData;
  error?: boolean;
  message?: string;
}

export interface ListType<TData> {
  list: TData[];
  totalCnt: number;
}
