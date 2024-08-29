import { GridNoutesList, Loader } from "@/components/shared";
import { useGetCurrentUser } from "@/lib/react-query/queries";

const LikedNoutes = () => {
    const { data: currentUser } = useGetCurrentUser();

    if (!currentUser)
        return (
            <div className="flex-center w-full h-full">
                <Loader />
            </div>
        );

    return (
        <>
            {currentUser.liked.length === 0 && (
                <p className="text-light-4">No liked noutess</p>
            )}

            <GridNoutesList noutes={currentUser.liked} showStats={false} />
        </>
    );
};

export default LikedNoutes;
