import React, { useEffect, useState } from "react";
import { Models } from "appwrite";

import {} from "@/context/AuthContext";
import {
    useDeleteSavedNoute,
    useGetCurrentUser,
    useLikeNoute,
    useSaveNoute,
} from "@/lib/react-query/queries";
import { checkIsLiked } from "@/lib/utils";
import Loader from "./Loader";

type NouteStatsProps = {
    noute: Models.Document;
    userId: string;
};

const NouteStats = ({ noute, userId }: NouteStatsProps) => {
    const likesList = noute.likes.map((user: Models.Document) => user.$id);

    const [likes, setLikes] = useState(likesList);
    const [isSaved, setIsSaved] = useState(false);

    const { mutate: likeNoute } = useLikeNoute();
    const { mutate: saveNoute, isPending: isSavingNoute } = useSaveNoute();
    const { mutate: deleteSavedNoute, isPending: isDeletingSavedNoute } =
        useDeleteSavedNoute();

    const { data: currentUser } = useGetCurrentUser();

    const savedNouteRecord = currentUser?.save.find(
        (record: Models.Document) => record.noute.$id === noute.$id
    );

    useEffect(() => {
        setIsSaved(!!savedNouteRecord);
    }, [currentUser]);

    const handleLikeNoute = (
        e: React.MouseEvent<HTMLImageElement, MouseEvent>
    ) => {
        e.stopPropagation();

        let likesArray = [...likes];

        if (likesArray.includes(userId)) {
            likesArray = likesArray.filter((Id) => Id !== userId);
        } else {
            likesArray.push(userId);
        }

        setLikes(likesArray);
        likeNoute({ nouteId: noute.$id, likesArray });
    };

    const handleSaveNoute = (
        e: React.MouseEvent<HTMLImageElement, MouseEvent>
    ) => {
        e.stopPropagation();

        if (savedNouteRecord) {
            setIsSaved(false);
            return deleteSavedNoute(savedNouteRecord.$id);
        } else {
            saveNoute({
                userId: userId,
                nouteId: noute.$id,
                creatorId: noute.creator.$id,
            });
            setIsSaved(true);
        }
    };

    const containerStyles = location.pathname.startsWith("/profile")
        ? "w-full"
        : "";

    return (
        <div
            className={`flex justify-between items-center z-20 ${containerStyles}`}
        >
            <div className="flex gap-2 mr-5">
                <img
                    src={`${
                        checkIsLiked(likes, userId)
                            ? "/assets/images/icons/liked.svg"
                            : "/assets/images/icons/like.svg"
                    }`}
                    alt="like"
                    width={25}
                    height={25}
                    onClick={handleLikeNoute}
                    className="cursor-pointer"
                />
                <p className="text-xl sm:text-lg">{likes.length}</p>
            </div>
            <div className="flex gap-2">
                {isSavingNoute || isDeletingSavedNoute ? (
                    <Loader />
                ) : (
                    <img
                        src={
                            isSaved
                                ? "/assets/images/icons/saved.svg"
                                : "/assets/images/icons/save.svg"
                        }
                        alt="save"
                        width={25}
                        height={25}
                        onClick={handleSaveNoute}
                        className="cursor-pointer"
                    />
                )}
                {/* <p className="small-medium lg:base-medium">0</p> */}
            </div>
        </div>
    );
};

export default NouteStats;
