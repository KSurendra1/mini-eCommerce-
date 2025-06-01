import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isSelected, onClick }) => {
  return (
    <div 
      className={`p-3 rounded-lg cursor-pointer transition-colors ${
        isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-gray-800">{product.name}</h3>
          <p className="text-xs text-gray-500">{product.category}</p>
          <p className="text-sm font-medium text-blue-600 mt-1">
            ${product.variants[0].price.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;