import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CreditCard, ShieldCheck, AlertTriangle, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useDatabase } from '../context/DatabaseContext';
import { TransactionStatus, Customer, PaymentDetails } from '../types';
import { sendEmail } from '../services/emailService';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItem } = useCart();
  const { createOrder, updateProductInventory } = useDatabase();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const { register, handleSubmit, formState: { errors } } = useForm<Customer & PaymentDetails>();
  
  // Redirect if no cart item
  if (!cartItem) {
    navigate('/');
    return null;
  }
  
  const { product, variant, quantity, subtotal } = cartItem;
  
  const onSubmit = async (data: Customer & PaymentDetails) => {
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      // Simulate different transaction outcomes based on card number
      let transactionStatus: TransactionStatus;
      
      if (data.cardNumber.endsWith('1')) {
        transactionStatus = 'approved';
      } else if (data.cardNumber.endsWith('2')) {
        transactionStatus = 'declined';
      } else if (data.cardNumber.endsWith('3')) {
        transactionStatus = 'error';
      } else {
        transactionStatus = 'approved'; // Default case
      }
      
      // Extract customer and payment data
      const { cardNumber, expiryDate, cvv, ...customerData } = data;
      
      // Create the order in the database
      const order = await createOrder(
        customerData as Customer,
        product.id,
        variant.id,
        quantity,
        { cardNumber, expiryDate, cvv },
        transactionStatus
      );
      
      // Update inventory if transaction is approved
      if (transactionStatus === 'approved') {
        await updateProductInventory(product.id, variant.id, quantity);
      }
      
      // Send confirmation email
      await sendEmail({
        to: data.email,
        subject: 
          transactionStatus === 'approved' 
            ? 'Your order has been confirmed!' 
            : 'There was an issue with your order',
        orderId: order.id,
        customer: customerData as Customer,
        status: transactionStatus
      });
      
      // Navigate to thank you page
      navigate(`/thank-you/${order.id}`);
      
    } catch (error) {
      console.error('Error processing order:', error);
      setErrorMessage('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-2xl font-semibold text-center mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="flex items-start mb-4">
              <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium">{product.name}</h3>
                <p className="text-sm text-gray-500">Variant: {variant.name}</p>
                <p className="text-sm text-gray-500">Quantity: {quantity}</p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between font-semibold text-lg mt-4 pt-4 border-t border-gray-200">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start">
                <ShieldCheck className="text-blue-500 mr-3 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Secure Checkout</span><br />
                  Your payment information is encrypted and secure.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Checkout Form */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-6">Billing Information</h2>
            
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-start">
                <AlertTriangle className="text-red-500 mr-3 flex-shrink-0" />
                <p className="text-sm text-red-800">{errorMessage}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="fullName" className="form-label">Full Name</label>
                  <input
                    id="fullName"
                    type="text"
                    className={`form-input ${errors.fullName ? 'border-red-500' : ''}`}
                    placeholder="John Doe"
                    {...register('fullName', { required: 'Full name is required' })}
                  />
                  {errors.fullName && (
                    <p className="error-message">{errors.fullName.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="john@example.com"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                  {errors.email && (
                    <p className="error-message">{errors.email.message}</p>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="phone" className="form-label">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  className={`form-input ${errors.phone ? 'border-red-500' : ''}`}
                  placeholder="(555) 123-4567"
                  {...register('phone', { 
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[\d\s()+-]+$/,
                      message: 'Invalid phone number'
                    }
                  })}
                />
                {errors.phone && (
                  <p className="error-message">{errors.phone.message}</p>
                )}
              </div>
              
              <div className="mb-6">
                <label htmlFor="address" className="form-label">Address</label>
                <input
                  id="address"
                  type="text"
                  className={`form-input ${errors.address ? 'border-red-500' : ''}`}
                  placeholder="123 Main St"
                  {...register('address', { required: 'Address is required' })}
                />
                {errors.address && (
                  <p className="error-message">{errors.address.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <label htmlFor="city" className="form-label">City</label>
                  <input
                    id="city"
                    type="text"
                    className={`form-input ${errors.city ? 'border-red-500' : ''}`}
                    placeholder="New York"
                    {...register('city', { required: 'City is required' })}
                  />
                  {errors.city && (
                    <p className="error-message">{errors.city.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="state" className="form-label">State</label>
                  <input
                    id="state"
                    type="text"
                    className={`form-input ${errors.state ? 'border-red-500' : ''}`}
                    placeholder="NY"
                    {...register('state', { required: 'State is required' })}
                  />
                  {errors.state && (
                    <p className="error-message">{errors.state.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="zipCode" className="form-label">Zip Code</label>
                  <input
                    id="zipCode"
                    type="text"
                    className={`form-input ${errors.zipCode ? 'border-red-500' : ''}`}
                    placeholder="10001"
                    {...register('zipCode', { 
                      required: 'Zip code is required',
                      pattern: {
                        value: /^\d{5}(-\d{4})?$/,
                        message: 'Invalid zip code format'
                      }
                    })}
                  />
                  {errors.zipCode && (
                    <p className="error-message">{errors.zipCode.message}</p>
                  )}
                </div>
              </div>
              
              <h2 className="text-lg font-semibold mb-6">Payment Details</h2>
              
              <div className="mb-6">
                <label htmlFor="cardNumber" className="form-label">Card Number</label>
                <div className="relative">
                  <input
                    id="cardNumber"
                    type="text"
                    className={`form-input pl-10 ${errors.cardNumber ? 'border-red-500' : ''}`}
                    placeholder="4111 1111 1111 1111"
                    {...register('cardNumber', { 
                      required: 'Card number is required',
                      pattern: {
                        value: /^\d{16}$/,
                        message: 'Card number must be 16 digits'
                      }
                    })}
                  />
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                </div>
                {errors.cardNumber && (
                  <p className="error-message">{errors.cardNumber.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Use 1, 2, or 3 as the last digit to simulate different transaction outcomes
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <label htmlFor="expiryDate" className="form-label">Expiry Date</label>
                  <input
                    id="expiryDate"
                    type="text"
                    className={`form-input ${errors.expiryDate ? 'border-red-500' : ''}`}
                    placeholder="MM/YY"
                    {...register('expiryDate', { 
                      required: 'Expiry date is required',
                      pattern: {
                        value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                        message: 'Format must be MM/YY'
                      },
                      validate: {
                        futureDate: (value) => {
                          const [month, year] = value.split('/');
                          const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
                          return expiryDate > new Date() || 'Card has expired';
                        }
                      }
                    })}
                  />
                  {errors.expiryDate && (
                    <p className="error-message">{errors.expiryDate.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="cvv" className="form-label">CVV</label>
                  <input
                    id="cvv"
                    type="text"
                    className={`form-input ${errors.cvv ? 'border-red-500' : ''}`}
                    placeholder="123"
                    {...register('cvv', { 
                      required: 'CVV is required',
                      pattern: {
                        value: /^\d{3}$/,
                        message: 'CVV must be 3 digits'
                      }
                    })}
                  />
                  {errors.cvv && (
                    <p className="error-message">{errors.cvv.message}</p>
                  )}
                </div>
              </div>
              
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : `Complete Purchase • $${subtotal.toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;