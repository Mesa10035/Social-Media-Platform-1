import "dotenv/config";
import mongoose from "mongoose";
import User from "../server/models/User";
import Post from "../server/models/Post";
import Comment from "../server/models/Comment";
import Message from "../server/models/Message";

async function seed() {
  try {
    const mongoURI =
      process.env.MONGODB_URI ||
      "mongodb://127.0.0.1:27017/social_media_platform";
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");

    // Clear collections
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    await Message.deleteMany({});
    console.log("Collections cleared");

    // Create sample users
    const sampleUsers = [
      {
        name: "Alex Johnson",
        username: "alexjohnson",
        email: "alex@example.com",
        password: "password123",
        bio: "Tech enthusiast and developer 💻",
        profilePic:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
      },
      {
        name: "Sarah Smith",
        username: "sarahsmith",
        email: "sarah@example.com",
        password: "password123",
        bio: "Designer & creative thinker ✨",
        profilePic:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      },
      {
        name: "Mike Chen",
        username: "mikechen",
        email: "mike@example.com",
        password: "password123",
        bio: "Product manager & startup lover 🚀",
        profilePic:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
      },
      {
        name: "Emma Wilson",
        username: "emmawilson",
        email: "emma@example.com",
        password: "password123",
        bio: "Digital marketer & content creator 📱",
        profilePic:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
      },
      {
        name: "David Brown",
        username: "davidbrown",
        email: "david@example.com",
        password: "password123",
        bio: "Full-stack developer & open source advocate",
        profilePic:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
      },
    ];

    const users = await User.insertMany(sampleUsers);
    console.log("Sample users created:", users.length);

    // Create follow relationships
    users[0].following = [users[1]._id, users[2]._id];
    users[0].followers = [users[3]._id];

    users[1].following = [users[0]._id, users[3]._id];
    users[1].followers = [users[0]._id];

    users[2].following = [users[0]._id];
    users[2].followers = [users[0]._id];

    users[3].following = [users[1]._id, users[4]._id];
    users[3].followers = [users[0]._id];

    users[4].following = [users[0]._id, users[1]._id];
    users[4].followers = [users[3]._id];

    await Promise.all(users.map((user) => user.save()));
    console.log("Follow relationships created");

    // Create sample posts
    const samplePosts = [
      {
        userId: users[0]._id,
        content:
          "Just launched my new portfolio website! Check it out and let me know what you think 🚀",
        image: "",
        likes: [users[1]._id, users[3]._id],
        commentsCount: 0,
      },
      {
        userId: users[1]._id,
        content: "Design is not just how it looks, but how it works 🎨",
        image: "",
        likes: [users[0]._id, users[2]._id, users[4]._id],
        commentsCount: 0,
      },
      {
        userId: users[2]._id,
        content:
          "Excited to announce that we've reached 1 million users! Thanks to everyone who supported us 🙏",
        image: "",
        likes: [users[0]._id, users[1]._id, users[3]._id, users[4]._id],
        commentsCount: 0,
      },
      {
        userId: users[3]._id,
        content: "New blog post on digital marketing trends for 2024 📊",
        image: "",
        likes: [users[1]._id, users[4]._id],
        commentsCount: 0,
      },
      {
        userId: users[4]._id,
        content:
          "Contributing to open source is the best way to learn! #OpenSource #Dev",
        image: "",
        likes: [users[0]._id, users[2]._id],
        commentsCount: 0,
      },
    ];

    const posts = await Post.insertMany(samplePosts);
    console.log("Sample posts created:", posts.length);

    // Create sample comments
    const sampleComments = [
      {
        postId: posts[0]._id,
        userId: users[1]._id,
        text: "Looks amazing! I love the design 😍",
      },
      {
        postId: posts[1]._id,
        userId: users[0]._id,
        text: "Totally agree with this!",
      },
      {
        postId: posts[2]._id,
        userId: users[4]._id,
        text: "Congratulations on the milestone! 🎉",
      },
      {
        postId: posts[2]._id,
        userId: users[0]._id,
        text: "This is incredible news!",
      },
      {
        postId: posts[3]._id,
        userId: users[1]._id,
        text: "Great insights! Really helpful for my upcoming campaign.",
      },
    ];

    const comments = await Comment.insertMany(sampleComments);
    console.log("Sample comments created:", comments.length);

    // Update posts with comment counts
    posts[0].commentsCount = 1;
    posts[1].commentsCount = 1;
    posts[2].commentsCount = 2;
    posts[3].commentsCount = 1;

    await Promise.all(posts.map((post) => post.save()));

    // Create sample messages
    const sampleMessages = [
      {
        senderId: users[0]._id,
        receiverId: users[1]._id,
        message: "Hey! How are you doing? 👋",
      },
      {
        senderId: users[1]._id,
        receiverId: users[0]._id,
        message: "I'm doing great! How about you?",
      },
      {
        senderId: users[0]._id,
        receiverId: users[1]._id,
        message: "Pretty good! Want to grab coffee this weekend?",
      },
      {
        senderId: users[2]._id,
        receiverId: users[0]._id,
        message: "Hey, I saw your new portfolio. It looks awesome! 🔥",
      },
      {
        senderId: users[3]._id,
        receiverId: users[1]._id,
        message: "Let's collaborate on a project!",
      },
    ];

    const messages = await Message.insertMany(sampleMessages);
    console.log("Sample messages created:", messages.length);

    console.log("\n✅ Database seeding completed successfully!");
    console.log(`📊 Created:`);
    console.log(`   - ${users.length} users`);
    console.log(`   - ${posts.length} posts`);
    console.log(`   - ${comments.length} comments`);
    console.log(`   - ${messages.length} messages`);

    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
