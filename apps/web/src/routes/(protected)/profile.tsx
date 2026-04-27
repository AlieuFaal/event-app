import ProfileContent from "@/components/profile-components/profile-content";
import ProfileHeader from "@/components/profile-components/profile-header";
import { Spinner } from "@/components/shadcn/ui/shadcn-io/spinner";
import {
  getContextFollowersFn,
  getContextFollowingFn,
  getCurrentUserFn,
} from "@/services/user-service";
import { ClientOnly, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/profile")({
  component: ProfileComponent,
  loader: async () => {
    const [followersData, followingData, currentUser] = await Promise.all([
      getContextFollowersFn(),
      getContextFollowingFn(),
      getCurrentUserFn(),
    ]);

    return {
      followersCount: followersData.followerCount,
      followingCount: followingData.followingCount,
      followers: followersData.followers,
      following: followingData.following,
      currentUser,
    };
  },
});

function ProfileComponent() {
  const { followers, following, followersCount, followingCount, currentUser } =
    Route.useLoaderData();

  if (!currentUser) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Spinner className="text-primary" variant="default" size={100} />
      </div>
    );
  }

  return (
    <ClientOnly
      fallback={
        <div className="flex flex-col justify-center items-center h-screen">
          <Spinner className="text-primary" variant="default" size={100} />
        </div>
      }
    >
      <div className="p-8">
        <ProfileHeader
          followers={followers}
          following={following}
          followersCount={followersCount}
          followingCount={followingCount}
          currentUser={currentUser}
        />
        <ProfileContent currentUser={currentUser} />
      </div>
    </ClientOnly>
  );
}
