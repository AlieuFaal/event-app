import { useRouter } from "@tanstack/react-router";
import type { User } from "@vibespot/database/schema";
import { Calendar, Camera, Mail, MapPin, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/shadcn/ui/avatar";
import { Badge } from "@/components/shadcn/ui/badge";
import { Button } from "@/components/shadcn/ui/button";
import { Card, CardContent } from "@/components/shadcn/ui/card";
import { authClient } from "@/lib/auth-client";
import { uploadImage } from "@/lib/image-upload";
import { m } from "@/paraglide/messages";
import type { FollowUserListItem } from "@/services/user-service";
import { FollowersDialog } from "./dialogs/followers";
import { FollowingsDialog } from "./dialogs/followings";

interface ProfileHeaderProps {
	currentUser: User;
	followers: FollowUserListItem[];
	following: FollowUserListItem[];
	followersCount: number;
	followingCount: number;
}

export default function ProfileHeader({
	followersCount,
	followingCount,
	currentUser,
	followers,
	following,
}: ProfileHeaderProps) {
	const [isUploadingImage, setIsUploadingImage] = useState(false);
	const router = useRouter();

	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			try {
				setIsUploadingImage(true);
				const { url } = await uploadImage({
					file,
					kind: "avatar",
					userId: currentUser.id,
				});
				await authClient.updateUser({
					image: url,
				});
				await router.invalidate();
				toast.success(m.toast_image_upload_success());
			} catch (error) {
				console.error("Failed to upload image:", error);
				toast.error(m.toast_image_upload_error());
			} finally {
				setIsUploadingImage(false);
				e.target.value = "";
			}
		}
	};

	const formatJoinDate = (date?: Date | string | null) => {
		if (!date) {
			return "Unknown";
		}

		try {
			return new Intl.DateTimeFormat("en-US", {
				year: "numeric",
				month: "long",
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
						{/*<div className="inline-flex relative -top-5 -left-2 items-center bg-primary/10 px-4 py-1 rounded-full gap-2 border-primary/30 border text-xs uppercase tracking-[0.18em] text-primary">
              <User2 size={18} />
              Profile
            </div>*/}
						<Avatar className="h-32 w-32">
							<AvatarImage
								src={currentUser?.image ?? undefined}
								alt="Profile"
							/>
							<AvatarFallback className="text-2xl">
								{currentUser?.name
									?.split(" ")
									.map((n: string) => n[0])
									.join("")
									.toLocaleUpperCase()}
							</AvatarFallback>
						</Avatar>
						<Button
							size="icon"
							variant="outline"
							disabled={isUploadingImage}
							className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full hover:scale-120"
						>
							<Camera />
						</Button>
						<input
							type="file"
							accept="image/*"
							className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
							disabled={isUploadingImage}
							onChange={handleImageChange}
						/>
					</div>
					<div className="flex-1 space-y-4">
						<div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
							<div className="flex flex-col gap-2 md:flex-row md:items-center">
								<h1 className="font-bold text-2xl">{currentUser?.name}</h1>
								<Badge variant="secondary">
									{currentUser?.role || m.role_user()}
								</Badge>
							</div>
						</div>
						<div className="flex items-center gap-6 text-sm">
							<FollowersDialog currentUser={currentUser} followers={followers}>
								<div className="flex cursor-pointer items-center gap-1 text-muted-foreground transition-colors hover:text-foreground">
									<Users className="size-4" />
									<span className="font-semibold text-foreground">
										{followersCount}
									</span>
									<span>{m.followers()}</span>
								</div>
							</FollowersDialog>
							<FollowingsDialog following={following} currentUser={currentUser}>
								<div className="flex cursor-pointer items-center gap-1 text-muted-foreground transition-colors hover:text-foreground">
									<Users className="size-4" />
									<span className="font-semibold text-foreground">
										{followingCount}
									</span>
									<span>{m.following()}</span>
								</div>
							</FollowingsDialog>
						</div>
						<div className="flex flex-wrap gap-4 text-muted-foreground text-sm">
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
