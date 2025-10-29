# Mobile Shop Repair - MLKPHONE

A comprehensive mobile phone repair and sales platform built with Next.js 15, featuring both repair services and new phone sales with an integrated admin dashboard.

## 🚀 Features

### For Customers
- **Phone Repair Services**: Browse repair services by brand and device model
- **New Phone Sales**: Explore refurbished phones with detailed specifications
- **Brand Selection**: Support for major brands (Apple, Samsung, Google, OnePlus, Xiaomi, etc.)
- **Search & Filter**: Advanced filtering by price, storage, RAM, and availability
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Rich Text Descriptions**: Detailed product descriptions with formatting

### For Administrators
- **Dashboard Management**: Complete admin panel for managing inventory
- **Brand Management**: Add, edit, and manage phone brands
- **Model Management**: Manage phone models with specifications
- **Repair Services**: Configure repair services and pricing
- **Color Management**: Manage available colors for devices
- **Stock Management**: Track inventory and availability

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Custom component library with shadcn/ui
- **State Management**: React Context API
- **API Integration**: Custom API fetcher with React Query
- **Authentication**: JWT-based authentication system
- **Image Handling**: Next.js Image optimization with SafeImage component
- **Animations**: Framer Motion for smooth transitions
- **Rich Text**: CKEditor 5 for content management

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sohan284/Mobile_Master_Shop.git
   cd Mobile_Master_Shop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Add your API endpoints and configuration variables.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Admin dashboard
│   ├── phones/           # New phone sales pages
│   ├── repair/           # Repair services pages
│   └── components/       # Page-specific components
├── components/           # Reusable components
│   ├── ui/              # UI component library
│   ├── common/          # Common layout components
│   └── animations/      # Animation components
├── contexts/            # React Context providers
├── hooks/              # Custom React hooks
├── lib/               # Utility functions and API
└── providers/         # React Query and other providers
```

## 🎨 Key Components

### UI Components
- **SafeImage**: Handles both local and remote images with fallbacks
- **NotFound**: Consistent 404 and empty state component
- **GridSection**: Reusable grid layout for displaying items
- **DataTable**: Admin table with sorting, filtering, and pagination

### Page Components
- **Header**: Responsive navigation with mobile menu
- **HeroSection**: Reusable hero banners
- **SearchSection**: Search functionality with filters
- **FeaturesSection**: Feature highlights and benefits

## 🔧 API Integration

The application integrates with a REST API for:
- Brand management (`/api/brandnew/brands/`)
- Model management (`/api/brandnew/models/`)
- Repair services (`/api/repair/`)
- Authentication (`/auth/`)

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Responsive design for tablets
- **Desktop**: Full-featured desktop experience
- **Touch Friendly**: Large tap targets and smooth interactions

## 🎭 Animations

- **Page Transitions**: Smooth page-to-page transitions
- **Marquee Effects**: Infinite scrolling brand logos
- **Hover Effects**: Interactive element animations
- **Loading States**: Skeleton loaders and loading indicators

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🔐 Authentication

- JWT-based authentication
- Protected routes for admin dashboard
- User session management
- Secure API endpoints

## 📊 Admin Dashboard

The admin dashboard provides:
- **Brand Management**: Add, edit, delete phone brands
- **Model Management**: Manage phone models and specifications
- **Service Management**: Configure repair services
- **Inventory Tracking**: Monitor stock levels
- **User Management**: Handle user accounts and permissions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation for common solutions

## 🎯 Roadmap

- [ ] Mobile app development
- [ ] Payment integration
- [ ] Order tracking system
- [ ] Customer reviews and ratings
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

---

