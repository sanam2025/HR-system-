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

export interface APIResponseWithToken<T>{
  message: string;
  data: {
    user: T
  };
  Token: string;
  status_code: number;
}