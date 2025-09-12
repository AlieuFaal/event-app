import { betterAuth, Session } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../../drizzle"; // your drizzle instance
import { reactStartCookies } from "better-auth/react-start";
import { sendEmail } from "./emailSenderService"; // your email sending function
import { schema, session } from "../../drizzle/db/schema";
import { customSession } from "better-auth/plugins";
import { eq } from "drizzle-orm";

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
  user: {
    model: schema.user,
    sessionModel: schema.session,
    deleteUser: {
      enabled: true,
      cascade: true, // when a user is deleted, delete their sessions and accounts too
      callbackURL: "/", // redirect here after account deletion
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
        defaultValue: "user",
        input: false,
      },
    },
  },
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
      model: session,
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
    customSession(async ({ user, session }) => {
      const props = await findUserProps(session.userId);
      return {
        user: {
          ...user,
          location: props.location,
          bio: props.bio,
          phone: props.phone,
        },
        session,
      };
    }),
    reactStartCookies(),
  ], // make sure this is the last plugin in the array
});

export async function findUserRoles(userId: string): Promise<string[]> {
  try {
    const user = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.id, userId))
      .limit(1);

    if (!user || user.length === 0) {
      return ["user"];
    }

    const userRole = user[0].role;

    if (userRole === "artist") {
      return ["artist", "user"];
    } else if (userRole === "admin") {
      return ["admin", "artist", "user"];
    }

    return ["user"];
  } catch (error) {
    console.error("Error finding user roles:", error);
    return ["user"];
  }
}

export async function findUserProps(
  userId: string
): Promise<{ location: string; bio: string; phone: string }> {
  try {
    const user = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.id, userId))
      .limit(1);

    if (!user || user.length === 0) {
      return { location: "", bio: "", phone: "" };
    }

    return {
      location: user[0].location || "",
      bio: user[0].bio || "",
      phone: user[0].phone || "",
    };
  } catch (error) {
    console.error("Error finding user properties:", error);
    return { location: "", bio: "", phone: "" };
  }
}
