import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Card, CardContent } from "../shadcn/ui/card";
import { Calendar, Mail, MapPin, Users, UserPlus } from "lucide-react";
import { Badge } from "../shadcn/ui/badge";
import { UserSocial } from "drizzle/db";
import { Button } from "../shadcn/ui/button";
import React from "react";
import { followUserFn, unfollowUserFn } from "@/services/user-service";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";

interface AccountHeaderProps {
    user: UserSocial;
    followersCount: number;
    followingCount: number;
    isFollowing?: boolean;
}

export default function AccountHeader({ user, followersCount, followingCount, isFollowing }: AccountHeaderProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);
    const [isOwnProfileState, setIsOwnProfileState] = React.useState(false);

    const currentUser = authClient.useSession();

    if (currentUser?.data?.user?.id === user.id && !isOwnProfileState) {
        setIsOwnProfileState(true)
        console.log("isOwnProfileState set to true")
    }
    else if (currentUser?.data?.user?.id !== user.id && isOwnProfileState) {
        setIsOwnProfileState(false)
        console.log("isOwnProfileState set to false")
    }

    const handleToggleFollow = async () => {
        setIsLoading(true);

        try {
            if (!isOwnProfileState && isFollowing) {
                unfollowUserFn({ data: { id: user.id } });
                router.invalidate()
            } else if (!isOwnProfileState && !isFollowing) {
                followUserFn({ data: { id: user.id } });
                router.invalidate()
            } else {
                toast.error('You cannot follow yourself.');
            }
        } catch (error) {
            toast.error('An error occurred while trying to follow/unfollow the user.');
            console.error('Error toggling follow:', error);
        } finally {
            setIsLoading(false);
        }
        await router.invalidate();
    };

    const formatJoinDate = (date: Date) => {
        try {
            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long'
            }).format(new Date(date));
        } catch {
            return "Unknown";
        }
    };

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
                    <Avatar className="h-32 w-32 rounded-full">
                        <AvatarImage src={user.image!} alt="Profile" className="rounded-full object-cover" />
                        <AvatarFallback className="text-2xl">{user?.name?.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-4">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                            <div className="flex flex-col gap-2 md:flex-row md:items-center">
                                <h1 className="text-2xl font-bold">{user?.name}</h1>
                                <Badge variant="secondary">{user?.role || "user"}</Badge>
                            </div>
                            {!isOwnProfileState && (
                                <Button
                                    variant={isFollowing ? "secondary" : "default"}
                                    onClick={handleToggleFollow}
                                    disabled={isLoading}
                                    className="flex items-center gap-2 min-w-[100px]"
                                >
                                    <UserPlus className="size-4" />
                                    {isLoading ? "..." : (isFollowing ? "Following" : "Follow")}
                                </Button>
                            )}
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                                <Users className="size-4" />
                                <span className="font-semibold text-foreground">{followersCount}</span>
                                <span>Followers</span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                                <Users className="size-4" />
                                <span className="font-semibold text-foreground">{followingCount}</span>
                                <span>Following</span>
                            </div>
                        </div>
                        <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-1">
                                <Mail className="size-4" />
                                {user?.email}
                            </div>
                            <div className="flex items-center gap-1">
                                <MapPin className="size-4" />
                                {user?.location || "Unknown Location"}
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="size-4" />
                                Joined {formatJoinDate(user?.createdAt)}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}