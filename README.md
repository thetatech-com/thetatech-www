# THETHA - Electronics Hub Platform

## 🚀 Overview

THETHA is a comprehensive electronics platform that combines social networking, e-commerce marketplace, repair services, and custom PC building into one unified experience. Built with React, TypeScript, and Supabase, it offers users a complete ecosystem for all their electronics needs.

## ✨ Key Features

### 🛠️ Repair Services
- Professional mobile and electronics repair
- Screen replacement, battery replacement, speaker & mic repair
- Network connectivity issues resolution
- Water damage repair services
- 6-month warranty on all repairs
- Same-day service availability

### 🛒 Electronics Marketplace
- Browse smartphones, laptops, accessories, and components
- User-generated product listings with photo uploads
- Seller dashboard for managing products and orders
- Advanced search and filtering capabilities
- Real-time inventory management

### 🤝 Social Features
- Social media-style feed with posts, comments, and interactions
- Video sharing and live streaming capabilities
- Group discussions and community channels
- Friend system and messaging
- Gaming community integration

### 🖥️ Custom PC Building
- Gaming PC builds starting from ₹45,000
- Professional workstation builds from ₹35,000
- Budget PC builds from ₹25,000
- Component consultation and selection
- Professional assembly and testing services

### 👥 Group Buying (Pay Together)
- Collaborative purchasing for bulk discounts
- Group buy coordination and management
- Cost savings through collective purchasing power

### 🤖 AI Assistant (AKOE Bot)
- Intelligent chatbot for customer support
- Product recommendations and information
- Repair service booking assistance
- Navigation help throughout the platform

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons

### Backend & Database
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Relational database
- **Real-time subscriptions** - Live data updates
- **Row Level Security (RLS)** - Data security

### State Management & Data Fetching
- **TanStack Query** - Server state management
- **React Hook Form** - Form handling
- **Zustand/Context API** - Client state management

### Additional Features
- **Google Generative AI** - AI-powered features
- **Recharts** - Data visualization
- **React Dropzone** - File uploads
- **Sonner** - Toast notifications

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Radix + custom)
│   ├── AnimatedLogo.tsx
│   ├── BuildPCSection.tsx
│   ├── ChatBot.tsx
│   ├── ProductCard.tsx
│   └── ...
├── pages/              # Main application pages
│   ├── Index.tsx       # Homepage
│   ├── Store.tsx       # Marketplace
│   ├── Social.tsx      # Social feed
│   ├── BuildPC.tsx     # PC building service
│   └── ...
├── hooks/              # Custom React hooks
├── contexts/           # React contexts
├── types/              # TypeScript type definitions
├── lib/                # Utility functions
└── integrations/       # External service integrations
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd thetatech.com
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GOOGLE_AI_API_KEY=your_google_ai_api_key
   ```

4. **Set up Supabase**
   - Run the migrations in the `supabase/migrations/` directory
   - Configure your Supabase project settings
   - Set up storage buckets for file uploads

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## 📊 Database Schema

The application uses Supabase with the following main tables:
- `profiles` - User profile information
- `products` - Marketplace products
- `orders` & `order_items` - E-commerce transactions
- `posts` & `comments` - Social media content
- `channels` & `videos` - Video content and streaming
- `pc_builds` - Custom PC configurations
- `groups` - Community groups and discussions

## 🎯 Key Pages & Features

### Homepage (`/`)
- Hero section with product slideshow
- Services overview
- PC building options
- Statistics and testimonials

### Store (`/store`)
- Product catalog with filtering
- Category-based navigation
- Search functionality
- Shopping cart integration

### Social (`/social`)
- Social media feed
- Post creation and interaction
- Video sharing capabilities
- Live streaming features

### Repair Services (`/repair`)
- Service booking interface
- Repair status tracking
- Customer dashboard

### Build PC (`/build-pc`)
- Custom PC configuration
- Build options and pricing
- Consultation booking

## 🔐 Authentication & Authorization

- Supabase Auth integration
- Role-based access control
- Protected routes for authenticated users
- Admin approval system for sellers

## 📱 Mobile Responsiveness

The application is fully responsive with:
- Mobile-first design approach
- Touch-friendly interfaces
- Optimized layouts for all screen sizes
- Progressive Web App (PWA) capabilities

## 🧪 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run supabase:generate-types  # Generate Supabase types
```

## �� Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 
Add
some
amazing
feature`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and inquiries:
- Email: support@thetha.com
- Phone: +1 (555) 123-4567
- Website: [https://thetha.com](https://thetha.com)

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styled with [TailwindCSS](https://tailwindcss.com/)
- Backend powered by [Supabase](https://supabase.com/)
- Icons by [Lucide](https://lucide.dev/)

---

**THETHA** - Your complete electronics hub for repairs, shopping, and community! 🚀
