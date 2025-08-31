# NANA - Editorial Commerce Design System 🌸

**Living Magazine meets Digital Commerce**

A modern e-commerce platform inspired by Japanese fashion magazines, combining editorial content with seamless shopping experiences.

## ✨ Features

### 🎌 Magazine-Style Interface
- Interactive page-flip navigation
- Japanese-inspired design aesthetics
- Editorial content integration
- Seasonal themes and layouts

### 🛍️ E-Commerce Functionality
- Product catalog with categories (Fashion, Beauty, Lifestyle)
- Shopping cart with real-time updates
- User authentication (JWT + Google OAuth)
- Product detail modals with size/color selection

### 🎭 Interactive Elements
- 3D floating bubbles with parallax effects
- Smooth page transitions and animations
- Responsive design for all devices
- Magazine/Shopping mode toggle

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- Python 3.x (for development server)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sin77812/nana.git
cd nana
```

2. Install dependencies:
```bash
npm install
cd backend
npm install
```

3. Start the backend server:
```bash
cd backend
node server-dev.js
```

4. Start the frontend server:
```bash
# From project root
python3 -m http.server 8084
```

5. Open your browser:
   - Frontend: `http://localhost:8084`
   - Backend API: `http://localhost:5001`

## 📁 Project Structure

```
nana/
├── src/                    # Frontend source code
│   ├── main.js            # Main application logic
│   └── api/               # API integration
├── backend/               # Backend server
│   ├── server-dev.js      # Development server
│   ├── models/            # Database models
│   └── routes/            # API routes
├── styles/                # CSS styles
├── images/                # Static assets
└── CLAUDE.md             # Design system documentation
```

## 🎨 Design System

NANA follows a unique "Editorial First" philosophy:
- **Magazine Mode**: Content-driven browsing experience
- **Commerce Mode**: Streamlined shopping interface
- **Kawaii Minimalism**: Cute yet sophisticated aesthetics
- **Seasonal Narratives**: Dynamic themes and layouts

## 🔧 Tech Stack

### Frontend
- Vanilla JavaScript (ES6+)
- Three.js for 3D effects
- CSS Grid & Flexbox
- Responsive design

### Backend
- Node.js + Express
- JWT Authentication
- In-memory database (development)
- RESTful API architecture

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get single product

### Shopping Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart/:itemId` - Remove item from cart

## 🌟 Key Features Implemented

✅ **Product Integration**: Real backend data for 30+ products  
✅ **Authentication System**: JWT tokens with Google OAuth support  
✅ **Shopping Cart**: Persistent cart with backend synchronization  
✅ **Responsive Design**: Works on desktop, tablet, and mobile  
✅ **Interactive UI**: Magazine page-flip and 3D bubble effects  
✅ **Real-time Updates**: Cart count and user state management  

## 🎯 Development Status

- **Frontend-Backend Integration**: ✅ Complete
- **Authentication Flow**: ✅ Complete  
- **Product Catalog**: ✅ Complete
- **Shopping Cart**: ✅ Complete
- **Payment Integration**: 🚧 Future enhancement
- **Order Management**: 🚧 Future enhancement

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Inspired by Japanese fashion magazines
- Three.js for 3D graphics
- Modern web development practices
- Editorial design principles

---

Built with ❤️ for the modern digital shopping experience.