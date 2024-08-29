import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { useGetNoutes, useSearchNoutes } from "@/lib/react-query/queries";
import useDebounce from "@/hooks/useDebounce";
import { Loader } from "@/components/shared";
import SearchResults from "@/components/shared/SearchResults";
import GridNoutesLists from "@/components/shared/GridNoutesList";
import { useInView } from "react-intersection-observer";

const Explore = () => {
    const { ref, inView } = useInView();
    const { data: noutes, fetchNextPage, hasNextPage } = useGetNoutes();

    const [searchValue, setsearchValue] = useState("");
    const debouncedValue = useDebounce(searchValue, 500);
    const { data: searchedNoutes, isFetching: isSearchFetching } =
        useSearchNoutes(debouncedValue);

    useEffect(() => {
        if (inView && !searchValue) fetchNextPage();
    }, [inView, searchValue]);

    if (!noutes)
        return (
            <div className="flex-center w-full h-full">
                <Loader />
            </div>
        );

    const shouldShowSearchResults = searchValue !== "";
    const shouldShowNoutes =
        !shouldShowSearchResults &&
        noutes.pages.every((item) => item?.documents.length === 0);

    return (
        <div className="explore-container">
            <div className="explore-inner_container">
                <h2 className="h3-bold md:h2-bold w-full">Search Noutes</h2>
                <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
                    <img
                        src="/assets/images/icons/search.svg"
                        alt="search"
                        width={24}
                        height={24}
                    />
                    <Input
                        type="text"
                        placeholder="Search"
                        className="explore-search"
                        value={searchValue}
                        onChange={(e) => setsearchValue(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-between w-full max-w-5xl mt-16 mb-7">
                <h3 className="body-bold md:h3-bold">Popular Today</h3>

                <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
                    <p className="small-medium md:base-medium text-light-2">
                        All
                    </p>
                    <img
                        src="/assets/images/icons/filter.svg"
                        alt="filter"
                        width={20}
                        height={20}
                    />
                </div>
            </div>

            <div className="flex flex-wrap gap-9 w-full max-w-5xl">
                {shouldShowSearchResults ? (
                    <SearchResults
                        isSearchFetching={isSearchFetching}
                        searchedNoutes={searchedNoutes}
                    />
                ) : shouldShowNoutes ? (
                    <p className="text-light-4 mt-10 text-center w-full">
                        End of noutes
                    </p>
                ) : (
                    noutes.pages.map((item, index) => (
                        <GridNoutesLists
                            key={`page-${index}`}
                            noutes={item.documents}
                        />
                    ))
                )}
            </div>

            {hasNextPage && !searchValue && (
                <div ref={ref} className="mt-10">
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default Explore;
