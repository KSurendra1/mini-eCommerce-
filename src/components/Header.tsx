import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-sm py-4 px-6 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold text-blue-600 flex items-center">
          <ShoppingBag className="mr-2" size={24} />
          <span>ShopEase</span>
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                Shop
              </Link>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                About
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;