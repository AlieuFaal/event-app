import { Button } from "@/components/shadcn/ui/button";
import { Card, CardContent } from "@/components/shadcn/ui/card";
import { Badge } from "@/components/shadcn/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/ui/avatar";
import { Camera, Calendar, Mail, MapPin, Users } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";
import { m } from "@/paraglide/messages";

interface ProfileHeaderProps {
  followersCount: number;
  followingCount: number;
}

export default function ProfileHeader({ followersCount, followingCount }: ProfileHeaderProps) {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: session } = authClient.useSession();
  const currentUser = session?.user as any;

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
        toast.success(m.toast_image_upload_success());
      }
      catch (error) {
        console.error("Failed to upload image:", error);
        toast.error(m.toast_image_upload_error());
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
          <div className="relative">
            <Avatar className="relative h-34 w-48">
              <AvatarImage src={currentUser?.image!} alt="Profile" />
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
          <div className="flex-1 space-y-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <h1 className="text-2xl font-bold">{currentUser?.name}</h1>
                <Badge variant="secondary">{currentUser?.role || m.role_user()}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                <Users className="size-4" />
                <span className="font-semibold text-foreground">{followersCount}</span>
                <span>{m.followers()}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                <Users className="size-4" />
                <span className="font-semibold text-foreground">{followingCount}</span>
                <span>{m.following()}</span>
              </div>
            </div>
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
                {m.joined()} {formatJoinDate(currentUser?.createdAt)}
              </div>
            </div>
          </div>
          {/* <Button variant="default">Edit Profile</Button> */}
        </div>
      </CardContent>
    </Card>
  );
}