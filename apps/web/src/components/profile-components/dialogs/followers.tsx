import { useRouter } from "@tanstack/react-router";
import type { User } from "@vibespot/database/schema";
import { useDisclosure } from "@/components/calendar/hooks";
import {
	Modal,
	ModalContent,
	ModalTitle,
	ModalTrigger,
} from "@/components/shadcn/ui/responsive-modal";
import type { FollowUserListItem } from "@/services/user-service";

interface IProps {
	children: React.ReactNode;
	currentUser?: User | null;
	followers?: FollowUserListItem[];
}

export function FollowersDialog({ currentUser, children, followers }: IProps) {
	const { isOpen, onToggle } = useDisclosure();
	const router = useRouter();

	const handleGoToProfile = (userId: string) => {
		router.navigate({ to: `/user/${userId}` });
	};

	return (
		<Modal open={isOpen} onOpenChange={onToggle} modal={true}>
			{currentUser?.role !== "user" && (
				<ModalTrigger onChange={onToggle} asChild>
					{children}
				</ModalTrigger>
			)}
			<ModalContent>
				<ModalTitle className="font-bold text-2xl">Followers</ModalTitle>
				<div>
					{followers && followers.length > 0 ? (
						followers.map((follower) => (
							<div
								key={follower.id}
								className="flex flex-row items-center space-x-4 p-2"
							>
								{follower.image ? (
									<img
										src={follower.image || "/default-avatar.png"}
										alt={`${follower.name}'s avatar`}
										className="h-8 w-8 rounded-full"
									/>
								) : (
									<div className="flex h-8 w-8 flex-col items-center justify-center rounded-full bg-gray-300">
										<span className="text-gray-600">
											{follower.name
												.split(" ")
												.map((n: string) => n[0])
												.join("")
												.toLocaleUpperCase()}
										</span>
									</div>
								)}
								<button
									type="button"
									onClick={() => handleGoToProfile(follower.id)}
									className="hover:cursor-pointer hover:underline"
								>
									{follower.name}
								</button>
							</div>
						))
					) : (
						<p>No followers yet.</p>
					)}
				</div>
			</ModalContent>
		</Modal>
	);
}
