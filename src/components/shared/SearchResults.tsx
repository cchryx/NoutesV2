import { Models } from "appwrite";
import Loader from "./Loader";
import GridNoutesList from "./GridNoutesList";

type SearchResultsProps = {
    isSearchFetching: boolean;
    searchedNoutes: Models.Document[];
};

const SearchResults = ({
    isSearchFetching,
    searchedNoutes,
}: SearchResultsProps) => {
    if (isSearchFetching) return <Loader />;

    if (searchedNoutes && searchedNoutes.length > 0) {
        console.log(searchedNoutes);
        return <GridNoutesList noutes={searchedNoutes} />;
    }

    return (
        <p className="text-light-4 mt-10 text-center w-full">
            No results found.
        </p>
    );
};

export default SearchResults;
