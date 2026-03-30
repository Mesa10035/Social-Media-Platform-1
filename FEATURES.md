# SocialHub - Complete Feature Guide

A modern, full-stack social media platform with real-time messaging, following system, and interactive post feeds.

## 🎯 Core Features

### 🔐 Authentication System
- **Register** - Create new account with name, username, email, password
- **Login** - Secure login with JWT token system
- **Token Persistence** - Tokens stored in localStorage for session management
- **Protected Routes** - All main features require authentication
- **Auto Logout** - Logout button available in navigation

**Demo Account:**
- Email: `alex@example.com`
- Password: `password123`

---

## 👥 User Profiles

### View Profiles
- Click on any user's profile picture or name to view their profile
- See user's bio, follower count, and following count
- View all posts from that user

### Edit Your Profile
- Click "Edit Profile" on your own profile
- Update: Name, Bio, Profile Picture URL
- Changes save immediately
- Profile updates reflect everywhere on the platform

### Profile Information
- **Name** - User's full name
- **Username** - Unique username (used with @ mention)
- **Bio** - Short biography/about section
- **Profile Picture** - Avatar image from URL
- **Followers/Following** - Lists of connections

---

## 🔗 Follow System

### Follow Users
- Click "Follow" button on any user's profile
- Button changes to "Following" when active
- Unfollow by clicking "Following" button
- Followed users' posts appear in your feed

### Suggested Users
- Right sidebar shows "Suggested Users"
- Shows users you haven't followed yet
- Click "Follow" button to add them
- List updates as you follow more people
- View button opens their full profile

### Followers/Following Lists
- View list of followers on user profile
- See who users are following
- Click any user to visit their profile

---

## 📝 Posts System

### Create Posts
- Click on "What's on your mind?" input on Feed page
- Type post content (required)
- Optionally add image URL
- Click "Post" button to publish
- Post appears at top of feed

### Post Features
- **Content** - Main text of the post
- **Images** - Optional image URL support
- **Timestamp** - Shows when post was created (e.g., "2m ago", "1h ago")
- **Statistics** - Shows like count and comment count

### Post Actions

#### Like Posts
- Click **Like** button on any post
- Button turns pink when liked
- Click again to unlike
- Like count updates in real-time
- Only your likes count toward like total

#### Comment on Posts
- Click **Comment** button to open comment section
- Type your comment in the input field
- Click **Send** (→) button to post comment
- Your comment appears immediately
- Shows comment count on post

#### Delete Comments
- Hover over your own comments
- Click red trash icon to delete
- Only post owner can delete their comments

#### Share Posts
- Click **Share** button
- Post link and content copy to clipboard
- Share via any messaging app or social platform

### Your Posts
- Delete your own posts using trash icon
- Only you can delete your posts
- Edit functionality available (click more options)

---

## 💬 Real-Time Chat (WhatsApp Style)

### Chat Interface
- **Left Sidebar** - List of conversations and contacts
- **Chat Window** - Message thread with selected user
- **Message Input** - Type and send messages with images
- **Online Status** - Green dot shows if user is online

### Messaging Features

#### Send Messages
- Type message in input field at bottom
- Click send button (paper plane icon) or press Enter
- Messages appear on right side (your messages)
- Received messages appear on left side
- Messages show timestamp

#### Message Types
- **Text Messages** - Send text-only messages
- **With Images** - Send messages with image URLs
- **Image Preview** - Images display in message bubbles

#### Message History
- View all past messages with a user
- Scroll up to see older messages
- Messages persistent in database
- Organized by conversation

#### Conversations List
- Shows all active conversations
- Most recent message preview
- Click to open conversation
- Search feature to find contacts

#### Online Indicator
- Green circle shows user is online now
- Red/no circle shows user offline
- Updates in real-time with Socket.io

### Add Images to Messages
- Click image icon in message input
- Paste image URL
- Image preview shows before sending
- Send message with image
- Image displays in chat bubble

### Start New Conversation
- Use search to find users
- Search by name or username
- Click user to start chatting
- Opens new conversation

---

## 🏠 Feed Page

### Feed Layout
- **Left Section** - Post creation and feed
- **Right Section** - Suggested users (desktop only)

### Feed Content
- Shows posts from users you follow
- Shows your own posts
- Sorted by newest first
- Real-time updates

### Feed Interactions
- Like posts
- Comment on posts
- Share posts
- Follow/unfollow from post
- View user profiles

### Suggested Users Sidebar
- Shows 5 most relevant suggestions
- Follow directly from sidebar
- Click to view full profile
- Updates as you follow more users

---

## 🌟 UI/UX Features

### Dark Theme
- Professional dark theme by default
- Reduced eye strain
- Modern appearance
- Consistent across all pages

### Gradient Design
- Purple to pink gradient buttons
- Neon cyan accents
- Gradient text on headers
- Smooth visual transitions

### Animations
- Fade-in animations on load
- Slide-up animations on new content
- Hover effects on buttons
- Smooth transitions throughout

### Responsive Design
- **Mobile** - Full functionality on phones
- **Tablet** - Optimized for tablets
- **Desktop** - Full sidebar layout with suggestions
- All features work on all screen sizes

### Notifications (Toast)
- Success messages for actions
- Error messages with details
- Auto-dismiss after 3 seconds
- Non-intrusive at top of screen

---

## 📱 Mobile Experience

### Mobile Navigation
- Hamburger menu for desktop navigation
- Bottom-to-top navigation accessible
- All features fully functional
- Chat optimized for mobile with swipe

### Mobile Chat
- Full-screen chat view on phones
- Swipe to go back to conversations
- Message bubbles sized for mobile
- Image preview on mobile

---

## 🔔 Real-Time Updates

### Socket.io Features
- Messages appear instantly without reload
- Online status updates in real-time
- No delay between users
- Automatic reconnection on disconnect

### Live Updates
- New messages from other users appear immediately
- Online/offline status changes instantly
- You see who's typing (if implemented)
- Connection status shown

---

## 🚀 Getting Started

### First Time Setup
1. **Register** - Click "Sign up" and create account
2. **View Suggested Users** - Sidebar shows suggestions
3. **Follow Users** - Build your network
4. **Create Post** - Share your first post
5. **Chat** - Send message to someone
6. **Comment** - Engage with posts

### Navigate App
- **Feed** - Main timeline (home icon)
- **Chat** - Messages (chat icon)
- **Profile** - Your profile (user icon)
- **Logout** - Sign out (logout icon)

---

## 💡 Pro Tips

1. **Fast Following** - Follow users directly from suggestions
2. **Image URLs** - Use Unsplash, Pixabay for free images
3. **Direct Chat** - Click any user's profile to message them
4. **Search Chat** - Find old conversations quickly
5. **Online Check** - Green dot means they're available now
6. **Post Sharing** - Share post link in any platform
7. **Edit Profile** - Keep bio updated for engagement

---

## 🐛 Troubleshooting

### Messages Not Appearing
- Check MongoDB is running: `mongod`
- Refresh page
- Check browser console for errors

### Chat Not Updating in Real-Time
- Ensure Socket.io is connected
- Check browser console for connection errors
- Verify user is online

### Can't Follow User
- Refresh page
- Check internet connection
- Try again in a few seconds

### Comments Not Loading
- Refresh page
- Check if post exists
- Clear browser cache

---

## 📊 Database Models

All data persists in MongoDB locally at `mongodb://127.0.0.1:27017/social_media_platform`

**Users** - 100+ sample users with connections
**Posts** - Sample posts with likes and comments
**Messages** - Chat history between users
**Comments** - Nested under posts

---

## 🎨 Design Philosophy

- **Modern 2026 Style** - Latest design trends
- **Gen-Z Adaptive** - Trendy and fresh
- **Professional** - Clean and organized
- **Minimal** - Not cluttered
- **Stylish** - Visually appealing
- **Accessible** - Works everywhere

---

## 🔐 Security Features

- JWT token validation on all requests
- Password hashing with bcryptjs
- Protected API endpoints
- User authorization checks
- No sensitive data in localStorage (except token)
- CORS enabled for security

---

## 📈 Performance

- Fast page loads
- Optimized image loading
- Real-time Socket.io (no polling)
- Efficient database queries
- Lazy loading for posts
- Mobile optimized

---

## 🎓 API Endpoints Available

Users can access these through the frontend:

**Auth**
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login

**Users**
- `GET /api/users/profile` - Your profile
- `GET /api/users/all` - All users
- `GET /api/users/:userId` - User details
- `PUT /api/users/update` - Update profile

**Posts**
- `POST /api/posts` - Create post
- `GET /api/posts/feed` - Your feed
- `GET /api/posts/:postId` - Post details
- `POST /api/posts/:postId/like` - Like/unlike

**Comments**
- `POST /api/posts/:postId/comments` - Add comment
- `GET /api/posts/:postId/comments` - Get comments
- `DELETE /api/posts/comment/:commentId` - Delete

**Messages**
- `POST /api/messages/send` - Send message
- `GET /api/messages/with/:userId` - Chat history
- `GET /api/messages/conversations` - All chats

**Follow**
- `POST /api/follow/:userId/follow` - Follow
- `POST /api/follow/:userId/unfollow` - Unfollow

---

## 🎉 Enjoy Your Social Media Platform!

Everything is ready to use. Start by registering an account and exploring all the features!

For more technical details, see `SETUP.md`.
