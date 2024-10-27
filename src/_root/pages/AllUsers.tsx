import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import UserCard from "@/components/shared/UserCard";
import Loader from "@/components/shared/Loader";
// import { useToast } from "@/hooks/use-toast";
import { useGetInfiniteUsers, useSearchUsers } from "@/lib/react-query/queriesAndMutation";
import useDebounce from "@/hooks/useDebounce";
import { useInView } from "react-intersection-observer";

const SearchResults = ({ isSearchFetching, searchedUsers }: { isSearchFetching: boolean, searchedUsers: any }) => {
  if (isSearchFetching) {
    return <Loader />;
  } else if (searchedUsers && searchedUsers.documents.length > 0) {
    return (
      <ul className="user-grid">
        {searchedUsers.documents.map((user: any) => (
          <li key={user.$id} className="flex-1 min-w-[200px] w-full">
            <UserCard user={user} />
          </li>
        ))}
      </ul>
    );
  } else {
    return (
      <p className="text-light-4 mt-10 text-center w-full">No users found</p>
    );
  }
};

const AllUsers = () => {
  // const { toast } = useToast();
  const { ref, inView } = useInView();

  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);
  const { data: searchedUsers, isFetching: isSearchFetching } = useSearchUsers(debouncedSearch);

  const { data: users, fetchNextPage, hasNextPage, isLoading: isLoadingUsers } = useGetInfiniteUsers();

  useEffect(() => {
    if (inView && !searchValue) {
      fetchNextPage();
    }
  }, [inView, searchValue]);

  if (!users && isLoadingUsers) {
    return (
      <div className="flex-start flex-col w-full h-full">
        <Loader />
      </div>
    );
  }

  const shouldShowSearchResults = searchValue !== "";
  const shouldShowUsers = !shouldShowSearchResults && 
    users?.pages.every((page: any) => page?.documents.length === 0);

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            alt="search"
          />
          <Input
            type="text"
            placeholder="Search users..."
            className="explore-search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-9 w-full max-w-5xl mt-16">
          {shouldShowSearchResults ? (
            <SearchResults
              isSearchFetching={isSearchFetching}
              searchedUsers={searchedUsers}
            />
          ) : shouldShowUsers ? (
            <p className="text-light-4 mt-10 text-center w-full">No users found</p>
          ) : (
            users?.pages.map((page, index) => (
              <ul key={`page-${index}`} className="user-grid">
                {page?.documents.map((user: any) => (
                  <li key={user.$id} className="flex-1 min-w-[200px] w-full">
                    <UserCard user={user} />
                  </li>
                ))}
              </ul>
            ))
          )}
        </div>

        {hasNextPage && !searchValue && (
          <div ref={ref} className="mt-10 flex justify-start w-full">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
