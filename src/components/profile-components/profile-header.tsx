import { Button } from "@/components/shadcn/ui/button";
import { Card, CardContent } from "@/components/shadcn/ui/card";
import { Badge } from "@/components/shadcn/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/ui/avatar";
import { Camera, Calendar, Mail, MapPin } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";


export default function ProfileHeader() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      try {
        await authClient.updateUser({
          image: await convertImageToBase64(file),
        });
        toast.success("Image uploaded successfully!");
      }
      catch (error) {
        console.error("Failed to upload image:", error);
        toast.error("Failed to upload image!");
      }
    };
  };

  async function convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function formattedDate(dateString: string) {
    const date = new Date(dateString);
    return date.toUTCString().split(' ').slice(1, 4).join(' ');
  }

  const { data: session } = authClient.useSession();

  const currentUser = session?.user as any; 

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <div className="relative">
            <Avatar className="relative h-34 w-48">
              <AvatarImage src={currentUser?.image} alt="Profile" />
              <AvatarFallback className="text-2xl">{currentUser?.name?.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="outline"
              className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full hover:scale-120">
              <Camera />
            </Button>
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0 "
              onChange={handleImageChange}
            />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <h1 className="text-2xl font-bold">{currentUser?.name}</h1>
              <Badge variant="secondary">{currentUser?.role || "user"}</Badge>
            </div>
            {/* <p className="text-muted-foreground">Senior Product Designer</p> */}
            <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Mail className="size-4" />
                {currentUser?.email}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="size-4" />
                {currentUser?.location || "Unknown Location"}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="size-4" />
                Joined {currentUser?.createdAt.toUTCString().split(' ').slice(1, 4).join(' ')} {/* error i browsern klagar på detta  */}
              </div> 
            </div>
          </div>
          {/* <Button variant="default">Edit Profile</Button> */}
        </div>
      </CardContent>
    </Card>
  );
}