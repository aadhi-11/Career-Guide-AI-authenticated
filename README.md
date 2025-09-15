# Career Guide AI

An AI-powered web application that provides personalized career advice, answers career questions, and suggests next steps. Built with Next.js, TypeScript, and modern web technologies, it offers an interactive chat interface with secure authentication and server-side AI integration.

## 🌐 Live Application

**🔗 [https://career-guide-ai-authenticated-zfqo.vercel.app/](https://career-guide-ai-authenticated-zfqo.vercel.app/)**

Experience the full application with AI-powered career guidance, user authentication, and interactive chat sessions.

## 🚀 Features

- **AI-Powered Career Guidance**: Get personalized career advice using advanced AI models
- **Interactive Chat Interface**: Seamless conversation experience with message history
- **User Authentication**: Secure login/signup with Clerk authentication
- **Session Management**: Create, manage, and delete chat sessions
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Real-time Updates**: Instant message delivery and status indicators
- **Database Integration**: Persistent storage with Prisma and PostgreSQL
- **Type-Safe API**: Full TypeScript support with tRPC for type-safe API calls

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **React Query** - Data fetching and caching

### Backend
- **tRPC** - End-to-end typesafe APIs
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **Clerk** - Authentication and user management

### AI Integration
- **Cohere API** - AI language model for career guidance
- **Gemini AI** - Alternative AI model support

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **pnpm** - Package manager

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ 
- pnpm (recommended) or npm
- PostgreSQL database
- Clerk account for authentication
- Cohere API key for AI functionality

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/career-guide-ai.git
cd career-guide-ai
```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/career_guide_ai"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# AI Services
COHERE_API_KEY=your_cohere_api_key
GEMINI_API_KEY=your_gemini_api_key

# Next.js
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### 4. Database Setup

```bash
# Generate Prisma client
pnpm prisma generate

# Run database migrations
pnpm prisma db push

# Seed the database (optional)
pnpm prisma db seed
```

### 5. Run the Development Server

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── chat/          # Chat API endpoints
│   │   └── trpc/          # tRPC API routes
│   ├── chat/              # Chat pages
│   │   ├── [sessionId]/   # Individual chat session
│   │   ├── layout.tsx     # Chat layout with sidebar
│   │   └── page.tsx       # Chat home page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # Reusable components
│   ├── ui/               # UI components
│   └── theme-toggle.tsx  # Theme switcher
├── lib/                  # Utility libraries
│   ├── prisma.ts         # Database client
│   ├── trpc.ts           # tRPC configuration
│   ├── trpc-router.ts    # API routes
│   ├── cohere-ai.ts      # Cohere AI integration
│   ├── gemini-ai.ts      # Gemini AI integration
│   └── utils.ts          # Utility functions
└── middleware.ts         # Next.js middleware
```

## 🔧 Configuration

### Clerk Authentication Setup

1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy your publishable key and secret key
4. Add them to your `.env.local` file

### Database Configuration

1. Set up a PostgreSQL database
2. Update the `DATABASE_URL` in your `.env.local` file
3. Run `pnpm prisma db push` to create tables

### AI Service Setup

#### Cohere API
1. Sign up at [cohere.ai](https://cohere.ai)
2. Get your API key from the dashboard
3. Add it to your `.env.local` file

#### Gemini AI (Optional)
1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add it to your `.env.local` file

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/career-guide-ai)

### Environment Variables for Production

Make sure to set these in your deployment platform:

```env
DATABASE_URL=your_production_database_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_production_clerk_key
CLERK_SECRET_KEY=your_production_clerk_secret
COHERE_API_KEY=your_cohere_api_key
GEMINI_API_KEY=your_gemini_api_key
NEXTAUTH_SECRET=your_production_secret
NEXTAUTH_URL=https://your-domain.com
```

## 📖 API Documentation

### tRPC Procedures

#### Protected Procedures (Require Authentication)
- `getSessions` - Get user's chat sessions with pagination
- `getSession` - Get specific session by ID
- `createSession` - Create new chat session
- `deleteSession` - Delete a session

#### Public Procedures
- `addMessage` - Add message to a session
- `updateSessionTitle` - Update session title

### Example Usage

```typescript
// Get user sessions
const { data: sessions } = trpc.getSessions.useQuery({
  page: 1,
  limit: 10
});

// Create new session
const createSession = trpc.createSession.useMutation();
createSession.mutate({ title: "Career Planning" });

// Add message
const addMessage = trpc.addMessage.useMutation();
addMessage.mutate({
  sessionId: "session-id",
  content: "I need career advice",
  role: "user"
});
```

## 🎨 Customization

### Styling
- Modify `src/app/globals.css` for global styles
- Update Tailwind configuration in `tailwind.config.js`
- Customize theme colors and components

### AI Models
- Switch between Cohere and Gemini in `src/lib/`
- Modify AI prompts and parameters
- Add new AI providers

### Authentication
- Customize Clerk components and styling
- Modify user roles and permissions
- Add additional user fields

## 🧪 Testing

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

If you have any questions or need help:

- Create an issue on GitHub
- Check the documentation
- Join our community discussions

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Clerk](https://clerk.com/) for authentication
- [Cohere](https://cohere.ai/) for AI capabilities
- [Prisma](https://prisma.io/) for database management
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 📊 Roadmap

- [ ] Multi-language support
- [ ] Advanced career assessment tools
- [ ] Integration with job boards
- [ ] Resume builder
- [ ] Interview preparation features
- [ ] Career path visualization
- [ ] Mentorship matching
- [ ] Skills gap analysis

---

Made with ❤️ by [Your Name](https://github.com/yourusername)