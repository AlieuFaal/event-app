import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { postEventData } from "@/utils/event";
import { zodEventSchema } from "../lib/zodEventSchema";
import { Calendar24 } from "./ui/date-time-picker";
import { authClient } from "@/lib/auth-client";


export default function EventCard() {
    const form = useForm<z.infer<typeof zodEventSchema>>({
        mode: "onBlur",
        resolver: zodResolver(zodEventSchema)
    })

    const { data: session } = authClient.useSession()

    const onSubmit = (values: z.infer<typeof zodEventSchema>) => {
        postEventData({ data: {...values, userId: session?.user.id} })
    }
    return (
        <>
            <div className="mt-5 flex flex-col">
                <Card className="p-20 shadow-lg border rounded-lg">
                    <CardHeader className="flex flex-col justify-center items-center">
                        <CardTitle className="text-4xl mb-4 ">
                            Create Event
                        </CardTitle>
                        <CardDescription className="text-gray-600 mb-4 text-lg">Fill in the details below to create your event.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <Form {...form}>
                                <FormField control={form.control} name="eventTitle" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Title:
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Way Out West" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            What's the name of your event?
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="eventDescription" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Description:
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="A cool and soulful evening with a sweet mix of Jazz and Blues music..." {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Describe the Vibe of your event.
                                        </FormDescription>
                                    </FormItem>
                                )} >
                                </FormField>
                                <FormField control={form.control} name="eventLocation" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Location:
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Kaserntorget 6, 411 18, Göteborg" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Where's the Vibe?
                                        </FormDescription>
                                    </FormItem>
                                )} >
                                </FormField>
                                <FormField control={form.control} name="eventStartDate" render={({ field }) => (
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
                                <FormField control={form.control} name="eventEndDate" render={({ field }) => (
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
                                <Button type="submit" onClick={() => form.handleSubmit(onSubmit)()}>Submit your event!</Button>
                            </Form>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}