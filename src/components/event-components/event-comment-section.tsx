import { Button } from "../shadcn/ui/button";
import { Label } from "../shadcn/ui/label";
import { Textarea } from "../shadcn/ui/textarea";
import CommentCard from "./comment-card";
import { authClient } from "@/lib/auth-client";
import { Comment, commentInsertSchema, User } from "drizzle/db";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { FormField, FormItem, FormControl, Form } from "../shadcn/ui/form";
import { toast } from "sonner";
import { postCommentForEvent } from "@/utils/eventService";
import { useForm } from "react-hook-form";
import { EventWithComments} from "drizzle/db";

export default function CommentSection({ event, users }: { event: EventWithComments, users: User[] }) {

    const form = useForm<z.infer<typeof commentInsertSchema>>({
        mode: "onBlur",
        resolver: zodResolver(commentInsertSchema),
    })


    const currentUser = authClient.useSession();

    const onSubmit = async (values: z.infer<typeof commentInsertSchema>) => {
        if (!currentUser.data) {
            toast.warning("You must be logged in to post a comment.");
            return;
        }
        const newComment: Comment = {
            ...values,
            id: crypto.randomUUID(),
            userId: currentUser.data.user.id,
            eventId: event.id,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        try {
            const response = await postCommentForEvent({ data: newComment });
            if (response) {
                toast.success("Comment posted successfully!");
                form.reset();
            } else {
                toast.error("Failed to post comment. Please try again.");
            }
        } catch (error) {
            console.error("Error posting comment:", error);
            toast.error("An error occurred while posting your comment.");
        }
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex justify-center">
                                    <Label className="text-4xl">Comments</Label>
                                </div>
                                <FormControl>
                                    <Textarea id="commentTextArea" rows={4} className="w-full mt-5 bg-background text-card-foreground border border-input rounded-md px-3 py-2 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 min-h-24 max-h-48"
                                        placeholder="Write a comment..." {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end mt-2">
                        <Button type="submit">Submit</Button>
                    </div>
                </form>
            </Form>
            {!event.comments || event.comments.length === 0 ? (<p className="text-center text-muted-foreground mt-5">No comments yet.</p>)
                : (
                    <div className="mt-5 space-y-5 max-h-80 overflow-y-scroll pr-5 pl-5 mb-2 rounded-xl ">
                        {event.comments.map((comment) => (
                            <CommentCard
                                key={comment.id}
                                comment={comment}
                                users={users}
                                currentUser={currentUser.data!.user}
                                onChange={(change) => { console.log(change) }}
                                onDelete={() => { console.log("delete") }} />
                        )
                        )}
                    </div>
                )}
        </div>
    );
}