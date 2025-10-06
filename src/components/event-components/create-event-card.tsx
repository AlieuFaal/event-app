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
import { postEventDataFn } from "@/services/eventService";
import { eventInsertSchema, User } from "drizzle/db/schema";
import { authClient } from "@/lib/auth-client";
import { router } from "@/router";
import { Calendar24 } from "../shadcn/ui/date-time-picker";
import { toast } from "sonner";
import { AddressAutofill } from '@mapbox/search-js-react';
import { m } from "@/paraglide/messages";


export default function EventCard(currentUser: User) {

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

    const form = useForm<z.infer<typeof eventInsertSchema>>({
        mode: "onBlur",
        resolver: zodResolver(eventInsertSchema),
        defaultValues: {
            color: "blue",
            startDate: getDefaultStartDate(),
            endDate: getDefaultEndDate(),
        }
    })

    const { data: session } = authClient.useSession()

    const onSubmit = async (values: z.infer<typeof eventInsertSchema>) => {
        try {
            if (currentUser.role !== "artist" && currentUser.role !== "admin") {
                toast.error(m.toast_event_create_role());
                return;
            }
            const dataToSend = {
                ...values,
                userId: session?.user.id,
                id: crypto.randomUUID()
            };

            await postEventDataFn({
                data: dataToSend
            });

            toast.success(m.toast_event_created());
            router.navigate({ to: "/events" });
        } catch (error) {
            console.error("Error submitting event:", error);
            if (!session) {
                toast.error(m.toast_login_required());
                return;
            }
            toast.error(m.toast_event_failed());
        }
    }

    return (
        <div className="flex flex-col">
            <Card className="p-10 shadow-lg border rounded-lg mx-30 mb-30 mt-10">
                <CardHeader className="flex flex-col justify-center items-center">
                    <CardTitle className="text-4xl mb-4">{m.create_event_title()}</CardTitle>
                    <CardDescription className="text-gray mb-4 text-lg">
                        {m.create_event_description()}
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
                                        <FormLabel>{m.form_title_label()}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={m.form_title_placeholder()} {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            {m.form_title_description()}
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
                                        <FormLabel>{m.form_description_label()}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={m.form_description_placeholder()} {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            {m.form_description_description()}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="venue"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{m.form_venue_label()}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={m.form_venue_placeholder()} {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            {m.form_venue_description()}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <AddressAutofill accessToken={import.meta.env.VITE_PUBLIC_MAPBOX_ACCESS_TOKEN} onRetrieve={(res) => {
                                form.setValue("latitude", res.features[0]?.geometry.coordinates[0].toString() || ""),
                                    form.setValue("longitude", res.features[0]?.geometry.coordinates[1].toString() || "");
                            }} onSuggestError={(e) => console.log(e)} browserAutofillEnabled={true} confirmOnBrowserAutofill={true}>
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{m.form_address_label()}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={m.form_address_placeholder()} {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                {m.form_address_description()}
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </AddressAutofill>

                            <FormField
                                control={form.control}
                                name="color"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="mt-5">{m.form_color_label()}</FormLabel>
                                        <FormControl>
                                            <select {...field} className="w-full p-2 border rounded">
                                                <option value="blue">{m.form_color_blue()}</option>
                                                <option value="green">{m.form_color_green()}</option>
                                                <option value="red">{m.form_color_red()}</option>
                                                <option value="yellow">{m.form_color_yellow()}</option>
                                                <option value="purple">{m.form_color_purple()}</option>
                                                <option value="orange">{m.form_color_orange()}</option>
                                            </select>
                                        </FormControl>
                                        <FormDescription>
                                            {m.form_color_description()}
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
                                        {m.form_start_date_description()}
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
                                        {m.form_end_date_description()}
                                    </FormDescription>
                                </FormItem>
                            )} >
                            </FormField>

                            <Button type="submit">
                                {m.button_submit_event()}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}