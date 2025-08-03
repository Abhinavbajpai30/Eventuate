# Eventuate - Authentication System

A complete authentication system for Eventuate, an events discovery and booking platform, built with React, Node.js, MongoDB, and JWT tokens.

## 🚀 Features

### Authentication
- **User Registration**: Sign up with full name, email, password, phone (optional), location, and account type
- **User Login**: Secure authentication with email and password
- **JWT Token Management**: Automatic token storage and API authentication
- **Password Hashing**: Secure password storage using bcrypt
- **Form Validation**: Client and server-side validation with error handling

### Profile Management
- **Profile View**: Display user information, preferences, and statistics
- **Profile Editing**: Update personal information, bio, interests, and notification preferences
- **Account Statistics**: View events created and booked
- **Verification Status**: Display account verification status

### Security
- **Protected Routes**: React Router with authentication guards
- **JWT Middleware**: Server-side route protection
- **Password Validation**: Minimum length and confirmation matching
- **Email Validation**: Proper email format validation

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Material-UI Icons** - Icon library
- **Framer Motion** - Animation library
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing

## 📁 Project Structure

```
Eventuate1/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Login.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   └── ... (existing components)
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   └── App.jsx
│   └── package.json
└── server/                 # Node.js backend
    ├── src/
    │   ├── models/
    │   │   └── User.js
    │   ├── routes/
    │   │   └── auth.js
    │   ├── middleware/
    │   │   └── auth.js
    │   └── config/
    │       └── db.js
    ├── server.js
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp env.example .env
   ```
   
   Update `.env` with your configuration:
   ```
   MONGODB_URI=mongodb://localhost:27017/eventuate
   JWT_SECRET=your-secret-key-here
   PORT=5000
   NODE_ENV=development
   ```

4. **Start MongoDB** (if using local):
   ```bash
   mongod
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## 📡 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Authenticate user | No |
| GET | `/api/auth/profile` | Get user profile | Yes |
| PUT | `/api/auth/profile` | Update user profile | Yes |

### Request/Response Examples

#### Sign Up
```javascript
POST /api/auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "phone": "+1234567890",
  "location": {
    "city": "New York",
    "state": "NY"
  },
  "accountType": "attendee"
}
```

#### Login
```javascript
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Update Profile
```javascript
PUT /api/auth/profile
Authorization: Bearer <token>
{
  "name": "John Smith",
  "bio": "Event enthusiast",
  "interests": ["Music", "Technology"],
  "notifications": {
    "email": true,
    "sms": false,
    "push": true
  }
}
```

## 🗄️ Database Schema

### User Model
```javascript
{
  // Basic Info
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  phone: String,
  
  // Profile Details
  bio: String (max 500 chars),
  profilePicture: String (URL),
  location: {
    city: String,
    state: String,
    country: String
  },
  
  // Preferences
  interests: [String],
  notifications: {
    email: Boolean (default: true),
    sms: Boolean (default: false),
    push: Boolean (default: true)
  },
  
  // Event-related
  eventsCreated: [ObjectId],
  eventsBooked: [ObjectId],
  
  // Account Info
  isVerified: Boolean (default: false),
  accountType: String (enum: ['attendee', 'organizer', 'both']),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Security Features

- **Password Hashing**: bcrypt with salt rounds of 12
- **JWT Tokens**: 7-day expiration with secure secret
- **Input Validation**: Server-side validation with express-validator
- **CORS**: Configured for cross-origin requests
- **Error Handling**: Comprehensive error messages
- **Protected Routes**: Authentication middleware for sensitive endpoints

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern Forms**: Clean, accessible form design
- **Loading States**: Visual feedback during API calls
- **Error Handling**: User-friendly error messages
- **Success Feedback**: Confirmation messages for actions
- **Animations**: Smooth transitions with Framer Motion
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🔄 State Management

- **AuthContext**: React Context for authentication state
- **Local Storage**: JWT token persistence
- **Automatic Token Handling**: Axios interceptors for API calls
- **Route Protection**: PrivateRoute component for authenticated pages

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration with valid data
- [ ] User registration with invalid data (validation)
- [ ] User login with correct credentials
- [ ] User login with incorrect credentials
- [ ] Profile page access (authenticated)
- [ ] Profile page access (unauthenticated) - redirect to login
- [ ] Profile editing functionality
- [ ] Logout functionality
- [ ] Token persistence across page refreshes
- [ ] Responsive design on mobile devices

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to Heroku, Vercel, or similar platform

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to Netlify, Vercel, or similar platform
3. Update API base URL for production

## 📝 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/eventuate
JWT_SECRET=your-secret-key-here
PORT=5000
NODE_ENV=development
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the repository or contact the development team.

---

**Note**: This is a basic authentication system. For production use, consider adding:
- Email verification
- Password reset functionality
- Rate limiting
- More comprehensive error logging
- Unit and integration tests
- HTTPS enforcement
- CSRF protection 