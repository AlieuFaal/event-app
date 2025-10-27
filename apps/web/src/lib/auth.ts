// import { betterAuth } from "better-auth";
// import { drizzleAdapter } from "better-auth/adapters/drizzle";
// import { db } from "../../drizzle"; // your drizzle instance
// import { reactStartCookies } from "better-auth/react-start";
// import { schema, session } from "../../drizzle/db/schema";
// import { Resend } from "resend";

// const resend = new Resend(process.env.VITE_PUBLIC_RESEND_API_KEY);

// export const auth = betterAuth({
//   database: drizzleAdapter(db, {
//     provider: "pg", // or "mysql", "sqlite"
//     schema: {
//       user: schema.user,
//       session: schema.session,
//       account: schema.account,
//       verification: schema.verification,
//     },
//   }),
//   trustedOrigins: [
//     "http://localhost:3000",
//     ...(process.env.BETTER_AUTH_URL
//       ? [`https://${process.env.BETTER_AUTH_URL}`]
//       : []),
//   ],
//   user: {
//     model: schema.user,
//     sessionModel: schema.session,
//     changeEmail: {
//       enabled: false,
//     },
//     deleteUser: {
//       enabled: true,
//       cascade: true,
//       callbackURL: "/",
//     },
//     additionalFields: {
//       bio: {
//         type: "string",
//         required: false,
//         defaultValue: "",
//         input: true,
//       },
//       location: {
//         type: "string",
//         required: false,
//         defaultValue: "",
//         input: true,
//       },
//       phone: {
//         type: "string",
//         required: false,
//         defaultValue: "",
//         input: true,
//       },
//       role: {
//         type: "string",
//         required: true,
//         defaultValue: "New User",
//         input: false,
//       },
//     },
//   },
//   emailVerification: {
//     sendVerificationEmail: async ({ user, url, token }, request) => {
//       const { data, error } = await resend.emails.send({
//         from: "VibeSpot <onboarding@resend.dev",
//         to: user.email,
//         subject: "Verify your email",
//         html: `Click the link to verify your email: ${url}`,
//       });

//       if (error) {
//         console.error("Error sending verification email:", error);
//       } else {
//         console.log("Verification email sent:", data);
//       }
//     },
//   },
//   emailAndPassword: {
//     enabled: true, // Enable email and password authentication
//     autoSignIn: false, // Automatically sign in the user after sign up
//   },
//   socialProviders: {
//     facebook: {
//       clientId: process.env.FACEBOOK_CLIENT_ID as string, // Your Facebook OAuth app
//       clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string, // Your Facebook OAuth app
//     },
//     google: {
//       clientId: process.env.GOOGLE_CLIENT_ID as string, // Your Google OAuth app
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, // Your Google OAuth app
//     },
//     twitter: {
//       clientId: process.env.TWITTER_CLIENT_ID as string, // Your Twitter OAuth app
//       clientSecret: process.env.TWITTER_CLIENT_SECRET as string, // Your Twitter OAuth app
//     },
//     apple: {
//       clientId: process.env.APPLE_CLIENT_ID as string, // Your Apple OAuth app
//       clientSecret: process.env.APPLE_CLIENT_SECRET as string, // Your Apple OAuth app
//     },
//   },
//   secret: process.env.BETTER_AUTH_SECRET as string, // set this to a long random string in production
//   baseURL: process.env.BETTER_AUTH_URL as string, // The base URL of your app
//   advanced: {
//     database: {
//       generateId: () => crypto.randomUUID(),
//     },
//     cookies: {
//       sessionToken: {
//         name: "event_app_session_token", // Custom cookie name
//         attributes: {},
//       },
//     },
//     session: {
//       model: session,
//       cookieCache: {
//         enabled: true,
//         maxAge: 10 * 60,
//       },
//     },
//   },
//   plugins: [reactStartCookies()], // make sure this is the last plugin in the array
// });
