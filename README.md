# Auth.js v5 with Google OAuth and MongoDB Tutorial

This repository contains the complete code implementation for my Medium article demonstrating how to build a secure authentication system in Next.js applications using Auth.js v5 (formerly NextAuth.js) with Google OAuth and MongoDB integration.

## Features

- **Auth.js v5 Integration**: A comprehensive authentication system built specifically for Next.js App Router, leveraging the latest features of Auth.js version 5
- **Google OAuth Authentication**: Seamless social login with Google, allowing users to authenticate without creating new credentials
- **MongoDB Adapter**: Persistent user sessions and account data storage in MongoDB, providing scalable and reliable data management
- **Route Protection**: Advanced middleware implementation for securing private routes in Next.js, with customizable redirect behavior
- **Complete Authentication Flow**: End-to-end authentication lifecycle handling with sign-in, sign-out, and session management

## Project Structure

- `auth.config.ts`: Base Auth.js configuration with provider settings and session strategies
- `auth.ts`: Main Auth.js setup that integrates Google provider and MongoDB adapter for persistent authentication
- `middleware.ts`: Next.js middleware implementation that handles route protection and redirection logic
- `lib/db.ts`: MongoDB connection utility that establishes and manages the database connection
- `app/login/page.tsx`: Client-side implementation of the sign-in page with Google authentication button
- `app/dashboard/page.tsx`: Protected dashboard page with sign-out functionality, only accessible to authenticated users
- `app/api/auth/[...nextauth]/route.ts`: Auth.js API route handlers for authentication callbacks and session management

## Getting Started

### Prerequisites

- Node.js and npm/pnpm
- MongoDB database (Atlas or local)
- Google OAuth credentials (Client ID and Client Secret)

### Installation

1. Clone the repository

```bash
git clone https://github.com/fcendesu/authjs-v5-oauth-middleware
cd authjs-v5-oauth-middleware
```

2. Install dependencies

```bash
pnpm install
# or
npm install
```

3. Create a `.env.local` file with the following variables:

```
# Auth.js secret - you can generate one with `openssl rand -base64 32`
AUTH_SECRET=your_auth_secret_here

# Google OAuth credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# MongoDB connection string
MONGODB_URI=your_mongodb_connection_string
```

4. Start the development server

```bash
pnpm dev
# or
npm run dev
```

5. Visit `http://localhost:3000` in your browser

## How It Works

### Authentication Setup

The project uses Auth.js v5 with the MongoDB adapter to store user information. The configuration is set up in two parts for better separation of concerns:

1. **Base Configuration (`auth.config.ts`)**: Contains the basic authentication configuration settings that can be shared between auth and middleware components:

```typescript
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      return !!auth?.user;
    },
  },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;
```

2. **Main Auth Setup (`auth.ts`)**: Extends the base configuration with provider-specific settings and the MongoDB adapter:

```typescript
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(client),
  session: { strategy: "jwt" }, // Uses JSON Web Tokens for session management
  providers: [GitHub, Google], // Configures multiple OAuth providers
});
```

The MongoDB adapter connects to your database and automatically creates the necessary collections for storing:

- User accounts and profiles
- Account connections (OAuth providers linked to each user)
- Sessions (when using the database session strategy)
- Verification tokens

### Route Protection

Routes are protected using Next.js middleware that checks authentication status before allowing access to protected pages. The middleware implementation handles different scenarios:

```typescript
// Define which routes require authentication
const privateRoutes = ["/dashboard", "/deneme"];

// Initialize Auth.js middleware wrapper
const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  // Get authentication status from Auth.js
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;
  const isLoginRoute = nextUrl.pathname.startsWith("/login");

  // Redirect authenticated users away from login page
  if (isLoggedIn && isLoginRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Redirect unauthenticated users away from protected pages
  if (
    !isLoggedIn &&
    privateRoutes.some((route) => nextUrl.pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
});

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/dashboard/:path*",
    "/login",
  ],
};
```

This middleware provides several key security features:

- **Authentication Verification**: Checks if the user is logged in before allowing access to protected routes
- **Smart Redirection**: Redirects users based on their authentication status and current location
- **Configurable Protected Routes**: Easily add or remove routes that require authentication
- **Performance Optimization**: Uses path matchers to only run the middleware on relevant routes

### Sign In/Sign Out Implementation

The application implements Google authentication with simple UI components:

- **Sign In**: Using the Google provider on the login page

```typescript
// In login/page.tsx
"use client";
import { signIn } from "next-auth/react";

function SignIn() {
  return (
    <button onClick={() => signIn("google", { redirectTo: "/dashboard" })}>
      Sign In Google
    </button>
  );
}

export default SignIn;
```

- **Sign Out**: Simple sign out with redirect on the dashboard

```typescript
// In dashboard/page.tsx
"use client";
import { signOut } from "next-auth/react";

function Dashboard() {
  return <button onClick={() => signOut({ redirectTo: "/" })}>Sign Out</button>;
}

export default Dashboard;
```

The authentication flow works as follows:

1. **Sign In Process**:

   - User clicks the "Sign In Google" button
   - Auth.js redirects to Google's OAuth consent screen
   - User authorizes the application
   - Google redirects back to your callback URL with an authorization code
   - Auth.js exchanges the code for access and ID tokens
   - User information is extracted and stored in MongoDB
   - A session is created (using JWT strategy as configured)
   - User is redirected to the dashboard

2. **Session Management**:

   - JWT-based sessions are stored in cookies
   - Middleware validates these tokens on protected routes
   - Sessions expire based on the configured lifetime

3. **Sign Out Process**:
   - User clicks the "Sign Out" button
   - Auth.js clears the session token
   - User is redirected to the home page

## Deployment

This project can be deployed on platforms like Vercel or Netlify that support Next.js applications. Make sure to set the environment variables in your deployment platform.

## Learn More

For more details on how this authentication system works, check out my Medium article: [Link to your Medium article]

## Additional Resources

- [Auth.js Documentation](https://authjs.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://www.mongodb.com/docs/)

## License

MIT
