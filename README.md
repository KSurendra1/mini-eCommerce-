# ShopEase - Mini E-commerce Platform

A modern, lightweight e-commerce platform built with React, TypeScript, and TailwindCSS.


# Coding Test Project Link
https://exquisite-lokum-166f17.netlify.app/

## Features

- 🛍️ Product browsing with variant selection
- 🛒 Shopping cart functionality
- 💳 Checkout process with form validation
- 📦 Order management with IndexedDB
- 📧 Email notifications (simulated)
- 🎨 Responsive design with Tailwind CSS
- 🌐 Client-side routing

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Vite
- React Router DOM
- React Hook Form
- Dexie.js (IndexedDB wrapper)
- Lucide React (Icons)

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository
```sh
git clone https://github.com/KSurendra1/mini-eCommerce-/.git
cd shopease
```

2. Install dependencies
```sh
npm install
# or
yarn install
```

3. Start the development server
```sh
npm run dev
# or
yarn dev
```

4. Build for production
```sh
npm run build
# or
yarn build
```

## Project Structure

```
src/
├── components/        # Reusable UI components
├── context/          # React Context providers
├── data/            # Mock data and constants
├── pages/           # Page components
├── services/        # Business logic and services
├── types/           # TypeScript type definitions
└── ...
```

## Features in Detail

### Product Management
- Browse products with detailed information
- Select product variants
- Real-time inventory tracking
- Dynamic pricing based on variants

### Shopping Cart
- Add products to cart
- Update quantities
- Calculate subtotals
- Persist cart state

### Checkout Process
- Form validation
- Address information collection
- Payment simulation
- Order confirmation

### Order Management
- Generate unique order IDs
- Store order history
- Track order status
- View order details

## Testing Payment Scenarios

Use these card number endings to simulate different payment outcomes:
- Ending in `1`: Payment approved
- Ending in `2`: Payment declined
- Ending in `3`: Payment error
- Any other: Payment approved (default)

## Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Lint code

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=your_api_url
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
