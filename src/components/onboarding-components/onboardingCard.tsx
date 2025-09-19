import { ArrowLeft, ArrowRight, Music4, SquareUserRound, SquareUserRoundIcon } from "lucide-react";
import { Button } from "../shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../shadcn/ui/card";
import { Label } from "../shadcn/ui/label";
import { Separator } from "../shadcn/ui/separator";
import React from "react";
import { is } from "drizzle-orm";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { createAuthClient } from "better-auth/react";
import { customSessionClient } from "better-auth/client/plugins";
import { auth } from "@/lib/auth";
import { useServerFn } from "@tanstack/react-start";
import { onbUpdateUserDataFn, updateRoleFn, updateUserDataFn } from "@/services/user-service";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../shadcn/ui/form";
import { Input } from "../shadcn/ui/input";
import { onbFormUpdateSchema, OnboardingUpdate, UpdateUser, UserForm, userFormSchema } from "drizzle/db";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function OnboardingCard() {
    const [isSelected, setIsSelected] = React.useState<string | null>(null);

    const [view1, setView1] = React.useState(true);
    const [view2, setView2] = React.useState(false);
    const [view3, setView3] = React.useState(false);



    React.useEffect(() => {
        console.log("Selected account type:", isSelected);
    }, [isSelected]);

    React.useEffect(() => {
        console.log("View states:", { view1, view2, view3 });
    }, [view1, view2, view3]);

    // om isSelected är Enthusiast, sätt session.User.role till "enthusiast"
    // om isSelected är Artist, sätt session.User.role till "artist"
    // spara detta i databasen när användaren klickar på "Next".
    return (
        <div>
            {view1 === true && <View1 isSelected={isSelected} setIsSelected={setIsSelected} setView1={setView1} setView2={setView2} setView3={setView3} />}
            {view2 === true && <View2 isSelected={isSelected} setView1={setView1} setView2={setView2} setView3={setView3} />}
            {view3 === true && <View3 setView1={setView1} setView2={setView2} setView3={setView3} />}
        </div>
    )
}

function View1({ isSelected, setIsSelected, setView1, setView2, setView3 }: { isSelected: string | null, setIsSelected: React.Dispatch<React.SetStateAction<string | null>>, setView1: React.Dispatch<React.SetStateAction<boolean>>, setView2: React.Dispatch<React.SetStateAction<boolean>>, setView3: React.Dispatch<React.SetStateAction<boolean>> }) {
    const updateUser = useServerFn(updateRoleFn);

    const user = authClient.useSession();

    function roleSelect() {
        console.log("Current session user role:",);

        if (isSelected === "Enthusiast" && user.data) {
            updateUser({ data: { id: user.data.user.id, role: "user" } });
            console.log("Role updated to user in the database.");
        } else if (isSelected === "Artist" && user.data) {
            updateUser({ data: { id: user.data.user.id, role: "artist" } });
            console.log("Role updated to artist in the database.");
        }
        else {
            console.log("No account type selected");
        }
    }

    return (
        <div>
            <Card className="w-[1000px] mx-auto mt-25 bg-card border-1 shadow-lg mb-25">
                <CardHeader className="flex flex-col items-center">
                    <CardTitle className="text-5xl text-primary">Welcome to VibeSpot!</CardTitle>
                    <CardDescription className="text-xl">Lets get you started with setting up your profile.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="">
                        <Label className="text-xl">Choose account type.</Label>
                    </div>
                    <div className="flex flex-row justify-around mt-5 gap-5">
                        <Card className={cn("hover:scale-105 transition-transform cursor-pointer min-w-[420px]", isSelected === "Enthusiast" && "bg-gray-200 border-3 border-primary dark:text-background")} onClick={() => setIsSelected("Enthusiast")}>
                            <CardHeader>
                                <SquareUserRound />
                                <CardTitle className="text-2xl">Enthusiast</CardTitle>
                                <CardDescription className={cn("text-lg", isSelected === "Enthusiast" && "dark:text-background")}>The Concert enjoyer. Find events & artists of your liking, connect with others & enjoy the vibe!</CardDescription>
                            </CardHeader>
                        </Card>
                        <Card className={cn("hover:scale-105 transition-transform cursor-pointer min-w-[420px]", isSelected === "Artist" && "bg-gray-200 border-3 border-primary dark:text-background")} onClick={() => setIsSelected("Artist")}>
                            <CardHeader>
                                <Music4 />
                                <CardTitle className="text-2xl">Artist</CardTitle>
                                <CardDescription className={cn("text-lg", isSelected === "Artist" && "dark:text-background")}>The Creator. Create & manage upcoming events, engage with attendees & grow your community.</CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                    <div className="mt-10">
                        <Separator />
                    </div>
                    <div className="flex flex-row justify-between mt-10">
                        <Button className="hover:scale-105 transition-transform" onClick={() => toast.warning("No going back from here :)")}>
                            <ArrowLeft /> Back
                        </Button>

                        <Button className="hover:scale-105 transition-transform" onClick={() => {
                            if (isSelected === "Enthusiast" || isSelected === "Artist") {
                                setView1(false);
                                setView2(true);
                                setView3(false);
                                toast.success("Account type selected!");
                                roleSelect();
                            } else {
                                toast.error("Please select an account type to proceed.");
                            }
                        }}>
                            Next <ArrowRight />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function View2({ isSelected, setView1, setView2, setView3 }: { isSelected: string | null, setView1: React.Dispatch<React.SetStateAction<boolean>>, setView2: React.Dispatch<React.SetStateAction<boolean>>, setView3: React.Dispatch<React.SetStateAction<boolean>> }) {
    const updateUserData = useServerFn(onbUpdateUserDataFn);

    const user = authClient.useSession();

    const form = useForm<OnboardingUpdate>({
        mode: "onChange",
        resolver: zodResolver(onbFormUpdateSchema),

        defaultValues: {
            phone: "",
            location: "",
        },
    });

    const onSubmit = async (data: { phone?: string | null; location?: string | null }) => {
        console.log("Submitting data:", data);
        try {
            console.log("Form data submitted:", data);
            if (user.data) {
                console.log("User session found:", user.data);
                await updateUserData({ data: { id: user.data.user.id, phone: data.phone, location: data.location } });
                console.log("User data updated in the database:", data);
                toast.success("Additional info saved!");
                setView1(false);
                setView2(false);
                setView3(true);
            } else if (data === null) {
                console.log("No additional info provided.");
                toast.message("No additional info provided, you can update this later in your profile settings.");
                setView1(false);
                setView2(false);
                setView3(true);
            }
            else {
                console.log("No user session found.");
                toast.error("No User session found. Please sign in to proceed.");
            }
        } catch (error) {
            console.error("Error submitting form data:", error);
            toast.error("There was an error submitting the form. Please try again.");
            return;
        }
    };

    return (
        <div>
            <Card className="w-[1000px] mx-auto mt-25 bg-card border-1 shadow-lg mb-25">
                <CardHeader className="flex flex-col items-center">
                    <CardTitle className="text-5xl text-primary">Great choice!</CardTitle>
                    <CardDescription className="text-xl">You have selected the <span className="font-bold">{isSelected}</span> account type.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="">
                        <Label className="text-xl">Next, please provide some additional information to help us personalize your experience.</Label>
                    </div>
                    <Form {...form}>
                        <form id="form" method="post" onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-5 mt-5">
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="phone" >
                                                Phone
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="phone"
                                                    placeholder="+46 (070) 123-456 (Optional)"

                                                    {...field}
                                                    value={field.value ?? ""}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="location" >
                                                Location
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="location"
                                                    placeholder="Varberg, Halland (Optional)"
                                                    {...field}
                                                    value={field.value ?? ""}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </form>
                    </Form>
                    <div className="mt-10">
                        <Separator />
                    </div>
                    <div className="flex flex-row justify-between mt-10">
                        <Button type="button" className="hover:scale-105 transition-transform" onClick={() => {
                            setView1(true);
                            setView2(false);
                            setView3(false);
                        }}>
                            <ArrowLeft /> Back
                        </Button>
                        <Button type="submit" className="hover:scale-105 transition-transform" form="form" onClick={() => form.handleSubmit(onSubmit)}>
                           {form.formState.isDirty ? "Next" : "Skip"}<ArrowRight />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function View3({ setView1, setView2, setView3 }: { setView1: React.Dispatch<React.SetStateAction<boolean>>, setView2: React.Dispatch<React.SetStateAction<boolean>>, setView3: React.Dispatch<React.SetStateAction<boolean>> }) {
    return (
        <div>
            <Card className="w-[1000px] mx-auto mt-25 bg-card border-1 shadow-lg mb-25">
                <CardHeader className="flex flex-col items-center">
                    <CardTitle className="text-5xl text-primary">All set!</CardTitle>
                    <CardDescription className="text-xl">You have completed the onboarding process.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="">
                        <Label className="text-xl">You can now proceed to explore the app and start using your new account.</Label>
                    </div>
                    <div className="mt-10">
                        <Separator />
                    </div>
                    <div className="flex flex-row justify-between mt-10">
                        <Button className="hover:scale-105 transition-transform" onClick={() => {
                            setView1(false);
                            setView2(true);
                            setView3(false);
                        }
                        }>
                            <ArrowLeft /> Back
                        </Button>

                        <Button className="hover:scale-105 transition-transform" onClick={() => {
                            toast.success("Onboarding complete! Welcome aboard!");
                            window.location.href = "/";
                        }
                        }>
                            Go to Dashboard <ArrowRight />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}   