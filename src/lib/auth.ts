import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../../drizzle"; // your drizzle instance
import { reactStartCookies } from "better-auth/react-start";
import { schema, session } from "../../drizzle/db/schema";

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
  trustedOrigins: [
    "http://localhost:3000", 
    ...(process.env.BETTER_AUTH_URL ? [`https://${process.env.BETTER_AUTH_URL}`] : [])
  ],
  user: {
    model: schema.user,
    sessionModel: schema.session,
    changeEmail: {
      enabled: false,
      // async sendVerification(data, request) {
      //   // Send an email to the user with a link to verify their new email address
      //   await sendEmail({
      //     to: data.newEmail,
      //     subject: "Verify your new email address",
      //     text: `Click the link to verify your new email address: ${data.url}`,
      //     html: `<p>Click the link to verify your new email address: <a href="${data.url}">${data.url}</a></p>`,
      //   });
    },
    deleteUser: {
      enabled: true,
      cascade: true,
      callbackURL: "/",
    },
    additionalFields: {
      bio: {
        type: "string",
        required: false,
        defaultValue: "",
        input: true,
      },
      location: {
        type: "string",
        required: false,
        defaultValue: "",
        input: true,
      },
      phone: {
        type: "string",
        required: false,
        defaultValue: "",
        input: true,
      },
      role: {
        type: "string",
        required: true,
        defaultValue: "New User",
        input: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true, // Enable email and password authentication
    autoSignIn: false, // Automatically sign in the user after sign up
    async sendResetPassword(_data, _request) {
      // Send an email to the user with a link to reset their password
    },

    onPasswordReset: async ({ user }, _request) => {
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
      model: session,
      cookieCache: {
        enabled: true,
        maxAge: 10 * 60,
      },
    },
  },
  plugins: [
    reactStartCookies(),
  ], // make sure this is the last plugin in the array
});