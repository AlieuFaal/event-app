import { Button } from "../shadcn/ui/button";
import { Label } from "../shadcn/ui/label";
import { Textarea } from "../shadcn/ui/textarea";
import CommentCard from "./comment-card";
import { authClient } from "@/lib/auth-client";
import { Comment, commentInsertSchema, User } from "drizzle/db";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { FormField, FormItem, Form } from "../shadcn/ui/form";
import { toast } from "sonner";
import { postCommentForEventFn } from "@/services/eventService";
import { useForm } from "react-hook-form";
import { EventWithComments } from "drizzle/db";
import { m } from "@/paraglide/messages";

export default function CommentSection({ event, users, currentUser }: { event: EventWithComments, users: User[], currentUser: User | null}) {

    const form = useForm<z.infer<typeof commentInsertSchema>>({
        mode: "onBlur",
        resolver: zodResolver(commentInsertSchema),
    })

    const session = authClient.useSession();

    const onSubmit = async (values: z.infer<typeof commentInsertSchema>) => {
        if (!session.data) {
            toast.warning(m.toast_comment_login_required());
            return;
        }
        const newComment: Comment = {
            ...values,
            id: crypto.randomUUID(),
            userId: currentUser!.id,
            eventId: event.id,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        try {
            const response = await postCommentForEventFn({ data: newComment });
            if (response) {
                toast.success(m.toast_comment_success());
                form.reset();
            } else {
                toast.error(m.toast_comment_failed());
            }
        } catch (error) {
            console.error("Error posting comment:", error);
            toast.error(m.toast_comment_error());
        }
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex justify-center">
                                    <Label className="text-4xl">{m.comments_title()}</Label>
                                </div>
                                <Textarea id="commentTextArea" rows={4} className="w-full mt-5 bg-background text-card-foreground border border-input rounded-md px-3 py-2 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 min-h-24 max-h-48"
                                    placeholder={m.comments_placeholder()} {...field}
                                />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end mt-2">
                        <Button type="submit">{m.button_submit()}</Button>
                    </div>
                </form>
            </Form>
            {!event.comments || event.comments.length === 0 ? (<p className="text-center text-muted-foreground mt-5">{m.comments_none()}</p>)
                : (
                    <div className="mt-5 space-y-5 max-h-80 overflow-y-scroll pr-5 pl-5 mb-2 rounded-xl ">
                        {event.comments.map((comment) => (
                            <CommentCard
                                key={comment.id}
                                comment={comment}
                                users={users}
                                currentUser={currentUser} />
                        )
                        )}
                    </div>
                )}
        </div >
    );
}