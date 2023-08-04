export interface ProductCreateRequest {
  productName: string;
  price: number;
  quantity: number;
  category: string;
  status: string;
  description: string;
  sampleFile: File | null;
  sampleFile2: File | null;
  userId: number;
}

export interface ProductCreateResponse {
  success: boolean;
  message: string;
  productId: number;
}

export interface ProductCreateError {
  errorCode: number;
  errorMessage: string;
}

export interface FileReaderEventTarget extends EventTarget {
  result?: string | null;
}
