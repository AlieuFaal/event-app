"use client";

import { Button } from "@/components/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/shadcn/ui/card";
import { Input } from "@/components/shadcn/ui/input";
import { Label } from "@/components/shadcn/ui/label";
import { Checkbox } from "src/components/shadcn/ui/checkbox.tsx";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { router } from "@/router";
import { authClient } from "@/lib/auth-client";
import { useServerFn } from "@tanstack/react-start";
import { onUserLoginFn } from "@/services/user-service";
import { m } from "@/paraglide/messages";
import { toast } from "sonner";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const onNewUserLogin = useServerFn(onUserLoginFn);

  const handleSignIn = async () => {
    await authClient.signIn.email(
      {
        email,
        password,
        rememberMe,
      },
      {
        onRequest: (ctx) => {
          setLoading(true);
        },
        onResponse: (ctx) => {
          setLoading(false);
        },
        onError(ctx) {
          toast.error(ctx.error.message);
        },
        onSuccess: async (ctx) => {
          const loginResult = await onNewUserLogin();

          if (loginResult?.redirectTo) {
            router.navigate({ to: loginResult.redirectTo });
          }
          toast.success("Login successful!");
        },
      },
    );
  };

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social(
      {
        provider: "google",
        callbackURL: "/",
        newUserCallbackURL: "/onboarding",
      },
      {
        onError(ctx) {
          toast.error(ctx.error.message);
        },
      },
    );
  };

  const handleFacebookSignIn = async () => {
    await authClient.signIn.social(
      {
        provider: "facebook",
        callbackURL: "/",
        newUserCallbackURL: "/onboarding",
      },
      {
        onError(ctx) {
          toast.error(ctx.error.message);
        },
      },
    );
  };

  const handleGitHubSignIn = async () => {
    await authClient.signIn.social(
      {
        provider: "github",
        callbackURL: "/",
        newUserCallbackURL: "/onboarding",
      },
      {
        onError(ctx) {
          toast.error(ctx.error.message);
        },
      },
    );
  };

  return (
    <Card className="max-w-3xl w-full h-auto">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">
          {m.signin_card_title()}
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
          {m.signin_card_description()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">{m.label_email()}</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">{m.label_password()}</Label>
              <Link
                to="/forgotpassword"
                href=""
                className="ml-auto inline-block text-sm underline"
              >
                {m.label_forgot_password()}
              </Link>
            </div>

            <Input
              id="password"
              type="password"
              placeholder={m.placeholder_password()}
              autoComplete="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              onClick={() => {
                setRememberMe(!rememberMe);
              }}
            />
            <Label htmlFor="remember">{m.label_remember_me()}</Label>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center">
              <Link
                to="/signup"
                className="ml-auto inline-block text-sm underline"
              >
                {m.label_no_account()}
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            onClick={async () => {
              await handleSignIn();
            }}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <p> {m.nav_login()} </p>
            )}
          </Button>

          <div
            className={cn(
              "w-full gap-2 flex items-center",
              "justify-between flex-col",
            )}
          >
            <Button
              variant="outline"
              className={cn("w-full gap-2")}
              disabled={loading}
              onClick={async () => {
                await handleGoogleSignIn();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="0.98em"
                height="1em"
                viewBox="0 0 256 262"
              >
                <path
                  fill="#4285F4"
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                ></path>
                <path
                  fill="#34A853"
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                ></path>
                <path
                  fill="#FBBC05"
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                ></path>
                <path
                  fill="#EB4335"
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                ></path>
              </svg>
              {m.sign_in_With_Google()}
            </Button>
            <Button
              variant="outline"
              className={cn("w-full gap-2")}
              disabled={loading}
              onClick={async () => {
                await handleFacebookSignIn();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <path
                  d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h8.615v-6.96h-2.338v-2.725h2.338v-2c0-2.325 1.42-3.592 3.5-3.592c.699-.002 1.399.034 2.095.107v2.42h-1.435c-1.128 0-1.348.538-1.348 1.325v1.735h2.697l-.35 2.725h-2.348V21H20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z"
                  fill="currentColor"
                ></path>
              </svg>
              {m.sign_in_With_Facebook()}
            </Button>
            <Button
              variant="outline"
              type="button"
              className={cn("w-full gap-2")}
              onClick={async () => {
                await handleGitHubSignIn();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="1em"
                height="1em"
              >
                <path
                  d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                  fill="currentColor"
                />
              </svg>
              {m.sign_in_With_Github()}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
