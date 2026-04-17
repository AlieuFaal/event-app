import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { Resend } from "resend";
import { db, schema, session } from ".";
import { expo } from "@better-auth/expo";

const normalizeOrigin = (origin: string): string =>
  origin.trim().replace(/\/+$/, "");

const parseOrigins = (origins: string | undefined): string[] => {
  if (!origins) {
    return [];
  }

  return origins
    .split(",")
    .map((origin) => normalizeOrigin(origin))
    .filter((origin) => origin.length > 0);
};

const authSecret = process.env.BETTER_AUTH_SECRET;
const authBaseUrl = process.env.BETTER_AUTH_URL;
const isProduction = process.env.NODE_ENV === "production";

if (!authSecret) {
  throw new Error("BETTER_AUTH_SECRET environment variable is not set");
}

if (!authBaseUrl) {
  throw new Error("BETTER_AUTH_URL environment variable is not set");
}

const trustedOrigins = Array.from(
  new Set([
    ...parseOrigins(process.env.BETTER_AUTH_TRUSTED_ORIGINS),
    normalizeOrigin(authBaseUrl),
    ...(isProduction
      ? []
      : [
          "http://localhost:3000",
          "http://127.0.0.1:3000",
          "http://localhost:3001",
          "http://127.0.0.1:3001",
        ]),
  ])
);

const secureCookies =
  process.env.BETTER_AUTH_SECURE_COOKIES === "true" || isProduction;
const enableCrossSubDomainCookies =
  process.env.BETTER_AUTH_ENABLE_CROSS_SUBDOMAIN_COOKIES === "true";
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

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
  trustedOrigins,
  user: {
    model: schema.user,
    sessionModel: schema.session,
    changeEmail: {
      enabled: false,
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
        input: false,
      },
      location: {
        type: "string",
        required: false,
        defaultValue: "",
        input: false,
      },
      phone: {
        type: "string",
        required: false,
        defaultValue: "",
        input: false,
      },
      role: {
        type: "string",
        required: true,
        defaultValue: "New User",
        input: false,
      },
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token: _token }, _request) => {
      if (!resend) {
        throw new Error("RESEND_API_KEY environment variable is not set");
      }

      const { data, error } = await resend.emails.send({
        from: "VibeSpot <onboarding@resend.dev>",
        to: user.email,
        subject: "Verify your email",
        html: `Click the link to verify your email: ${url}`,
      });

      if (error) {
        console.error("Error sending verification email:", error);
      } else {
        console.log("Verification email sent:", data);
      }
    },
  },
  emailAndPassword: {
    enabled: true, // Enable email and password authentication
    autoSignIn: false, // Automatically sign in the user after sign up
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
  secret: authSecret,
  baseURL: authBaseUrl,
  advanced: {
    database: {
      generateId: () => crypto.randomUUID(),
    },
    useSecureCookies: secureCookies,
    disableOriginCheck: false,
  },
  crossSubDomainCookies: {
    enabled: enableCrossSubDomainCookies,
  },
  cookies: {
    cookies: {
      sessionToken: {
        name: "better-auth.session_token",
        attributes: {
          sameSite: "lax",
          secure: secureCookies,
          maxAge: 60 * 60 * 24 * 10, // 10 days
        },
      },
    },
    session: {
      model: session,
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
      cookieCache: {
        enabled: true,
        maxAge: 10 * 60,
      },
    },
  },
  plugins: [tanstackStartCookies(), expo()], // make sure this is the last plugin in the array
});

export type AuthType = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};
