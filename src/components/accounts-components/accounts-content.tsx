import { Card, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/ui/tabs";
import { authClient } from "@/lib/auth-client";
import { User } from "drizzle/db/schema";

export default function AccountContent() {
    const { data: session } = authClient.useSession();
    const currentUser = session?.user as User;

    return (
        <Tabs defaultValue="profile" className="space-y-6 mt-8">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
                <TabsTrigger value="liked-artists">Liked Artists</TabsTrigger>
                <TabsTrigger value="notifications">Something Random</TabsTrigger>
            </TabsList>

            {/* Personal Information */}
            <TabsContent value="profile" className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription></CardDescription>
                    </CardHeader>
                </Card>
            </TabsContent>

            {/* Account Settings */}
            <TabsContent value="favorites" className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Favorites</CardTitle>
                        <CardDescription></CardDescription>
                    </CardHeader>

                </Card>

                <Card className="border-destructive/50">
                    <CardHeader>
                        <CardTitle className="text-destructive">Danger Zone</CardTitle>
                        <CardDescription>Irreversible and destructive actions</CardDescription>
                    </CardHeader>

                </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="liked-artists" className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Security Settings</CardTitle>
                        <CardDescription></CardDescription>
                    </CardHeader>

                </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="something-random" className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Something Random</CardTitle>
                        <CardDescription></CardDescription>
                    </CardHeader>

                </Card>
            </TabsContent>
        </Tabs >
    );
}