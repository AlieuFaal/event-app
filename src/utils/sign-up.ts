import { authClient } from "../lib/auth-client";

const { data } = await authClient.signUp.email(
  {
    name: "John Doe",
    email: "John.Doe@example.com",
    password: "your-secure-password",
    image: "https://example.com/johndoe.jpg",
    callbackURL: "https://example.com/callback"
  }
);