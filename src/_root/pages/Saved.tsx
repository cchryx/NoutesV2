import { Models } from "appwrite";

import { GridNoutesList, Loader } from "@/components/shared";
import { useGetCurrentUser } from "@/lib/react-query/queries";

const Saved = () => {
    const { data: currentUser } = useGetCurrentUser();

    const savedNoutes = currentUser?.save
        .map((savedNoute: Models.Document) => ({
            ...savedNoute.noute,
            creator: {
                username: savedNoute.creator.username,
                imageUrl: savedNoute.creator.imageUrl,
            },
        }))
        .reverse();

    return (
        <div className="saved-container">
            <div className="flex gap-2 w-full max-w-5xl">
                <img
                    src="/assets/images/icons/saved.svg"
                    width={36}
                    height={36}
                    alt="edit"
                    className="invert-white"
                />
                <h2 className="h3-bold md:h2-bold text-left w-full">
                    Saved Noutes
                </h2>
            </div>

            {!currentUser ? (
                <Loader />
            ) : (
                <ul className="w-full flex justify-center max-w-5xl gap-9">
                    {savedNoutes.length === 0 ? (
                        <p className="text-light-4">No saved noutes.</p>
                    ) : (
                        <GridNoutesList
                            noutes={savedNoutes}
                            showStats={false}
                        />
                    )}
                </ul>
            )}
        </div>
    );
};

export default Saved;
