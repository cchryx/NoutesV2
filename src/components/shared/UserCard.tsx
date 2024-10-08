import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { Button } from "../ui/button";

type UserCardProps = {
    user: Models.Document;
};

const UserCard = ({ user }: UserCardProps) => {
    return (
        <div className="user-card">
            <Link to={`/profile/${user.$id}`}>
                <img
                    src={
                        user.imageUrl || "/assets/icons/profile-placeholder.svg"
                    }
                    alt="creator"
                    className="rounded-full w-14 h-14"
                />
            </Link>

            <div className="flex-center flex-col gap-1">
                <Link to={`/profile/${user.$id}`}>
                    <p className="base-medium text-light-1 text-center line-clamp-1">
                        {user.name}
                    </p>
                </Link>
                <Link to={`/profile/${user.$id}`}>
                    <p className="small-regular text-light-3 text-center line-clamp-1">
                        @{user.username}
                    </p>
                </Link>
            </div>

            <Button
                type="button"
                size="sm"
                className="shad-button_primary px-5"
                onClick={() => {
                    console.log("clicked");
                }}
            >
                Follow
            </Button>
        </div>
    );
};

export default UserCard;
