import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { authClient } from '@/lib/auth-client';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

export function SignUpForm() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignUp = async () => {
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
                        console.error("Passwords do not match");
                        setLoading(false);
                        throw new Error("Passwords do not match");
                    }
                },
                onError: (ctx) => {
                    setLoading(false);
                    console.error("Error signing up:", ctx.error);
                    console.error(ctx.error.message);
                },
                onSuccess: async () => {
                    setLoading(false);
                    console.log("Account created successfully!");
                    const session = authClient.useSession()

                    if (session.data?.user.role === 'New User') {
                        return;
                    }
                    router.navigate("/");
                },
            }
        });
    };

    return (
        <View className="gap-6">
            <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5 h-screen rounded-none">
                <CardHeader className='flex flex-col justify-center items-center'>
                    <CardTitle className="text-center text-4xl sm:text-left">Create account!</CardTitle>
                    <CardDescription className="text-center sm:text-left">
                        Welcome! Please fill in the details to get started.
                    </CardDescription>
                </CardHeader>
                <KeyboardAwareScrollView disableScrollOnKeyboardHide={true} keyboardDismissMode='interactive' contentContainerStyle={{ flexGrow: 1 }}>

                    <CardContent className="gap-6 mt-5">
                        <View className="gap-6">
                            <View className="gap-1.5">
                                <Input
                                    id="first-name"
                                    placeholder="First Name"
                                    autoCapitalize="sentences"
                                    returnKeyType="next"
                                    className='h-fit p-4'
                                    value={firstName}
                                    onChangeText={setFirstName}
                                />
                            </View>
                            <View className="gap-1.5">
                                <Input
                                    id="last-name"
                                    placeholder="Last Name"
                                    autoCapitalize="sentences"
                                    returnKeyType="next"
                                    className='h-fit p-4'
                                    value={lastName}
                                    onChangeText={setLastName}
                                />
                            </View>
                            <View className="gap-1.5">
                                <Input
                                    id="email"
                                    placeholder="E-mail"
                                    keyboardType="email-address"
                                    autoComplete="email"
                                    autoCapitalize="none"
                                    returnKeyType="next"
                                    className='h-fit p-4'
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
                                    className='h-fit p-4'
                                    value={password}
                                    onChangeText={setPassword}
                                />
                            </View>
                            <View className="gap-1.5">
                                <Input
                                    id="password"
                                    secureTextEntry
                                    returnKeyType="send"
                                    placeholder='Confirm Password'
                                    className='h-fit p-4'
                                    value={passwordConfirmation}
                                    onChangeText={setPasswordConfirmation}
                                />
                            </View>
                            <Button className="w-fit h-fit p-8" onPress={handleSignUp} disabled={loading}>
                                <Text>Continue</Text>
                            </Button>
                        </View>
                        <View className='mt-5'>
                            <Text className="text-center text-sm">
                                Already have an account?{' '}
                            </Text>
                            <Pressable
                                onPress={() => {
                                    router.navigate('/');
                                }}>
                                <Text className="text-sm underline underline-offset-4 text-center">Sign in</Text>
                            </Pressable>
                        </View>
                    </CardContent>
                </KeyboardAwareScrollView>
            </Card>
        </View >
    );
}