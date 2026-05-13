import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import type { schema } from "@vibespot/database/schema";
import { SendHorizontal } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import { m } from "@/paraglide/messages";
import { postCommentForEventFn } from "@/services/eventService";
import { Avatar, AvatarFallback, AvatarImage } from "../shadcn/ui/avatar";
import { Button } from "../shadcn/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "../shadcn/ui/form";
import { Textarea } from "../shadcn/ui/textarea";
import CommentCard from "./comment-card";
import { getEventAccent } from "./event-accent";

type CommentSectionEvent = Pick<
	typeof schema.event.$inferSelect,
	"id" | "color"
> & {
	comments?: Array<typeof schema.comment.$inferSelect>;
};

type CommentSectionUser = Pick<
	typeof schema.user.$inferSelect,
	"id" | "name" | "image"
>;

type CommentSectionCurrentUser = Pick<
	typeof schema.user.$inferSelect,
	"id"
> | null;

const commentFormSchema = z.object({
	content: z.string().min(1, "Please enter your comment"),
});

type CommentFormValues = z.infer<typeof commentFormSchema>;

export default function CommentSection({
	event,
	users,
	currentUser,
}: {
	event: CommentSectionEvent;
	users: CommentSectionUser[];
	currentUser?: CommentSectionCurrentUser;
}) {
	const router = useRouter();

	const form = useForm<CommentFormValues>({
		mode: "onBlur",
		resolver: zodResolver(commentFormSchema),
	});

	const session = authClient.useSession();
	const commentCount = event.comments?.length ?? 0;
	const currentUserId = currentUser?.id ?? session.data?.user.id;
	const activeUser = users.find((user) => user.id === currentUserId);
	const composerName = activeUser?.name ?? session.data?.user.name ?? "You";
	const composerImage =
		activeUser?.image ?? session.data?.user.image ?? undefined;
	const accent = getEventAccent(event.color);
	const composerInitials = composerName
		.split(" ")
		.map((namePart) => namePart[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

	const onSubmit = async (values: CommentFormValues) => {
		if (!session.data) {
			toast.warning(m.toast_comment_login_required());
			return;
		}
		if (!currentUserId) {
			toast.warning(m.toast_comment_login_required());
			return;
		}

		try {
			const response = await postCommentForEventFn({
				data: {
					eventId: event.id,
					content: values.content,
				},
			});
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
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h3 className="font-semibold text-lg tracking-tight">
					{m.comments_title()}
				</h3>
				<span
					className="rounded-full border px-2.5 py-1 font-medium text-black text-xs"
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
												className="max-h-20 min-h-10 rounded-xl border-border/60 bg-muted/25"
												placeholder={m.comments_placeholder()}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</div>

									<Button
										type="submit"
										size="icon"
										className="mt-0.5 rounded-full border transition-transform hover:scale-105 hover:cursor-pointer"
										style={{
											borderColor: accent.borderSoft,
											backgroundColor: accent.bgSoft,
											color: accent.textStrong,
										}}
									>
										<SendHorizontal
											className="size-4"
											style={{ color: accent.accent }}
										/>
										<span className="sr-only">{m.button_submit()}</span>
									</Button>
								</div>
							</FormItem>
						)}
					/>
				</form>
			</Form>

			{!event.comments || event.comments.length === 0 ? (
				<p className="text-center text-muted-foreground">{m.comments_none()}</p>
			) : (
				<div className="max-h-80 space-y-3 overflow-y-auto pr-1">
					{event.comments.map((comment) => (
						<CommentCard key={comment.id} comment={comment} users={users} />
					))}
				</div>
			)}
		</div>
	);
}
