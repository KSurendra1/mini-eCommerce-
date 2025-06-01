// Product types
export interface Variant {
  id: number;
  name: string;
  price: number;
  inventory: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  variants: Variant[];
}

// Cart types
export interface CartItem {
  product: Product;
  variant: Variant;
  quantity: number;
  subtotal: number;
}

// Customer types
export interface Customer {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

// Payment types
export interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

// Transaction types
export type TransactionStatus = 'approved' | 'declined' | 'error';

// Order types
export interface Order {
  id: string;
  customer: Customer;
  product: {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
  };
  variant: {
    id: number;
    name: string;
    price: number;
  };
  quantity: number;
  status: TransactionStatus;
  total: number;
  payment: {
    last4: string;
    expiryDate: string;
  };
  date: Date;
}

// Email types
export interface EmailRequest {
  to: string;
  subject: string;
  orderId: string;
  customer: Customer;
  status: TransactionStatus;
}