import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, AlertTriangle, ArrowLeft, Package } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import { Order, TransactionStatus } from '../types';

const ThankYouPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrder } = useDatabase();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (orderId) {
      getOrder(orderId)
        .then(orderData => {
          if (orderData) {
            setOrder(orderData);
          }
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching order:', error);
          setIsLoading(false);
        });
    }
  }, [orderId, getOrder]);
  
  const getStatusIcon = (status: TransactionStatus) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="text-green-500\" size={48} />;
      case 'declined':
        return <XCircle className="text-red-500" size={48} />;
      case 'error':
        return <AlertTriangle className="text-amber-500" size={48} />;
      default:
        return null;
    }
  };
  
  const getStatusTitle = (status: TransactionStatus) => {
    switch (status) {
      case 'approved':
        return 'Payment Approved!';
      case 'declined':
        return 'Payment Declined';
      case 'error':
        return 'Payment Error';
      default:
        return 'Order Status';
    }
  };
  
  const getStatusMessage = (status: TransactionStatus) => {
    switch (status) {
      case 'approved':
        return 'Your order has been confirmed and is being processed. You will receive a confirmation email shortly.';
      case 'declined':
        return 'Your payment was declined by your bank. Please try again with a different payment method.';
      case 'error':
        return 'There was an error processing your payment. Please try again or contact customer support.';
      default:
        return '';
    }
  };
  
  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case 'approved':
        return 'bg-green-50 border-green-100';
      case 'declined':
        return 'bg-red-50 border-red-100';
      case 'error':
        return 'bg-amber-50 border-amber-100';
      default:
        return 'bg-gray-50 border-gray-100';
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <Package size={48} className="text-blue-400 mb-2" />
          <p className="text-gray-500">Loading order details...</p>
        </div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-lg mx-auto">
          <AlertTriangle className="text-amber-500 mx-auto mb-4" size={48} />
          <h1 className="text-2xl font-semibold mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">
            We couldn't find an order with the ID: {orderId}
          </p>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft size={16} className="mr-2" />
            Return to Store
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <div className={`rounded-xl shadow-sm p-8 mb-6 border ${getStatusColor(order.status)}`}>
          <div className="text-center mb-6">
            {getStatusIcon(order.status)}
            <h1 className="text-2xl font-semibold mt-4">{getStatusTitle(order.status)}</h1>
            <p className="text-gray-600 mt-2">{getStatusMessage(order.status)}</p>
          </div>
          
          <div className="mt-6">
            <div className="bg-white rounded-lg p-4 mb-4">
              <h2 className="text-lg font-medium mb-2">Order Details</h2>
              <p className="text-sm text-gray-600 mb-4">Order ID: <span className="font-mono">{order.id}</span></p>
              
              <div className="flex items-start">
                <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={order.product.imageUrl}
                    alt={order.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium">{order.product.name}</h3>
                  <p className="text-sm text-gray-500">Variant: {order.variant.name}</p>
                  <p className="text-sm text-gray-500">Quantity: {order.quantity}</p>
                  <p className="text-sm font-medium mt-1">
                    ${order.variant.price.toFixed(2)} x {order.quantity} = ${order.total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 mb-4">
              <h2 className="text-lg font-medium mb-4">Customer Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="text-sm font-medium">{order.customer.fullName}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-sm font-medium">{order.customer.email}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="text-sm font-medium">{order.customer.phone}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="text-sm font-medium">{order.customer.address}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">City</p>
                  <p className="text-sm font-medium">{order.customer.city}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">State</p>
                  <p className="text-sm font-medium">{order.customer.state}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Zip Code</p>
                  <p className="text-sm font-medium">{order.customer.zipCode}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 mb-6">
              <h2 className="text-lg font-medium mb-4">Payment Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Card Number</p>
                  <p className="text-sm font-medium">**** **** **** {order.payment.last4}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Expiry Date</p>
                  <p className="text-sm font-medium">{order.payment.expiryDate}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <p className={`text-sm font-medium ${
                    order.status === 'approved' ? 'text-green-600' : 
                    order.status === 'declined' ? 'text-red-600' : 'text-amber-600'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="text-sm font-medium">
                    {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Link to="/" className="btn btn-primary">
              <ArrowLeft size={16} className="mr-2" />
              Continue Shopping
            </Link>
            
            {order.status !== 'approved' && (
              <p className="mt-4 text-sm text-gray-600">
                If you need assistance, please contact our customer support at support@shopease.com
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;