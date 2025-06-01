import { EmailRequest } from '../types';

// This is a simulated email service since we're in a browser environment
// In a real application, this would make an API call to a backend service
export const sendEmail = async (emailData: EmailRequest): Promise<void> => {
  console.log('Sending email to:', emailData.to);
  console.log('Subject:', emailData.subject);
  
  // In a real implementation, this would be an API call to your backend
  // For example:
  // await fetch('/api/send-email', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(emailData),
  // });
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Log the appropriate email template based on the transaction status
  if (emailData.status === 'approved') {
    console.log(`
      Dear ${emailData.customer.fullName},
      
      Thank you for your order! Your order (${emailData.orderId}) has been confirmed and is being processed.
      
      We'll notify you when your order has shipped.
      
      Thank you for shopping with ShopEase!
    `);
  } else if (emailData.status === 'declined') {
    console.log(`
      Dear ${emailData.customer.fullName},
      
      We're sorry, but your payment for order ${emailData.orderId} was declined by your bank.
      
      Please try again with a different payment method or contact your bank for more information.
      
      If you need assistance, please contact our customer support team.
      
      Thank you,
      ShopEase Customer Support
    `);
  } else {
    console.log(`
      Dear ${emailData.customer.fullName},
      
      We encountered an error while processing your payment for order ${emailData.orderId}.
      
      This could be due to a temporary issue with our payment gateway. Please try again in a few minutes.
      
      If you continue to experience issues, please contact our customer support team.
      
      Thank you,
      ShopEase Customer Support
    `);
  }
  
  console.log('Email sent successfully!');
  
  return Promise.resolve();
};