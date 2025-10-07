"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/shadcn/ui/card";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from '@tanstack/react-router';
import { Label } from "../shadcn/ui/label";
import { Input } from "../shadcn/ui/input";
import { Button } from "../shadcn/ui/button";
import { m } from "@/paraglide/messages";
import { toast } from "sonner";

export default function SignUp() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0];
    //     if (file) {
    //         setImage(file);
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setImagePreview(reader.result as string);
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    return (
        <Card className="z-50 rounded-md rounded-t-none max-w-md">
            <CardHeader>
                <CardTitle className="text-lg md:text-xl">{m.label_sign_up()}</CardTitle>
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
                    {/* <div className="grid gap-2">
                        <Label htmlFor="image">Profile Image (optional)</Label>
                        <div className="flex items-end gap-4">
                            {imagePreview && (
                                <div className="relative w-16 h-16 rounded-sm overflow-hidden">
                                    <img
                                        src={imagePreview}
                                        alt="Profile preview"
                                    />
                                </div>
                            )}
                            <div className="flex items-center gap-2 w-full">
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full"
                                />
                                {imagePreview && (
                                    <X
                                        className="cursor-pointer"
                                        onClick={() => {
                                            setImage(null);
                                            setImagePreview(null);
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </div> */}
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                        onClick={async () => {
                            await authClient.signUp.email({
                                email,
                                password,
                                name: `${firstName} ${lastName}`,
                                image: image ? await convertImageToBase64(image) : "",
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
                                        console.error("Error signing up:", ctx.error);
                                        toast.error(ctx.error.message);
                                    },
                                    onSuccess: async () => {
                                        setLoading(false);
                                        toast.success("Account created successfully!");
                                        await router.navigate({ to: '/signin' });
                                    },
                                }
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
                <div className="flex justify-center w-full border-t py-4">
                    <p className="text-center text-xs text-neutral-500">
                        Secured by <span className="text-orange-400">better-auth.</span>
                    </p>
                </div>
            </CardFooter>
        </Card>
    );
}

async function convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}