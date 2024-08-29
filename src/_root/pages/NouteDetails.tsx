import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { GridNoutesList, Loader } from "@/components/shared";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import {
    useDeleteNoute,
    useGetNouteById,
    useGetUserNoutes,
} from "@/lib/react-query/queries";

const NouteDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useUserContext();

    const { data: noute, isLoading } = useGetNouteById(id);
    const { data: userNoutes, isLoading: isUserNoutesLoading } =
        useGetUserNoutes(noute?.creator.$id);
    const { mutate: deletenoute } = useDeleteNoute();

    const relatedNoutes = userNoutes?.documents.filter(
        (userNoute) => userNoute.$id !== id
    );

    const handleDeletenoute = () => {
        deletenoute({ nouteId: id, imageId: noute?.imageId });
        navigate(-1);
    };

    return (
        <div className="noute_details-container">
            <div className="hidden md:flex max-w-5xl w-full">
                <Button
                    onClick={() => navigate(-1)}
                    variant="ghost"
                    className="shad-button_ghost"
                >
                    <img
                        src={"/assets/images/icons/back.svg"}
                        alt="back"
                        width={30}
                        height={30}
                    />
                    <p className="h3-bold">Back</p>
                </Button>
            </div>

            {isLoading || !noute ? (
                <Loader />
            ) : (
                <div className="noute_details-card">
                    <img
                        src={noute?.imageUrl}
                        alt="creator"
                        className="noute_details-img"
                    />

                    <div className="noute_details-info">
                        <div className="flex-between w-full">
                            <Link
                                to={`/profile/${noute?.creator.$id}`}
                                className="flex items-center gap-3"
                            >
                                <img
                                    src={
                                        noute?.creator.imageUrl ||
                                        "/assets/images/icons/profile-placeholder.svg"
                                    }
                                    alt="creator"
                                    className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
                                />
                                <div className="flex gap-1 flex-col">
                                    <p className="base-medium lg:body-bold text-light-1">
                                        {noute?.creator.username}
                                    </p>
                                    <div className="flex-center gap-2 text-light-3">
                                        <p className="subtle-semibold lg:small-regular ">
                                            {multiFormatDateString(
                                                noute?.$createdAt
                                            )}
                                        </p>
                                        •
                                        <p className="subtle-semibold lg:small-regular">
                                            {noute?.location}
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            <div className="flex-center gap-4">
                                <Link
                                    to={`/update-noute/${noute?.$id}`}
                                    className={`${
                                        user.id !== noute?.creator.$id &&
                                        "hidden"
                                    }`}
                                >
                                    <img
                                        src={"/assets/images/icons/edit.svg"}
                                        alt="edit"
                                        width={24}
                                        height={24}
                                    />
                                </Link>

                                <Button
                                    onClick={handleDeletenoute}
                                    variant="ghost"
                                    className={`ost_details-delete_btn ${
                                        user.id !== noute?.creator.$id &&
                                        "hidden"
                                    }`}
                                >
                                    <img
                                        src={"/assets/images/icons/delete.svg"}
                                        alt="delete"
                                        width={24}
                                        height={24}
                                    />
                                </Button>
                            </div>
                        </div>

                        <hr className="border w-full border-dark-4/80" />

                        <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
                            <p>{noute?.caption}</p>
                            <ul className="flex gap-1 mt-2">
                                {noute?.tags.map(
                                    (tag: string, index: string) => (
                                        <li
                                            key={`${tag}${index}`}
                                            className="text-light-3 small-regular"
                                        >
                                            #{tag}
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>

                        {/* <div className="w-full">
                            <nouteStats noute={noute} userId={user.id} />
                        </div> */}
                    </div>
                </div>
            )}

            <div className="w-full max-w-5xl">
                <hr className="border w-full border-dark-4/80" />

                <h3 className="body-bold md:h3-bold w-full my-10">
                    More Related Noutes
                </h3>
                {isUserNoutesLoading || !relatedNoutes ? (
                    <Loader />
                ) : (
                    <GridNoutesList noutes={relatedNoutes} />
                )}
            </div>
        </div>
    );
};

export default NouteDetails;
