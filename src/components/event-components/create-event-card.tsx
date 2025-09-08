import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../shadcn/ui/card";
import { Button } from "../shadcn/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../shadcn/ui/form"
import { Input } from "../shadcn/ui/input"
import { useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { postEventData } from "@/utils/event";
import { zodEventSchema } from "../../lib/zodEventSchema";
import { authClient } from "@/lib/auth-client";
import { router } from "@/router";
import { Link } from "@tanstack/react-router";
import { Calendar24 } from "../shadcn/ui/date-time-picker";


export default function EventCard() {

    const getDefaultStartDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(18, 0, 0, 0);
        return tomorrow;
    }

    const getDefaultEndDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(22, 30, 0, 0);
        return tomorrow;
    }

    const form = useForm<z.infer<typeof zodEventSchema>>({
        mode: "onBlur",
        resolver: zodResolver(zodEventSchema),
        defaultValues: {
            color: "blue",
            startDate: getDefaultStartDate(),
            endDate: getDefaultEndDate(),
        }
    })


    const { data: session } = authClient.useSession()

    const onSubmit = async (values: z.infer<typeof zodEventSchema>) => {
        try {
            console.log("Submitting values:", values);

            const result = await postEventData({
                data: {
                    ...values,
                    userId: session?.user.id,
                    id: crypto.randomUUID()
                }
            });

            console.log("Event created:", result);
            router.navigate({ to: "/events" });
        } catch (error) {
            console.error("Error submitting event:", error);
        }
    }

    return (
        <div className="mt-5 flex flex-col">
            <Card className="p-20 shadow-lg border rounded-lg mx-30 mb-30 mt-20">
                <CardHeader className="flex flex-col justify-center items-center">
                    <CardTitle className="text-4xl mb-4">Create Event</CardTitle>
                    <CardDescription className="text-gray-600 mb-4 text-lg">
                        Fill in the details below to create your event.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title:</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Way Out West" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            What's the name of your event?
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description:</FormLabel>
                                        <FormControl>
                                            <Input placeholder="A cool and soulful evening..." {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Describe the Vibe of your event.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location:</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Kaserntorget 6, 411 18, Göteborg" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Where's the Vibe?
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="color"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Color:</FormLabel>
                                        <FormControl>
                                            <select {...field} className="w-full p-2 border rounded">
                                                <option value="blue">Blue</option>
                                                <option value="green">Green</option>
                                                <option value="red">Red</option>
                                                <option value="yellow">Yellow</option>
                                                <option value="purple">Purple</option>
                                                <option value="orange">Orange</option>
                                            </select>
                                        </FormControl>
                                        <FormDescription>
                                            Choose a color to represent your event on the calendar.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField control={form.control} name="startDate" render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Calendar24 value={field.value} onChange={field.onChange} />
                                    </FormControl>
                                    <FormDescription>
                                        At what time and date does your event start?
                                    </FormDescription>
                                </FormItem>
                            )} >
                            </FormField>

                            <FormField control={form.control} name="endDate" render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Calendar24 value={field.value} onChange={field.onChange} />
                                    </FormControl>
                                    <FormDescription>
                                        At what time and date does your event end?
                                    </FormDescription>
                                </FormItem>
                            )} >
                            </FormField>

                            <Button type="submit">Submit your event!</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}