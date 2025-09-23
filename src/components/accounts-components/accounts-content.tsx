import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/ui/tabs";
import { EventWithComments, User } from "drizzle/db/schema";
import FavoriteEventCards from "../favorites-components/favoriteEventCards";
import EventCards from "../event-components/event-cards";

interface AccountContentProps {
    userId: string;
    user: User;
    events: EventWithComments[];
    favoriteEvents: EventWithComments[];
}

export default function AccountContent({ userId, user, events, favoriteEvents }: AccountContentProps) {

    return (
        <Tabs defaultValue="profile" className="space-y-6 mt-8">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">Bio</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
                <TabsTrigger value="liked-artists">Liked Artists</TabsTrigger>
            </TabsList>

            {/* User Information */}
            <TabsContent value="profile" className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Bio</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="">{!user.bio ? "User has no bio..." : user.bio}</p>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* User Events */}
            <TabsContent value="events" className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Events</CardTitle>
                        <CardDescription>Events created by this user will be displayed here.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <EventCards users={[user]} events={events} />
                    </CardContent>
                </Card>
            </TabsContent>

            {/* User Favorites */}
            <TabsContent value="favorites" className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Favorites</CardTitle>
                        <CardDescription>The users favorite events will show up here.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FavoriteEventCards favoriteEvents={favoriteEvents} users={[user]} />
                    </CardContent>
                </Card>
            </TabsContent>

            {/* User liked artists */}
            <TabsContent value="liked-artists" className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Liked artists</CardTitle>
                        <CardDescription></CardDescription>
                    </CardHeader>

                </Card>
            </TabsContent>
        </Tabs >
    );
}