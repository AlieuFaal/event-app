import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@vibespot/database";
import { View } from "react-native";

export function ProfileCard({user}: {user: User | undefined}) {

    return (
        <>
            <Card className="w-11/12 h-32 mt-5 justify-center items-center rounded-3xl mx-auto shadow drop-shadow-lg border-primary dark:bg-secondary-foreground dark:border-0">
                <CardContent className="flex-1 flex-row w-full h-full justify-start items-center">
                    <Avatar className="-left-3 w-20 h-20 justify-center items-center overflow-hidden rounded-full border-2 border-primary" alt={"ProfileImage"}>
                        <AvatarImage source={{ uri: user?.image || undefined }} />
                        <AvatarFallback>{user?.name?.split(' ').map((n: string) => n[0]).join('').toLocaleUpperCase()}</AvatarFallback>
                    </Avatar>
                    <View className="w-fit h-full justify-center items-start -left-5">
                        <CardHeader>
                            <CardTitle className="text-2xl dark:text-white">{user?.name}</CardTitle>
                            <CardDescription className="dark:text-gray-400">{user?.email}</CardDescription>
                        </CardHeader>
                    </View>
                </CardContent>
            </Card>
        </>
    )
}