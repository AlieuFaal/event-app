import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { onbFormUpdateSchema, OnboardingUpdate } from "@vibespot/database"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiClient } from "@/lib/api-client";
import { View } from "@rn-primitives/slot";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Text } from '@/components/ui/text';
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";


export default function OnboardingCards() {
    const [isSelected, setIsSelected] = useState<string | null>(null);

    const [showScreen1, setShowScreen1] = useState(false);
    const [showScreen2, setShowScreen2] = useState(true);
    const [showScreen3, setShowScreen3] = useState(false);

    useEffect(() => {
        console.log("Selected account type:", isSelected);
    }, [isSelected]);

    useEffect(() => {
        console.log("View states:", { view1: showScreen1, view2: showScreen2, view3: showScreen3 });
    }, [showScreen1, showScreen2, showScreen3]);

    // om isSelected är Enthusiast, sätt session.User.role till "enthusiast"
    // om isSelected är Artist, sätt session.User.role till "artist"
    // spara detta i databasen när användaren klickar på "Next".
    return (
        <View >
                {/* {showScreen1 && <Screen1 isSelected={isSelected} setIsSelected={setIsSelected} setScreen1={setShowScreen1} setScreen2={setShowScreen2} setScreen3={setShowScreen3} />} */}
                {showScreen2 && <Screen2 isSelected={isSelected} setIsSelected={setIsSelected} setScreen1={setShowScreen1} setScreen2={setShowScreen2} setScreen3={setShowScreen3} />}
                {/* {showScreen3 && <Screen3 isSelected={isSelected} setIsSelected={setIsSelected} setScreen1={setShowScreen1} setScreen2={setShowScreen2} setScreen3={setShowScreen3} />} */}
        </View>
    )
}

export function Screen1({ isSelected, setIsSelected, setScreen1, setScreen2, setScreen3 }: { isSelected: string | null, setIsSelected: React.Dispatch<React.SetStateAction<string | null>>, setScreen1: React.Dispatch<React.SetStateAction<boolean>>, setScreen2: React.Dispatch<React.SetStateAction<boolean>>, setScreen3: React.Dispatch<React.SetStateAction<boolean>> }) {

    return (
        <View>
            <Card className="h-screen items-center justify-center">
                <CardHeader className="flex flex-col items-center -mt-64">
                    <CardTitle className="text-3xl text-primary">Welcome to VibeSpot!</CardTitle>
                    <CardDescription className="text-xl">Let&apos;s setup your account!</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center">
                    <Button className="p-3 h-fit w-60 rounded-3xl" onPress={() => {
                        setScreen1(false);
                        setScreen2(true);
                    }
                    }>
                        <Text>
                            Continue
                        </Text>
                    </Button>
                </CardContent>
            </Card>
        </View>
    )
}

export function Screen2({ isSelected, setIsSelected, setScreen1, setScreen2, setScreen3 }: { isSelected: string | null, setIsSelected: React.Dispatch<React.SetStateAction<string | null>>, setScreen1: React.Dispatch<React.SetStateAction<boolean>>, setScreen2: React.Dispatch<React.SetStateAction<boolean>>, setScreen3: React.Dispatch<React.SetStateAction<boolean>> }) {

    // const updateUser = useServerFn(updateRoleFn);

    const user = authClient.useSession();

    function roleSelect() {
        console.log("Current session user role:",);

        if (isSelected === "Enthusiast" && user.data) {
            apiClient.users.updateroletouser[":id"].$put({ param: { id: user.data.user.id } })
            // updateUser({ data: { id: user.data.user.id, role: "user" } });
            console.log("Role updated to user in the database.");
        } else if (isSelected === "Artist" && user.data) {
            apiClient.users.updateroletoartist[":id"].$put({ param: { id: user.data.user.id } })
            // updateUser({ data: { id: user.data.user.id, role: "artist" } });
            console.log("Role updated to artist in the database.");
        }
        else {
            console.log("No account type selected");
        }
    }

    return (
        <View>
            <Card className="h-screen">
                <CardHeader className="flex flex-col items-center mt-56">
                    <CardTitle className="text-2xl text-primary">Which of these fits you best?</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-row items-center justify-center gap-3 mx-auto">
                    <View>
                        <Button className="h-fit w-44 p-6 rounded-3xl">
                            <Text>
                                The concert goer
                            </Text>
                        </Button>
                    </View>
                    <Text>or</Text>
                    <View>
                        <Button className="h-fit w-44 p-6 rounded-3xl">
                            <Text>
                                The artist
                            </Text>
                        </Button>
                    </View>
                </CardContent>
            </Card>
        </View>
    )
}

export function Screen3({ isSelected, setScreen1, setScreen2, setScreen3 }: { isSelected: string | null, setIsSelected: React.Dispatch<React.SetStateAction<string | null>>, setScreen1: React.Dispatch<React.SetStateAction<boolean>>, setScreen2: React.Dispatch<React.SetStateAction<boolean>>, setScreen3: React.Dispatch<React.SetStateAction<boolean>> }) {

    // const updateUserData = useServerFn(onbUpdateUserDataFn);

    const user = authClient.useSession();

    // const form = useForm<OnboardingUpdate>({
    //     mode: "onChange",
    //     resolver: zodResolver(onbFormUpdateSchema),

    //     defaultValues: {
    //         phone: "",
    //         location: "",
    //     },
    // });

    const onSubmit = async (data: { phone?: string | null; location?: string | null }) => {
        console.log("Submitting data:", data);
        try {
            console.log("Form data submitted:", data);
            if (user.data) {
                console.log("User session found:", user.data);
                // await updateUserData({ data: { id: user.data.user.id, phone: data.phone, location: data.location } });
                console.log("User data updated in the database:", data);
                // toast.success("Additional info saved!");
                setScreen1(false);
                setScreen2(false);
                setScreen3(true);
            } else if (data === null) {
                console.log("No additional info provided.");
                // toast.message("No additional info provided, you can update this later in your profile settings.");
                setScreen1(false);
                setScreen2(false);
                setScreen3(true);
            }
            else {
                console.log("No user session found.");
                // toast.error("No User session found. Please sign in to proceed.");
            }
        } catch (error) {
            console.error("Error submitting form data:", error);
            // toast.error("There was an error submitting the form. Please try again.");
            return;
        }
    };

    return (
        <View>
            <Button>
                <Text>
                    Hello
                </Text>
            </Button>
        </View>
    )
}   