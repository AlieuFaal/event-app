import { SocialConnections } from '@/components/ui/social-connections';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'expo-router';
import { apiClient } from '@/lib/api-client';

export function SignInForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const router = useRouter();

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
                    console.log("Signing in...");
                },
                onResponse: (ctx) => {
                    setLoading(false);
                    console.log("Response received.");
                },
                onError(ctx) {
                    console.error("Error signing in:", ctx.error);
                    console.error(ctx.error.message);
                },
                onSuccess: async (ctx) => {

                    const session = await authClient.getSession();

                    const userId = session?.data?.user.id;

                    const res = await apiClient.users[':id'].$get({ param: { id: userId! } });

                    const user = await res.json();

                    if (user.role === "New User") {
                        console.log("Navigating to onboarding...");
                        router.push("/onboarding");
                    }
                    console.log("Login successful! User:", user);
                }
            });
    };

    return (
        <View className="gap-6">
            <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5 h-screen">
                <CardHeader className='flex flex-col justify-center items-center mt-5'>
                    <CardTitle className="text-center text-6xl sm:text-left">VibeSpot</CardTitle>
                    <CardDescription className="text-center sm:text-left">
                        Welcome! Sign in to continue!
                    </CardDescription>
                </CardHeader>
                <CardContent className="gap-6">
                    <View className="gap-7 mt-5">
                        <View className="gap-1.5">
                            <Input
                                id="email"
                                placeholder="E-mail"
                                keyboardType="email-address"
                                autoComplete="email"
                                autoCapitalize="none"
                                returnKeyType="next"
                                submitBehavior="submit"
                                className='p-7 h-fit rounded-3xl'
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>
                        <View className="gap-1.5">
                            <Input
                                id="password"
                                secureTextEntry
                                returnKeyType="send"
                                placeholder='Password'
                                className='p-7 h-fit rounded-3xl'
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>
                        <Button className="p-4 h-fit bg-primary rounded-3xl mt-3" onPress={handleSignIn} disabled={loading}>
                            <Text>Log In</Text>
                        </Button>
                        <View className="mt-5">
                            <View className='flex flex-col justify-center items-center'>
                                <Pressable
                                    onPress={() => {
                                        router.navigate('/forgotpassword');
                                    }}>
                                    <Text className="text-sm font-normal leading-4 underline">Forgot your password?</Text>
                                </Pressable>
                            </View>
                        </View>
                        <View>
                            <Text className="text-center text-sm">
                                Don&apos;t have an account?{' '}
                            </Text>
                            <Pressable
                                onPress={() => {
                                    router.navigate('/signup');
                                }}>
                                <Text className="text-sm underline underline-offset-4 text-center">Sign up</Text>
                            </Pressable>
                        </View>
                    </View>
                    <View className="flex-row items-center">
                        <Separator className="flex-1" />
                        <Text className="text-muted-foreground px-4 text-sm">or</Text>
                        <Separator className="flex-1" />
                    </View>
                    <SocialConnections />
                </CardContent>
            </Card>
        </View>
    );
}