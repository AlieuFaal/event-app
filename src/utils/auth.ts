import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../../drizzle"; // your drizzle instance
import { reactStartCookies } from "better-auth/react-start";
 
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
    }),
    emailAndPassword: {
        enabled: true, // Enable email and password authentication
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string, // Your GitHub OAuth app
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string, // Your GitHub OAuth app secret
        },
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
        linkedin: {
            clientId: process.env.LINKEDIN_CLIENT_ID as string, // Your LinkedIn OAuth app
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string, // Your LinkedIn OAuth app
        },
    },
    secret: process.env.BETTER_AUTH_SECRET as string, // set this to a long random string in production
    baseURL: process.env.BETTER_AUTH_URL as string, // The base URL of your app
    plugins: [reactStartCookies()], // make sure this is the last plugin in the array
});