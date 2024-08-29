import NouteForm from "@/components/forms/NouteForm";

const CreateNoute = () => {
    return (
        <div className="flex flex-1">
            <div className="common-container">
                <div className="max-w-5xl flex-start gap-3 justify-start w-full">
                    <img
                        src="/assets/images/icons/add-post.svg"
                        alt="add"
                        width={36}
                        height={36}
                    />
                    <h2 className="h3-bold md:h2-bold text-left w-full">
                        Create Noute
                    </h2>
                </div>

                <NouteForm action="Create" />
            </div>
        </div>
    );
};

export default CreateNoute;
