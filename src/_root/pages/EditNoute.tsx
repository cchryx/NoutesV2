import { useParams } from "react-router-dom";

import { Loader } from "@/components/shared";
import NouteForm from "@/components/forms/NouteForm";
import { useGetNouteById } from "@/lib/react-query/queries";

const EditNoute = () => {
    const { id } = useParams();
    const { data: noute, isLoading } = useGetNouteById(id);

    if (isLoading)
        return (
            <div className="flex-center w-full h-full">
                <Loader />
            </div>
        );

    return (
        <div className="flex flex-1">
            <div className="common-container">
                <div className="flex-start gap-3 justify-start w-full max-w-5xl">
                    <img
                        src="/assets/images/icons/edit.svg"
                        width={36}
                        height={36}
                        alt="edit"
                        className="invert-white"
                    />
                    <h2 className="h3-bold md:h2-bold text-left w-full">
                        Edit Noute
                    </h2>
                </div>

                {isLoading ? (
                    <Loader />
                ) : (
                    <NouteForm action="Update" noute={noute} />
                )}
            </div>
        </div>
    );
};

export default EditNoute;
