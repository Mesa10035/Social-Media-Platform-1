# Social Media Platform - Setup Guide

A modern, full-stack social media platform built with React, Node.js, Express, MongoDB, and Socket.io.

## 📋 Prerequisites

Before you begin, make sure you have installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB Community Server** (Local) - [Download](https://www.mongodb.com/try/download/community)
- **pnpm** - [Install via npm](https://pnpm.io/installation) or `npm install -g pnpm`
- **MongoDB Compass** (Optional but recommended) - [Download](https://www.mongodb.com/products/compass)

## 🚀 Quick Start

### 1. Start MongoDB Server

Open a terminal and start the MongoDB service:

**On Windows:**
```bash
mongod
```

**On macOS (with Homebrew):**
```bash
brew services start mongodb-community
```

**On Linux:**
```bash
sudo systemctl start mongod
```

Verify MongoDB is running by opening MongoDB Compass and checking the connection at `mongodb://127.0.0.1:27017`

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and update if needed:
```
MONGODB_URI=mongodb://127.0.0.1:27017/social_media_platform
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=3000
PING_MESSAGE=pong
```

### 4. Seed the Database

Populate the database with sample data:

```bash
pnpm seed
```

This creates:
- 5 sample users
- Follow relationships
- Sample posts
- Sample comments
- Sample messages

**Demo Credentials:**
- Email: `alex@example.com`
- Password: `password123`

(See `seed/seed.ts` for other user credentials)

### 5. Start Development Server

```bash
pnpm dev
```

The application will be available at: **http://localhost:3000**

## 📱 Application Features

### ✅ Authentication
- User registration with email validation
- Secure JWT-based login
- Token persistence in localStorage
- Protected routes

### 👤 User Profiles
- View and edit your profile
- Profile pictures from DiceBear API
- Custom bio
- Follow/Unfollow users
- View followers and following lists

### 📝 Posts
- Create posts with text and images
- Edit and delete your own posts
- Like/Unlike posts
- Add comments to posts
- View feed of posts from following users

### 💬 Real-Time Chat
- One-to-one private messaging
- Real-time updates with Socket.io
- Online/Offline status
- Message history
- Conversation list

### 🎨 Modern UI
- Dark theme by default
- Vibrant neon colors (purple, pink, cyan)
- Responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Glassmorphism effects

## 🏗️ Project Structure

```
.
├── backend/
│   ├── models/              # MongoDB models (User, Post, Comment, Message)
│   ├── controllers/         # Route controllers (auth, user, post, etc.)
│   ├── routes/              # API routes
│   ├── middleware/          # Auth middleware
│   ├── config/              # Database configuration
│   ├── socket/              # Socket.io handlers
│   └── server.js            # Main server file
├── client/
│   ├── pages/               # Route pages (Login, Register, Feed, Profile, Chat)
│   ├── components/          # Reusable components (Navigation, Post, etc.)
│   ├── services/            # API and Socket.io services
│   ├── context/             # Auth context
│   ├── App.tsx              # Main app component with routing
│   └── global.css           # Global styles and theme
├── seed/                    # Database seeding script
└── package.json             # Project dependencies
```

## 🔧 Available Scripts

```bash
# Start development server (runs both client and server)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Seed database with sample data
pnpm seed

# Run tests
pnpm test

# Type check
pnpm typecheck

# Format code
pnpm format.fix
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/profile` - Get current user profile
- `GET /api/users/all` - Get all users
- `GET /api/users/:userId` - Get specific user
- `PUT /api/users/update` - Update profile
- `GET /api/users/:userId/followers` - Get user's followers
- `GET /api/users/:userId/following` - Get user's following list

### Follow System
- `POST /api/follow/:userId/follow` - Follow user
- `POST /api/follow/:userId/unfollow` - Unfollow user

### Posts
- `POST /api/posts` - Create post
- `GET /api/posts/feed` - Get user's feed
- `GET /api/posts/:postId` - Get specific post
- `PUT /api/posts/:postId` - Update post
- `DELETE /api/posts/:postId` - Delete post
- `POST /api/posts/:postId/like` - Like/Unlike post
- `GET /api/posts/user/:userId` - Get user's posts

### Comments
- `POST /api/posts/:postId/comments` - Add comment
- `GET /api/posts/:postId/comments` - Get post comments
- `DELETE /api/posts/comment/:commentId` - Delete comment

### Messages
- `POST /api/messages/send` - Send message
- `GET /api/messages/with/:userId` - Get messages with user
- `GET /api/messages/conversations` - Get all conversations

## 🔐 Security Features

- JWT authentication with 7-day expiration
- bcrypt password hashing
- Protected routes with AuthMiddleware
- CORS enabled
- Input validation
- Secure token storage in localStorage

## 🌐 Database Models

### User
```typescript
{
  name: string
  username: string (unique)
  email: string (unique)
  password: string (hashed)
  bio: string
  profilePic: string
  followers: ObjectId[]
  following: ObjectId[]
  createdAt: Date
}
```

### Post
```typescript
{
  userId: ObjectId (ref: User)
  content: string
  image: string
  likes: ObjectId[] (ref: User)
  commentsCount: number
  createdAt: Date
}
```

### Comment
```typescript
{
  postId: ObjectId (ref: Post)
  userId: ObjectId (ref: User)
  text: string
  createdAt: Date
}
```

### Message
```typescript
{
  senderId: ObjectId (ref: User)
  receiverId: ObjectId (ref: User)
  message: string
  createdAt: Date
}
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check the connection string in `.env`
- Verify port 27017 is not blocked

### Port Already in Use
- Change PORT in `.env` file
- Or kill the process: `lsof -ti:3000 | xargs kill -9` (macOS/Linux)

### Socket.io Connection Issues
- Clear browser cache and refresh
- Check browser console for errors
- Ensure Socket.io client and server versions match

### Build Errors
- Delete `node_modules` and `.pnpm-lock.yaml`
- Run `pnpm install` again
- Run `pnpm typecheck` to find issues

## 📦 Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite for fast development
- React Router 6 for navigation
- Tailwind CSS 3 for styling
- Socket.io-client for real-time chat
- Axios for API calls
- Lucide React for icons
- Sonner for toast notifications

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- Socket.io for real-time communication
- Zod for validation

## 🎯 Next Steps / Future Enhancements

- [ ] Image upload to cloud storage (AWS S3, Cloudinary)
- [ ] Search functionality
- [ ] User notifications
- [ ] Post shares and retweets
- [ ] User mentions and hashtags
- [ ] Direct message typing indicators
- [ ] Post bookmarks/saves
- [ ] User recommendations algorithm
- [ ] Trending posts/hashtags
- [ ] Dark/Light theme toggle

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Support

For issues or questions, please check the documentation or contact the development team.

---

**Happy coding! 🚀**
