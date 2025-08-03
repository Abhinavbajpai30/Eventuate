# Eventuate Homepage

A modern, professional homepage for Eventuate - an events discovery and booking platform where users can find events to join and list their own events for others to book.

## 🎯 Project Overview

Eventuate is a streamlined version of district.in with a focus on clean, contemporary design. The homepage features a modern UI with sophisticated styling, smooth animations, and a user-friendly experience.

## ✨ Features

### Design & UI
- **Modern & Professional**: Clean, minimalist design with plenty of white space
- **Contemporary UI**: Sophisticated, trustworthy, and user-friendly aesthetic
- **Responsive Design**: Mobile-first approach with responsive grid layouts
- **Smooth Animations**: Framer Motion animations for enhanced user experience
- **Gradient Styling**: Beautiful gradient backgrounds and text effects

### Homepage Sections
1. **Header/Navigation**: Logo, navigation menu, and authentication buttons
2. **Hero Section**: Compelling headline with dual CTAs and hero image
3. **Search Bar**: Advanced search with filters for location, date, category, and price
4. **Featured Events**: Trending events displayed in responsive cards
5. **Categories**: Browse events by category with event counts
6. **How It Works**: Three-step process explanation
7. **Trust Section**: Statistics and social proof
8. **Footer**: Links, social media, and newsletter signup

### Technical Features
- **React 19**: Latest React with modern hooks and patterns
- **Material-UI**: Professional component library with custom styling
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Framer Motion**: Smooth animations and transitions
- **Responsive Design**: Mobile, tablet, and desktop optimized

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Eventuate1/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the homepage

## 📁 Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Navigation and logo
│   │   ├── HeroSection.jsx     # Hero with CTAs
│   │   ├── SearchBar.jsx       # Advanced search functionality
│   │   ├── EventCard.jsx       # Individual event card
│   │   ├── FeaturedEvents.jsx  # Trending events section
│   │   ├── Categories.jsx      # Category browsing
│   │   ├── HowItWorks.jsx      # Process explanation
│   │   ├── TrustSection.jsx    # Statistics and social proof
│   │   ├── Footer.jsx          # Footer with links
│   │   └── Homepage.jsx        # Main homepage component
│   ├── data/
│   │   └── mockData.js         # Mock data for events, categories, stats
│   ├── App.jsx                 # Main app component
│   └── main.jsx               # Entry point
```

## 🎨 Design System

### Color Palette
- **Primary**: Linear gradient (#667eea to #764ba2)
- **Secondary**: Gold gradient (#FFD700 to #FFA500)
- **Background**: White and light grays
- **Text**: Dark grays for readability

### Typography
- **Headings**: Bold, gradient text effects
- **Body**: Clean, readable fonts
- **Buttons**: Rounded corners with hover effects

### Components
- **Cards**: Rounded corners, subtle shadows, hover animations
- **Buttons**: Gradient backgrounds, smooth transitions
- **Forms**: Clean inputs with focus states
- **Navigation**: Responsive with mobile drawer

## 📱 Responsive Design

The homepage is fully responsive with:
- **Mobile**: Stacked layouts, hamburger menu, touch-friendly buttons
- **Tablet**: Adjusted grid layouts, optimized spacing
- **Desktop**: Full-width layouts, hover effects, detailed information

## 🔧 Customization

### Adding New Events
Edit `src/data/mockData.js` to add new featured events:

```javascript
export const featuredEvents = [
  {
    id: 7,
    title: "Your New Event",
    date: "2024-08-15",
    time: "7:00 PM",
    location: "Your Location",
    price: 30,
    image: "your-image-url",
    organizer: "Your Organization",
    category: "Your Category",
    attendees: 100,
    isFree: false
  }
];
```

### Adding New Categories
Add new categories to the categories array:

```javascript
export const categories = [
  // ... existing categories
  {
    id: 9,
    name: "New Category",
    icon: "🎯",
    eventCount: 75,
    color: "bg-yellow-500"
  }
];
```

### Styling Customization
- Modify gradient colors in component `sx` props
- Update border radius and shadows for different aesthetics
- Adjust spacing using Material-UI's spacing system

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📊 Performance

- **Optimized Images**: Using Unsplash for high-quality, optimized images
- **Lazy Loading**: Components load as they come into view
- **Minimal Bundle**: Efficient imports and code splitting
- **Smooth Animations**: Hardware-accelerated animations

## 🔗 Dependencies

- **React**: ^19.1.0
- **Material-UI**: ^7.2.0
- **Framer Motion**: ^12.23.12
- **Tailwind CSS**: ^4.1.11

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎉 Features Implemented

✅ Modern header with responsive navigation  
✅ Hero section with compelling CTAs  
✅ Advanced search functionality  
✅ Featured events with event cards  
✅ Category browsing  
✅ How it works section  
✅ Trust statistics  
✅ Comprehensive footer  
✅ Mobile-responsive design  
✅ Smooth animations  
✅ Professional styling  

The Eventuate homepage is now ready for production use with a modern, professional design that encourages users to discover and book events while also motivating event organizers to list their events on the platform.
