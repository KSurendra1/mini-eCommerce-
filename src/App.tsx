import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CheckoutPage from './pages/CheckoutPage';
import ThankYouPage from './pages/ThankYouPage';
import Header from './components/Header';
import Footer from './components/Footer';
import { useEffect } from 'react';
import { useDatabase } from './context/DatabaseContext';

function App() {
  const { initializeProducts } = useDatabase();
  
  useEffect(() => {
    // Initialize the database with mock products
    initializeProducts();
  }, [initializeProducts]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/thank-you/:orderId" element={<ThankYouPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;