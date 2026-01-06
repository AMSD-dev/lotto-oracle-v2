// src/types/billing.ts
export interface StoreProduct {
  id: string;
  expiryDate?: string;
  transaction: {
    id: string;
    purchaseToken: string;
  };
  finish: () => void;
}

export interface StoreError {
  code: number;
  message: string;
}
