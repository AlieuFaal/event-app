import { betterAuth, Session } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../../drizzle"; // your drizzle instance
import { reactStartCookies } from "better-auth/react-start";
import { sendEmail } from "./emailSender"; // your email sending function
import { schema, session } from "../../drizzle/db/schema";
import { customSession } from "better-auth/plugins";
import { findUserRoles, getUserDataById } from "./user";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true, // Enable email and password authentication
    autoSignIn: false, // Automatically sign in the user after sign up
    async sendResetPassword(data, request) {
      // Send an email to the user with a link to reset their password
    },
    
    onPasswordReset: async ({ user }, request) => {
      // logic here
      console.log(`Password reset for user: ${user.email}`);
    },
  },
  socialProviders: {
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID as string, // Your Facebook OAuth app
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string, // Your Facebook OAuth app
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string, // Your Google OAuth app
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, // Your Google OAuth app
    },
    twitter: {
      clientId: process.env.TWITTER_CLIENT_ID as string, // Your Twitter OAuth app
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string, // Your Twitter OAuth app
    },
    apple: {
      clientId: process.env.APPLE_CLIENT_ID as string, // Your Apple OAuth app
      clientSecret: process.env.APPLE_CLIENT_SECRET as string, // Your Apple OAuth app
    },
  },
  secret: process.env.BETTER_AUTH_SECRET as string, // set this to a long random string in production
  baseURL: process.env.BETTER_AUTH_URL as string, // The base URL of your app
  advanced: {
    database: {
      generateId: () => crypto.randomUUID(),
    },
    cookies: {
      sessionToken: {
        name: "event_app_session_token", // Custom cookie name
        attributes: {},
      },
    },
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 10 * 60,
      },
    },
  },
  plugins: [
    customSession(async ({ user, session }) => {
      const roles = await findUserRoles(session.userId);
      return {
        user: {
          ...user,
          role: roles.includes("artist") ? "artist" : "user",
        },
        session,
      };
    }),
    reactStartCookies(),
  ], // make sure this is the last plugin in the array
});



