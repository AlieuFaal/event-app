import { Button } from "../shadcn/ui/button";
import { Textarea } from "../shadcn/ui/textarea";
import CommentCard from "./comment-card";
import { authClient } from "@/lib/auth-client";
import { Comment, commentInsertSchema, User } from "@vibespot/database/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { FormControl, FormField, FormItem, Form, FormMessage } from "../shadcn/ui/form";
import { toast } from "sonner";
import { postCommentForEventFn } from "@/services/eventService";
import { useForm } from "react-hook-form";
import { EventWithComments } from "@vibespot/database/schema";
import { m } from "@/paraglide/messages";
import { useRouter } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "../shadcn/ui/avatar";
import { SendHorizontal } from "lucide-react";
import { getEventAccent } from "./event-accent";

export default function CommentSection({ event, users, currentUser }: { event: EventWithComments, users: User[], currentUser?: User | null}) {
    const router = useRouter();

    const form = useForm<z.infer<typeof commentInsertSchema>>({
        mode: "onBlur",
        resolver: zodResolver(commentInsertSchema),
    })

    const session = authClient.useSession();
    const commentCount = event.comments?.length ?? 0;
    const currentUserId = currentUser?.id ?? session.data?.user.id;
    const activeUser = users.find((user) => user.id === currentUserId);
    const composerName = activeUser?.name ?? session.data?.user.name ?? "You";
    const composerImage = activeUser?.image ?? session.data?.user.image ?? undefined;
    const accent = getEventAccent(event.color);
    const composerInitials = composerName
        .split(" ")
        .map((namePart) => namePart[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const onSubmit = async (values: z.infer<typeof commentInsertSchema>) => {
        if (!session.data) {
            toast.warning(m.toast_comment_login_required());
            return;
        }
        if (!currentUserId) {
            toast.warning(m.toast_comment_login_required());
            return;
        }

        const newComment: Comment = {
            ...values,
            id: crypto.randomUUID(),
            userId: currentUserId,
            eventId: event.id,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        try {
            const response = await postCommentForEventFn({ data: newComment });
            if (response) {
                toast.success(m.toast_comment_success());
                form.reset();
                // Invalidate router to refetch event data with new comment
                await router.invalidate();
            } else {
                toast.error(m.toast_comment_failed());
            }
        } catch (error) {
            console.error("Error posting comment:", error);
            toast.error(m.toast_comment_error());
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold tracking-tight">{m.comments_title()}</h3>
                <span
                    className="rounded-full border px-2.5 py-1 text-xs font-medium text-black"
                    style={{
                        borderColor: accent.borderSoft,
                        backgroundColor: accent.bgSoft,
                        color: accent.textStrong,
                    }}
                >
                    {commentCount}
                </span>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <FormField
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-start gap-3">
                                    <Avatar className="mt-0.5 size-10 border border-border/60">
                                        {composerImage ? (
                                            <AvatarImage src={composerImage} alt={composerName} />
                                        ) : null}
                                        <AvatarFallback>{composerInitials}</AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 space-y-2">
                                        <FormControl>
                                            <Textarea
                                                id="commentTextArea"
                                                rows={3}
                                                className="min-h-10 max-h-20 rounded-xl border-border/60 bg-muted/25"
                                                placeholder={m.comments_placeholder()}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </div>

                                    <Button
                                        type="submit"
                                        size="icon"
                                        className="mt-0.5 rounded-full border hover:cursor-pointer hover:scale-110 transition-transform"
                                        style={{
                                            borderColor: accent.borderSoft,
                                            backgroundColor: accent.bgSoft,
                                            color: accent.textStrong,
                                        }}
                                    >
                                        <SendHorizontal className="size-4" style={{ color: accent.accent }} />
                                        <span className="sr-only">{m.button_submit()}</span>
                                    </Button>
                                </div>
                            </FormItem>
                        )}
                    />
                </form>
            </Form>

            {!event.comments || event.comments.length === 0 ? (<p className="text-center text-muted-foreground">{m.comments_none()}</p>)
                : (
                    <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
                        {event.comments.map((comment) => (
                            <CommentCard
                                key={comment.id}
                                comment={comment}
                                users={users} />
                        )
                        )}
                    </div>
                )}
        </div >
    );
}
