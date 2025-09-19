import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Card, CardContent } from "../shadcn/ui/card";
import { authClient } from "@/lib/auth-client";
import { Calendar, Mail, MapPin } from "lucide-react";
import { Badge } from "../shadcn/ui/badge";


export default function AccountsHeader() {
    const { data: session } = authClient.useSession();

    const user = session?.user as any;

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
                    <div className="relative">
                        <Avatar className="relative h-34 w-48">
                            <AvatarImage src={user?.image} alt="Profile" />
                            <AvatarFallback className="text-2xl">{user?.name?.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center">
                            <h1 className="text-2xl font-bold">{user?.name}</h1>
                            <Badge variant="secondary">{user?.role || "user"}</Badge>
                        </div>
                        {/* <p className="text-muted-foreground">Senior Product Designer</p> */}
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
                                Joined {user?.createdAt.toUTCString().split(' ').slice(1, 4).join(' ')} {/* error i browsern klagar på detta  */}
                            </div>
                        </div>
                    </div>
                    {/* <Button variant="default">Edit Profile</Button> */}
                </div>
            </CardContent>
        </Card>
    )
}   