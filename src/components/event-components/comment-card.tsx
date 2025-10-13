import { Avatar, AvatarFallback, AvatarImage } from "../shadcn/ui/avatar";
import { Card } from "../shadcn/ui/card";
import { Comment, CurrentUser, EventWithComments, User } from "drizzle/db";
import { toast } from "sonner";
import { router } from "@/router";
import { Button } from "../shadcn/ui/button";
import { PlaceholderImage1 } from "@/assets";

interface CommentCardProps {
    users: User[];
    comment: Comment;
    currentUser: CurrentUser;
}

export default function CommentCard({ comment, users, currentUser }: CommentCardProps) {

    function getCommentCreatorName(comment: Comment) {

        const creator = users.find((user) => user.id === comment.userId);

        return creator ? creator.name : "Unknown";
    }

    function getCommentCreatorImage(comment: Comment) {

        const creator = users.find((user) => user.id === comment.userId);
        return creator ? creator.image! : PlaceholderImage1;
    }

    function visitUserProfile(comment: Comment) {
        const user = users.find((user) => user.id === comment.userId);

        console.log("Visiting profile of user:", user?.name);

        if (!user) {
            return toast.error("User not found. Please try again.");
        }

        return router.navigate({ to: `/user/${user.id}` })
    }

    const commentOwner = users.find((user) => user.id === comment?.userId);

    return (
        <div className="mt-3">
            <Card className="bg-card text-card-foreground flex flex-col transition-all border-1 hover:shadow-lg hover:scale-105 hover:border-purple-600 mb-3">
                <div className="flex justify-end mx-2">
                    <p className="text-sm text-muted-foreground ">{comment.createdAt.toUTCString()}</p>
                </div>
                <div className="flex flex-row items-center space-x-2 px-3 -mt-10">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={getCommentCreatorImage(comment)} alt="Profile"/>
                        <AvatarFallback className="text-2xl">{commentOwner?.name?.split(' ').map((n: string) => n[0]).join('').toLocaleUpperCase()}</AvatarFallback>
                    </Avatar>
                    <Button className="font-light text-md -mx-4" variant={"link"} onClick={() => visitUserProfile(comment)}>{getCommentCreatorName(comment)}</Button>
                </div>
                <div className="px-17 font-normal text-md -my-8 mb-1 flex flex-row justify-between">
                    <p>{comment.content}</p>
                </div>
            </Card>
        </div>
    )
}