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

// const form = useForm({
//     defaultValues: {
//         eventName: "",
//         eventDate: "",
//         eventLocation: "",
//         eventDescription: "",
//     },
// });

export default function EventCard() {
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

                    </CardContent>
                </Card>
            </div>

        </>
    )
}