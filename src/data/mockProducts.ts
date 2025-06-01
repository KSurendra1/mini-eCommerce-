import { Product } from '../types';

export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    description: 'Experience unparalleled sound quality with our premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and ultra-comfortable memory foam ear cushions.',
    imageUrl: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Electronics',
    variants: [
      {
        id: 1,
        name: 'Matte Black',
        price: 249.99,
        inventory: 25
      },
      {
        id: 2,
        name: 'Silver White',
        price: 249.99,
        inventory: 15
      },
      {
        id: 3,
        name: 'Navy Blue',
        price: 269.99,
        inventory: 10
      }
    ]
  },
  {
    id: 2,
    name: 'Ultra Slim Smartwatch',
    description: 'Stay connected and track your fitness goals with our ultra-slim smartwatch. Features heart rate monitoring, sleep tracking, and 7-day battery life in an elegant design.',
    imageUrl: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Wearables',
    variants: [
      {
        id: 1,
        name: 'Black (42mm)',
        price: 199.99,
        inventory: 20
      },
      {
        id: 2,
        name: 'Rose Gold (38mm)',
        price: 189.99,
        inventory: 15
      },
      {
        id: 3,
        name: 'Silver (42mm)',
        price: 199.99,
        inventory: 12
      }
    ]
  },
  {
    id: 3,
    name: 'Premium Leather Backpack',
    description: 'Crafted from full-grain leather, our premium backpack combines style with functionality. Features padded laptop compartment, multiple organization pockets, and water-resistant construction.',
    imageUrl: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Accessories',
    variants: [
      {
        id: 1,
        name: 'Vintage Brown',
        price: 179.99,
        inventory: 8
      },
      {
        id: 2,
        name: 'Black',
        price: 179.99,
        inventory: 12
      },
      {
        id: 3,
        name: 'Tan',
        price: 189.99,
        inventory: 5
      }
    ]
  }
];