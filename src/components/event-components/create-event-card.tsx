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
import { repeatEventsFn } from "@/services/eventService";
import { eventInsertSchema, User } from "drizzle/db/schema";
import { authClient } from "@/lib/auth-client";
import { router } from "@/router";
import { Calendar24 } from "../shadcn/ui/date-time-picker";
import { toast } from "sonner";
import { m } from "@/paraglide/messages";
import { AddressAutofill } from "@mapbox/search-js-react";
import { ColorPicker } from "../color-picker-component/color-picker";
import { Textarea } from "../shadcn/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../shadcn/ui/select";
import { GENRES } from "../calendar/constants";
import { useState } from "react";

interface EventCardProps {
    currentUser: User | null;
}

export default function EventCard({ currentUser: _currentUser }: EventCardProps) {

    const [showRepeatEndDate, setShowRepeatEndDate] = useState(false);

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
            title: "",
            description: "",
            address: "",
            venue: "",
            latitude: "",
            longitude: "",
            color: "Blue",
            genre: "Indie",
            startDate: getDefaultStartDate(),
            endDate: getDefaultEndDate(),
        }
    })

    const { data: session } = authClient.useSession()

    const onSubmit = async (values: z.infer<typeof eventInsertSchema>) => {
        try {
            const dataToSend = {
                ...values,
                userId: session?.user.id,
                id: crypto.randomUUID()
            };

            if (dataToSend.latitude === "" || dataToSend.longitude === "") {
                toast.error("Please select a valid address from the suggestions.");
                return;
            }

            await repeatEventsFn({
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        form.setValue("address", e.target.value);
    }

    return (
        <div className="flex flex-col max-w-7xl mx-auto my-4 md:my-8 lg:my-10 px-4">
            <Card className="p-4 md:p-8 lg:p-10 bg-primary-foreground">
                <CardHeader className="flex flex-col justify-center items-center bg-primary text-secondary p-6 md:p-12 lg:p-20 rounded-lg mb-5 shadow-2xl">
                    <CardTitle className="text-2xl md:text-4xl lg:text-6xl mb-2 md:mb-4 font-mono text-center">{m.create_event_title().toLocaleUpperCase()}</CardTitle>
                    <CardDescription className="text-gray mb-2 md:mb-4 text-sm md:text-base lg:text-lg font-mono text-center">
                        {m.create_event_description()}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" autoComplete="off">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="relative left-3">{m.form_title_label()}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={m.form_title_placeholder()} {...field} />
                                        </FormControl>
                                        <FormDescription className="relative left-3">
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
                                        <FormLabel className="relative left-3">{m.form_description_label()}</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder={m.form_description_placeholder()} {...field} className="resize-none" />
                                        </FormControl>
                                        <FormDescription className="relative left-3">
                                            {m.form_description_description()}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <FormField
                                    control={form.control}
                                    name="venue"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="relative left-3">{m.form_venue_label()}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={m.form_venue_placeholder()} {...field} value={field.value || ''} className="h-9" />
                                            </FormControl>
                                            <FormDescription className="relative left-3 text-xs">
                                                {m.form_venue_description()}
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <AddressAutofill
                                    accessToken={import.meta.env.VITE_PUBLIC_MAPBOX_ACCESS_TOKEN}
                                    onRetrieve={(res: any) => {
                                        form.setValue("latitude", res.features[0]?.geometry.coordinates[0].toString() || "");
                                        form.setValue("longitude", res.features[0]?.geometry.coordinates[1].toString() || "");
                                    }}
                                    onSuggestError={(e: any) => console.log(e)}
                                    browserAutofillEnabled={true}
                                    confirmOnBrowserAutofill={true}
                                    options={{ country: 'se', streets: true }}
                                    theme={{ variables: { borderRadius: '1.3rem', padding: "0.7rem" } }}
                                >
                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="relative left-3">{m.form_address_label()}</FormLabel>
                                                <FormControl>
                                                    <Input placeholder={m.form_address_placeholder()} {...field} value={field.value} onChange={handleChange} autoComplete="address-line3" className="h-9" />
                                                </FormControl>
                                                <FormDescription className="relative left-3 text-xs">
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
                                            <FormLabel className="relative left-3">{m.form_color_label()}</FormLabel>
                                            <FormControl>
                                                <ColorPicker color={field.value} onChange={(color) => field.onChange(color)} />
                                            </FormControl>
                                            <FormDescription className="relative left-3 text-xs">
                                                {m.form_color_description()}
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="genre"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="relative left-3">{m.form_genre_label()}</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full h-9">
                                                        <SelectValue placeholder="Select a genre" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="max-h-[300px]">
                                                    {GENRES.map((genre) => (
                                                        <SelectItem key={genre} value={genre}>
                                                            {genre}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription className="relative left-3 text-xs">
                                                {m.form_genre_description()}
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex flex-col md:flex-row justify-around mt-10">
                                <FormField control={form.control} name="startDate" render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Calendar24 value={field.value} onChange={field.onChange} />
                                        </FormControl>
                                        <FormDescription className="relative left-3">
                                            {m.form_start_date_description()}
                                        </FormDescription>
                                    </FormItem>
                                )} >
                                </FormField>

                                <FormField control={form.control} name="endDate" render={({ field }) => (
                                    <FormItem >
                                        <FormControl>
                                            <Calendar24 value={field.value} onChange={field.onChange} />
                                        </FormControl>
                                        <FormDescription className="relative left-3">
                                            {m.form_end_date_description()}
                                        </FormDescription>
                                    </FormItem>
                                )} >
                                </FormField>

                                <FormField control={form.control} name="repeat" render={({ field }) => (
                                    <FormItem >
                                        <FormLabel className="relative left-3">{m.form_repeat_label()}</FormLabel>
                                        <FormControl>
                                            <Select 
                                                onValueChange={(value) => {
                                                    field.onChange(value);
                                                    setShowRepeatEndDate(value !== "none");
                                                }} 
                                                defaultValue={"none"}
                                            >
                                                <SelectTrigger className="w-full h-9">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">{m.form_repeat_none()}</SelectItem>
                                                    <SelectItem value="daily">{m.form_repeat_daily()}</SelectItem>
                                                    <SelectItem value="weekly">{m.form_repeat_weekly()}</SelectItem>
                                                    <SelectItem value="monthly">{m.form_repeat_monthly()}</SelectItem>
                                                    <SelectItem value="yearly">{m.form_repeat_yearly()}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormDescription className="relative left-3">
                                            {m.form_repeat_description()}
                                        </FormDescription>
                                    </FormItem>
                                )} >
                                </FormField>
                            </div>

                            {showRepeatEndDate && (
                                <div className="flex justify-center mt-6">
                                    <FormField control={form.control} name="repeatEndDate" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="relative left-3">End Repeat Date (Optional)</FormLabel>
                                            <FormControl>
                                                <Calendar24 value={field.value ?? undefined} onChange={field.onChange} />
                                            </FormControl>
                                            <FormDescription className="relative left-3">
                                                Choose when to stop repeating this event. Leave empty for default duration.
                                            </FormDescription>
                                        </FormItem>
                                    )} >
                                    </FormField>
                                </div>
                            )}

                            <div className="flex justify-center">
                                <Button type="submit">
                                    {m.button_submit_event()}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}