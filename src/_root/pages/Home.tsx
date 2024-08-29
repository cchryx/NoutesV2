import { Models } from "appwrite";

import { Loader } from "@/components/shared";
import { useGetRecentNoutes } from "@/lib/react-query/queries";
import NouteCard from "@/components/shared/NouteCard";

const Home = () => {
    const {
        data: noutes,
        isLoading: isNouteLoading,
        isError: isErrorNoutes,
    } = useGetRecentNoutes();

    if (isErrorNoutes) {
        return (
            <div className="flex flex-1">
                <div className="home-container">
                    <p className="body-medium text-light-1">
                        Standby, Something bad happened.
                    </p>
                </div>
                <div className="home-creators">
                    <p className="body-medium text-light-1">
                        Standby, Something bad happened.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-1">
            <div className="home-container">
                <div className="home-noutes">
                    <h2 className="h3-bold md:h2-bold text-left w-full">
                        For You
                    </h2>
                    {isNouteLoading && !noutes ? (
                        <Loader />
                    ) : (
                        <ul className="flex flex-col flex-1 gap-9 w-full">
                            {noutes?.documents.map((noute: Models.Document) => (
                                <NouteCard noute={noute} key={noute.caption} />
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
