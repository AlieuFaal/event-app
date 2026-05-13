import { useNavigate } from "@tanstack/react-router";
import type { schema } from "@vibespot/database/schema";
import { toast } from "sonner";
import { PlaceholderImage1 } from "@/assets";
import { Avatar, AvatarFallback, AvatarImage } from "../shadcn/ui/avatar";
import { Button } from "../shadcn/ui/button";

type CommentCardUser = Pick<
	typeof schema.user.$inferSelect,
	"id" | "name" | "image"
>;

type CommentCardComment = Pick<
	typeof schema.comment.$inferSelect,
	"id" | "userId" | "content" | "createdAt"
>;

interface CommentCardProps {
	users: CommentCardUser[];
	comment: CommentCardComment;
}

export default function CommentCard({ comment, users }: CommentCardProps) {
	const navigate = useNavigate();
	const commentCreator = users.find((user) => user.id === comment.userId);
	const creatorName = commentCreator?.name ?? "Unknown";
	const creatorImage = commentCreator?.image ?? PlaceholderImage1;
	const creatorInitials = creatorName
		.split(" ")
		.map((namePart) => namePart[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

	function visitUserProfile(comment: CommentCardComment) {
		const user = users.find((user) => user.id === comment.userId);

		console.log("Visiting profile of user:", user?.name);

		if (!user) {
			return toast.error("User not found. Please try again.");
		}

		return navigate({ to: "/user/$id", params: { id: user.id } });
	}

	return (
		<div className="rounded-xl border border-border/60 bg-muted/25 p-3">
			<div className="flex gap-3">
				<Avatar className="size-10 border border-border/60">
					<AvatarImage src={creatorImage} alt={`${creatorName} profile`} />
					<AvatarFallback>{creatorInitials}</AvatarFallback>
				</Avatar>

				<div className="min-w-0 flex-1">
					<div className="mb-1 flex items-center justify-between gap-3">
						<Button
							className="h-auto p-0 font-medium text-foreground text-sm hover:text-primary"
							variant="link"
							onClick={() => visitUserProfile(comment)}
						>
							{creatorName}
						</Button>
						<p className="text-muted-foreground text-xs">
							{comment.createdAt.toLocaleString()}
						</p>
					</div>

					<p className="break-words text-foreground/90 text-sm leading-relaxed">
						{comment.content}
					</p>
				</div>
			</div>
		</div>
	);
}
