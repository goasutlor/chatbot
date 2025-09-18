# Ko Chatbot - Multi-LLM Chat Interface

A modern web application that allows users to chat with multiple AI models including ChatGPT, Gemini, Claude, and Perplexity. Users can sign in with Google and choose between auto-selection or manual selection of AI models.

## Features

- 🔐 **Google OAuth Authentication** - Secure login with Google accounts
- 🤖 **Multiple AI Models** - Support for ChatGPT, Gemini, Claude, and Perplexity
- ⚡ **Auto/Manual Mode** - Let the system choose or manually select AI models
- 💬 **Real-time Chat** - Streaming responses for better user experience
- 🎨 **Modern UI** - Clean, responsive design with orange-gray theme
- 🔑 **API Key Management** - Users can provide their own API keys
- 💾 **User Preferences** - Persistent settings and chat history

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: Prisma with SQLite
- **AI Models**: OpenAI, Google AI, Anthropic, Perplexity
- **Styling**: Tailwind CSS with custom orange-gray theme

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google OAuth credentials
- API keys for AI services (optional - users can provide their own)

### Quick Installation

**One-command setup:**
```bash
npm run setup
```

This will:
- Install all dependencies
- Create `.env.local` from template
- Set up the database
- Generate Prisma client

**Manual Installation:**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ko-chatbot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in the following variables in `.env.local`:
   ```env
   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # Database
   DATABASE_URL="file:./dev.db"
   
   # LLM API Keys (Optional - users can provide their own)
   OPENAI_API_KEY=your-openai-key
   GOOGLE_AI_API_KEY=your-google-ai-key
   ANTHROPIC_API_KEY=your-anthropic-key
   PERPLEXITY_API_KEY=your-perplexity-key
   ```

4. **Set up the database**
   ```bash
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials
5. Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs
6. Copy the Client ID and Client Secret to your `.env.local` file

## API Keys Setup

### OpenAI (ChatGPT)
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an API key
3. Add it to your `.env.local` file or enter it in the app settings

### Google AI (Gemini)
1. Go to [Google AI Studio](https://makersuite.google.com/)
2. Create an API key
3. Add it to your `.env.local` file or enter it in the app settings

### Anthropic (Claude)
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create an API key
3. Add it to your `.env.local` file or enter it in the app settings

### Perplexity
1. Go to [Perplexity AI](https://www.perplexity.ai/settings/api)
2. Create an API key
3. Add it to your `.env.local` file or enter it in the app settings

## Usage

1. **Sign In**: Click "Sign in with Google" to authenticate
2. **Choose Mode**: 
   - **Auto Mode**: The system randomly selects an AI model for each message
   - **Manual Mode**: You choose which AI model to use
3. **Set API Keys**: Click the settings icon to enter your API keys
4. **Start Chatting**: Type your message and press Enter or click Send

## Features in Detail

### Auto Mode
- Randomly selects from available AI models
- Provides variety in responses
- No need to manually choose models

### Manual Mode
- Choose specific AI models for each conversation
- Compare responses from different models
- Full control over which AI to use

### API Key Management
- Users can provide their own API keys
- Keys are stored securely in the database
- Fallback to server-side keys if user keys not provided

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
- Railway
- Render
- DigitalOcean App Platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
