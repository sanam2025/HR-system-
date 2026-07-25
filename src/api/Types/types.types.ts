export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
  status_code: number;
}

export interface APIResponseWithData<T> {
  success: boolean;
  message: string;
  data: T;
  status_code: number;
}

export interface APIResponseWithDataArray<T> {
  success: boolean;
  message: string;
  data: T[];
  status_code: number;
}

export interface APIResponseWithOnlyData<T>{
  data: T;
}

export interface APIResponseWithOnlyDataArray<T>{
  data: T[];
}