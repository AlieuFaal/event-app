import { Avatar, AvatarFallback, AvatarImage } from "../shadcn/ui/avatar";
import { Comment, User } from "@vibespot/database/schema";
import { toast } from "sonner";
import { router } from "@/router";
import { Button } from "../shadcn/ui/button";
import { PlaceholderImage1 } from "@/assets";

interface CommentCardProps {
    users: User[];
    comment: Comment;
}

export default function CommentCard({ comment, users }: CommentCardProps) {
    const commentCreator = users.find((user) => user.id === comment.userId);
    const creatorName = commentCreator?.name ?? "Unknown";
    const creatorImage = commentCreator?.image ?? PlaceholderImage1;
    const creatorInitials = creatorName
        .split(" ")
        .map((namePart) => namePart[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    function visitUserProfile(comment: Comment) {
        const user = users.find((user) => user.id === comment.userId);

        console.log("Visiting profile of user:", user?.name);

        if (!user) {
            return toast.error("User not found. Please try again.");
        }

        return router.navigate({ to: `/user/${user.id}` })
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
                            className="h-auto p-0 text-sm font-medium text-foreground hover:text-primary"
                            variant="link"
                            onClick={() => visitUserProfile(comment)}
                        >
                            {creatorName}
                        </Button>
                        <p className="text-xs text-muted-foreground">{comment.createdAt.toLocaleString()}</p>
                    </div>

                    <p className="break-words text-sm leading-relaxed text-foreground/90">{comment.content}</p>
                </div>
            </div>
        </div>
    )
}
