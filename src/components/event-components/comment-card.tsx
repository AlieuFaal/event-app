import { DiscJockeyImage } from "@/assets";
import { Avatar, AvatarFallback, AvatarImage } from "../shadcn/ui/avatar";
import { Card } from "../shadcn/ui/card";
import { parseISO } from "date-fns";
import { Comment, CurrentUser, User } from "drizzle/db";

interface CommentCardProps {
    comment: Comment;
    currentUser: CurrentUser;
    users: User[];
    allowUpvote?: boolean;
    onChange: (change: any) => void;
    onDelete: () => void;
}

export default function CommentCard({ comment, users, onChange, onDelete }: CommentCardProps) {

    function getCommentCreatorName(comment: Comment) {

        const creator = users.find((user) => user.id === comment.userId);

        return creator ? creator.name : "Unknown";
    }

    function getCommentCreatorImage(comment: Comment) {

        const creator = users.find((user) => user.id === comment.userId);
        return creator ? creator.image : DiscJockeyImage;
    }

    return (
        <div className="mt-3">
            <Card className="bg-card text-card-foreground flex flex-col shadow-lg transition-all border-1">
                <div className="flex justify-end mx-2">
                    <p className="text-sm text-muted-foreground ">{comment.createdAt.toUTCString()}</p>
                </div>
                <div className="flex flex-row items-center space-x-2 px-3 -mt-10">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={getCommentCreatorImage(comment)} alt="Profile" />
                        <AvatarFallback className="text-2xl">{"user?.name?.split(' ').map((n: string) => n[0]).join('')"}</AvatarFallback>
                    </Avatar>
                    <p className="font-light text-md">{getCommentCreatorName(comment)}</p>
                </div>
                <div className="px-17 font-normal text-md -my-8 mb-1 flex flex-row justify-between">
                    <p>{comment.content}</p>
                </div>
            </Card>
        </div>
    )
}       