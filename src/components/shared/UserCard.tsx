import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useFollowUser, useUnfollowUser } from "@/lib/react-query/queriesAndMutation";
import { useState, useEffect } from "react";
import { checkIsFollowing } from "@/lib/appwrite/api";



type UserCardProps = {
  user: Models.Document;
};

const UserCard = ({ user }: UserCardProps) => {
  const { user: currentUser } = useUserContext();
  const [isFollowing, setIsFollowing] = useState(false);
  const { mutate: followUser } = useFollowUser();
  const { mutate: unfollowUser } = useUnfollowUser();

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (currentUser && user.$id !== currentUser.id) {
        const followStatus = await checkIsFollowing(currentUser.id, user.$id);
        setIsFollowing(followStatus);
      }
    };
    checkFollowStatus();
  }, [user, currentUser]);

  const handleFollowUnfollow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user.$id === currentUser.id) return; // Prevent self-following

    if (isFollowing) {
      unfollowUser({ followerId: currentUser.id, followingId: user.$id });
      setIsFollowing(false);
    } else {
      followUser({ followerId: currentUser.id, followingId: user.$id });
      setIsFollowing(true);
    }
  };

  const isCurrentUser = user.$id === currentUser.id;

  return (
    <Link to={`/profile/${user.$id}`} className="user-card">
      <img
        src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="rounded-full w-14 h-14"
      />

      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-light-1 text-center line-clamp-1">
          {user.name}
        </p>
        <p className="small-regular text-light-3 text-center line-clamp-1">
          @{user.username}
        </p>
        <p className="small-regular text-light-3 text-center line-clamp-1">
          {user.followersCount} followers
        </p>
      </div>

      {!isCurrentUser && (
        <Button
          type="button"
          size="sm"
          className="shad-button_primary px-5"
          onClick={(e) => {
            e.preventDefault();
            handleFollowUnfollow(e);
          }}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </Button>
      )}
    </Link>
  );
};

export default UserCard;
