import { aw } from "node_modules/better-auth/dist/shared/better-auth.jwa4Tx7v";
import { authClient } from "../lib/auth-client";
import { auth } from "./auth";

const { data } = await authClient.signIn.email({
  email: "john.doe@example.com", // required
  password: "password1234", // required
  rememberMe: false,
  callbackURL: "https://example.com/callback",
});

await authClient.signIn.social({
  provider: "google",
  callbackURL: `${window.location.origin}/dashboard`, // redirect to dashboard after sign in
  errorCallbackURL: `${window.location.origin}/error`, // redirect to error page on error
  newUserCallbackURL: `${window.location.origin}/welcome`, // redirect to welcome page if new user
  disableRedirect: true, // set to true to disable redirect and handle it manually
});

await authClient.signIn.social({
  provider: "facebook",
  callbackURL: `${window.location.origin}/dashboard`, // redirect to dashboard after sign in
  errorCallbackURL: `${window.location.origin}/error`, // redirect to error page on error
  newUserCallbackURL: `${window.location.origin}/welcome`, // redirect to welcome page if new user
  disableRedirect: true, // set to true to disable redirect and handle it manually
});

await authClient.signIn.social({
  provider: "twitter",
  callbackURL: `${window.location.origin}/dashboard`, // redirect to dashboard after sign in
  errorCallbackURL: `${window.location.origin}/error`, // redirect to error page on error
  newUserCallbackURL: `${window.location.origin}/welcome`, // redirect to welcome page if new user
  disableRedirect: true, // set to true to disable redirect and handle it manually
});

await authClient.signIn.social({
  provider: "apple",
  callbackURL: `${window.location.origin}/dashboard`, // redirect to dashboard after sign in
  errorCallbackURL: `${window.location.origin}/error`, // redirect to error page on error
  newUserCallbackURL: `${window.location.origin}/welcome`, // redirect to welcome page if new user
  disableRedirect: true, // set to true to disable redirect and handle it manually
});
