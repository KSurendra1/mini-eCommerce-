import { createContext, useContext, ReactNode, useCallback } from 'react';
import Dexie, { Table } from 'dexie';
import { useLiveQuery } from 'dexie-react-hooks';
import { 
  Product, 
  Variant, 
  Customer, 
  Order, 
  TransactionStatus, 
  PaymentDetails 
} from '../types';
import { mockProducts } from '../data/mockProducts';

// Database class
class ShopDatabase extends Dexie {
  products!: Table<Product, number>;
  orders!: Table<Order, string>;

  constructor() {
    super('ShopDatabase');
    this.version(1).stores({
      products: '++id, name, category',
      orders: 'id, customerId, productId, status, date'
    });
  }
}

const db = new ShopDatabase();

interface DatabaseContextType {
  db: ShopDatabase;
  products: Product[] | undefined;
  getProduct: (id: number) => Promise<Product | undefined>;
  initializeProducts: () => Promise<void>;
  createOrder: (
    customer: Customer,
    productId: number,
    variantId: number,
    quantity: number,
    payment: PaymentDetails,
    simulatedStatus: TransactionStatus
  ) => Promise<Order>;
  getOrder: (orderId: string) => Promise<Order | undefined>;
  updateProductInventory: (productId: number, variantId: number, quantity: number) => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  // Query products from database
  const products = useLiveQuery(() => db.products.toArray());

  // Initialize products if database is empty
  const initializeProducts = useCallback(async () => {
    const count = await db.products.count();
    if (count === 0) {
      await db.products.bulkAdd(mockProducts);
    }
  }, []);

  // Get a single product by ID
  const getProduct = async (id: number) => {
    return db.products.get(id);
  };

  // Create a new order
  const createOrder = async (
    customer: Customer,
    productId: number,
    variantId: number,
    quantity: number,
    payment: PaymentDetails,
    simulatedStatus: TransactionStatus
  ) => {
    const product = await db.products.get(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const variant = product.variants.find(v => v.id === variantId);
    if (!variant) {
      throw new Error('Variant not found');
    }

    // Generate a unique order ID
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    const order: Order = {
      id: orderId,
      customer,
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        imageUrl: product.imageUrl
      },
      variant: {
        id: variant.id,
        name: variant.name,
        price: variant.price
      },
      quantity,
      status: simulatedStatus,
      total: variant.price * quantity,
      payment: {
        last4: payment.cardNumber.slice(-4),
        expiryDate: payment.expiryDate
      },
      date: new Date()
    };

    await db.orders.add(order);
    return order;
  };

  // Get an order by ID
  const getOrder = async (orderId: string) => {
    return db.orders.get(orderId);
  };

  // Update product inventory
  const updateProductInventory = async (productId: number, variantId: number, quantity: number) => {
    const product = await db.products.get(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const updatedVariants = product.variants.map(variant => {
      if (variant.id === variantId) {
        return {
          ...variant,
          inventory: Math.max(0, variant.inventory - quantity)
        };
      }
      return variant;
    });

    await db.products.update(productId, {
      variants: updatedVariants
    });
  };

  return (
    <DatabaseContext.Provider
      value={{
        db,
        products,
        getProduct,
        initializeProducts,
        createOrder,
        getOrder,
        updateProductInventory
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}