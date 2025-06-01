import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Package } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import { useCart } from '../context/CartContext';
import { Product, Variant } from '../types';
import ProductCard from '../components/ProductCard';

const LandingPage = () => {
  const navigate = useNavigate();
  const { products } = useDatabase();
  const { addToCart } = useCart();
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (products && products.length > 0) {
      setSelectedProduct(products[0]);
      setSelectedVariant(products[0].variants[0]);
      setIsLoading(false);
    }
  }, [products]);

  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, Math.min(10, value));
    setQuantity(newQuantity);
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setSelectedVariant(product.variants[0]);
    setQuantity(1);
  };

  const handleVariantSelect = (variant: Variant) => {
    setSelectedVariant(variant);
  };

  const handleBuyNow = () => {
    if (selectedProduct && selectedVariant) {
      addToCart(selectedProduct, selectedVariant, quantity);
      navigate('/checkout');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <Package size={48} className="text-blue-400 mb-2" />
          <p className="text-gray-500">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-semibold text-center mb-8">Featured Products</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Product listing (sidebar) */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-4">Our Products</h2>
            <div className="space-y-4">
              {products?.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  isSelected={selectedProduct?.id === product.id}
                  onClick={() => handleProductSelect(product)}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Product detail */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          {selectedProduct && selectedVariant && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Product image */}
                <div className="relative h-80 md:h-full">
                  <img 
                    src={selectedProduct.imageUrl} 
                    alt={selectedProduct.name} 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                
                {/* Product info */}
                <div className="p-6 md:p-8">
                  <h1 className="text-2xl font-semibold mb-2">{selectedProduct.name}</h1>
                  <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Select Variant</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.variants.map(variant => (
                        <button
                          key={variant.id}
                          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                            selectedVariant.id === variant.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                          onClick={() => handleVariantSelect(variant)}
                          disabled={variant.inventory === 0}
                        >
                          {variant.name}
                          {variant.inventory === 0 && ' (Out of Stock)'}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Quantity</h3>
                    <div className="quantity-selector">
                      <button 
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                        className="quantity-input"
                      />
                      <button 
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= 10 || quantity >= selectedVariant.inventory}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedVariant.inventory > 0 
                        ? `${selectedVariant.inventory} available in stock` 
                        : 'Out of stock'}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-2xl font-semibold">${selectedVariant.price.toFixed(2)}</p>
                    <p className="text-gray-600">
                      Total: ${(selectedVariant.price * quantity).toFixed(2)}
                    </p>
                  </div>
                  
                  <button
                    className="btn btn-primary w-full"
                    onClick={handleBuyNow}
                    disabled={selectedVariant.inventory === 0}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;