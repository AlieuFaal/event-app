"use client";

import { useRouter } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/shadcn/ui/card";
import { authClient } from "@/lib/auth-client";
import { m } from "@/paraglide/messages";
import { Button } from "../shadcn/ui/button";
import { Input } from "../shadcn/ui/input";
import { Label } from "../shadcn/ui/label";

export default function SignUp() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	return (
		<Card className="z-50 max-w-md rounded-md rounded-t-none">
			<CardHeader>
				<CardTitle className="text-lg md:text-xl">
					{m.label_sign_up()}
				</CardTitle>
				<CardDescription className="text-xs md:text-sm">
					{m.signup_description()}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="grid gap-2">
							<Label htmlFor="first-name">{m.first_name()}</Label>
							<Input
								id="first-name"
								placeholder="Max"
								required
								onChange={(e) => {
									setFirstName(e.target.value);
								}}
								value={firstName}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="last-name">{m.last_name()}</Label>
							<Input
								id="last-name"
								placeholder="Robinson"
								required
								onChange={(e) => {
									setLastName(e.target.value);
								}}
								value={lastName}
							/>
						</div>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="email">{m.label_email()}</Label>
						<Input
							id="email"
							type="email"
							placeholder="vibespot@example.com"
							required
							onChange={(e) => {
								setEmail(e.target.value);
							}}
							value={email}
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="password">{m.label_password()}</Label>
						<Input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							autoComplete="new-password"
							placeholder={m.placeholder_password()}
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="password">{m.confirm_password()}</Label>
						<Input
							id="confirm_password"
							type="password"
							value={passwordConfirmation}
							onChange={(e) => setPasswordConfirmation(e.target.value)}
							autoComplete="new-password"
							placeholder={m.confirm_password_placeholder()}
						/>
					</div>
					<Button
						type="submit"
						className="w-full"
						disabled={loading}
						onClick={async () => {
							await authClient.signUp.email({
								email,
								password,
								name: `${firstName} ${lastName}`,
								callbackURL: "/",
								fetchOptions: {
									onResponse: () => {
										setLoading(false);
									},
									onRequest: () => {
										setLoading(true);
										if (password !== passwordConfirmation) {
											toast.error("Passwords do not match");
											setLoading(false);
											throw new Error("Passwords do not match");
										}
									},
									onError: (ctx) => {
										setLoading(false);
										toast.error(ctx.error.message);
									},
									onSuccess: async () => {
										setLoading(false);
										toast.success("Account created successfully!");
										await router.navigate({ to: "/signin" });
									},
								},
							});
						}}
					>
						{loading ? (
							<Loader2 size={16} className="animate-spin" />
						) : (
							m.button_create_account()
						)}
					</Button>
				</div>
			</CardContent>
			<CardFooter>
				<div className="flex w-full justify-center border-t py-4">
					<p className="text-center text-neutral-500 text-xs">
						Secured by <span className="text-orange-400">better-auth.</span>
					</p>
				</div>
			</CardFooter>
		</Card>
	);
}
