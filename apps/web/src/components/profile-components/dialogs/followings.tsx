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
	following: FollowUserListItem[];
}

export function FollowingsDialog({ currentUser, children, following }: IProps) {
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
				<ModalTitle className="font-bold text-2xl">Following</ModalTitle>
				<div>
					{following && following.length > 0 ? (
						following.map((following) => (
							<div
								key={following.id}
								className="flex flex-row items-center space-x-4 p-2"
							>
								{following.image ? (
									<img
										src={following.image || "/default-avatar.png"}
										alt={`${following.name}'s avatar`}
										className="h-8 w-8 rounded-full"
									/>
								) : (
									<div className="flex h-8 w-8 flex-col items-center justify-center rounded-full bg-gray-300">
										<span className="text-gray-600">
											{following.name
												.split(" ")
												.map((n: string) => n[0])
												.join("")
												.toLocaleUpperCase()}
										</span>
									</div>
								)}
								<button
									type="button"
									onClick={() => handleGoToProfile(following.id)}
									className="hover:cursor-pointer hover:underline"
								>
									{following.name}
								</button>
							</div>
						))
					) : (
						<p>No followings yet.</p>
					)}
				</div>
			</ModalContent>
		</Modal>
	);
}
