import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import NouteStats from "./NouteStats";

type NouteCardProps = {
    noute: Models.Document;
};

const NouteCard = ({ noute }: NouteCardProps) => {
    const { user } = useUserContext();

    return (
        <div className="noute-card">
            <div className="flex-between">
                <div className="flex items-center gap-3">
                    <Link to={`/profile/${noute.creator.$id}`}>
                        <img
                            src={
                                noute?.creator?.imageUrl ||
                                "/assets/images/icons/profile-placeholder.svg"
                            }
                            alt="creator"
                            className="rounded-full w-12 lg:h-12"
                        />
                    </Link>

                    <div className="flex flex-col">
                        <p className="base-medium lg:body-bold text-light-1">
                            {noute.creator.username}
                        </p>
                        <div className="flex-center gap-2 text-light-3">
                            <p className="subtle-semibold lg:small-regular">
                                {multiFormatDateString(noute.$createdAt)}
                            </p>
                            •
                            <p className="subtle-semibold lg:small-regular">
                                {noute.location}
                            </p>
                        </div>
                    </div>
                </div>

                <Link
                    to={`/update-noute/${noute.$id}`}
                    className={`${user.id !== noute.creator.$id && "hidden"}`}
                >
                    <img
                        src="/assets/images/icons/edit.svg"
                        alt="edit"
                        width={20}
                        height={20}
                    />
                </Link>
            </div>
            <Link to={`/noutes/${noute.$id}`}>
                <div className="small-medium lg:base-medium py-5">
                    <p>{noute.caption}</p>
                    <ul className="flex gap-1 mt-2">
                        {noute.tags &&
                            noute.tags.map((tag: string, index: string) => (
                                <li
                                    key={`${tag}${index}`}
                                    className="text-light-3 small-regular"
                                >
                                    #{tag}
                                </li>
                            ))}
                    </ul>
                </div>

                <img
                    src={
                        noute.imageUrl ||
                        "/assets/images/icons/profile-placeholder.svg"
                    }
                    alt="noute image"
                    className="noute-card_img"
                />
            </Link>

            <NouteStats noute={noute} userId={user.id} />
        </div>
    );
};

export default NouteCard;
