import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { NouteStats } from "@/components/shared";
import { useUserContext } from "@/context/AuthContext";

type GridNouteListProps = {
    noutes: Models.Document[];
    showUser?: boolean;
    showStats?: boolean;
};

const GridNoutesList = ({
    noutes,
    showUser = true,
    showStats = true,
}: GridNouteListProps) => {
    const { user } = useUserContext();

    return (
        <ul className="grid-container">
            {noutes.map((noute) => (
                <li key={noute.$id} className="relative min-w-80 h-80">
                    <Link
                        to={`/noutes/${noute.$id}`}
                        className="grid-noute_link"
                    >
                        <img
                            src={noute.imageUrl}
                            alt="noute"
                            className="h-full w-full object-cover"
                        />
                    </Link>

                    <div className="grid-noute_user">
                        {showUser && (
                            <div className="flex items-center justify-start gap-2 flex-1">
                                <img
                                    src={
                                        noute.creator.imageUrl ||
                                        "/assets/icons/profile-placeholder.svg"
                                    }
                                    alt="creator"
                                    className="w-8 h-8 rounded-full"
                                />
                                <p className="line-clamp-1">
                                    {noute.creator.username}
                                </p>
                            </div>
                        )}
                        {showStats && (
                            <NouteStats noute={noute} userId={user.id} />
                        )}
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default GridNoutesList;
