import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { INewNoute, INewUser, IUpdateNoute, IUpdateUser } from "@/types";
import {
    createNoute,
    createUserAccount,
    deleteNoute,
    deleteSavedNoute,
    getCurrentUser,
    getInfiniteNoutes,
    getNouteById,
    getRecentNoutes,
    getUserById,
    getUserPosts,
    getUsers,
    likeNoute,
    saveNoute,
    searchNoutes,
    signInAccount,
    signOutAccount,
    updateNoute,
    updateUser,
} from "../appwrite/api";
import { QUERY_KEYS } from "./queryKeys";

export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user),
    });
};

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: { email: string; password: string }) =>
            signInAccount(user),
    });
};

export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: signOutAccount,
    });
};

export const useCreateNoute = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (noute: INewNoute) => createNoute(noute),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_NOUTES],
            });
        },
    });
};

export const useUpdateNoute = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (noute: IUpdateNoute) => updateNoute(noute),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_NOUTE_BY_ID, data?.$id],
            });
        },
    });
};

export const useGetRecentNoutes = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_NOUTES],
        queryFn: getRecentNoutes,
    });
};

export const useLikeNoute = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            nouteId,
            likesArray,
        }: {
            nouteId: string;
            likesArray: string[];
        }) => likeNoute(nouteId, likesArray),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_NOUTE_BY_ID, data?.$id],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_NOUTES],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_NOUTES],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER],
            });
        },
    });
};

export const useSaveNoute = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            userId,
            nouteId,
            creatorId,
        }: {
            userId: string;
            nouteId: string;
            creatorId: string;
        }) => saveNoute(userId, nouteId, creatorId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_NOUTES],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_NOUTES],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER],
            });
        },
    });
};

export const useDeleteSavedNoute = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (savedRecordId: string) => deleteSavedNoute(savedRecordId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_NOUTES],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_NOUTES],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER],
            });
        },
    });
};

export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: getCurrentUser,
    });
};

export const useGetNouteById = (nouteId?: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_NOUTE_BY_ID, nouteId],
        queryFn: () => getNouteById(nouteId),
        enabled: !!nouteId,
    });
};

export const useDeleteNoute = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            nouteId,
            imageId,
        }: {
            nouteId?: string;
            imageId: string;
        }) => deleteNoute(nouteId, imageId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_NOUTES],
            });
        },
    });
};

export const useGetNoutes = () => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_NOUTES],
        queryFn: getInfiniteNoutes,
        getNextPageParam: (lastPage) => {
            if (lastPage && lastPage.documents.length === 0) return null;

            const lastId =
                lastPage?.documents[lastPage?.documents.length - 1].$id;

            return lastId;
        },
    });
};

export const useSearchNoutes = (searchTerm: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_NOUTES, searchTerm],
        queryFn: () => searchNoutes(searchTerm),
        enabled: !!searchTerm,
    });
};

export const useGetUserNoutes = (userId?: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_NOUTES, userId],
        queryFn: () => getUserPosts(userId),
        enabled: !!userId,
    });
};

export const useGetUserById = (userId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
        queryFn: () => getUserById(userId),
        enabled: !!userId,
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (user: IUpdateUser) => updateUser(user),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
            });
        },
    });
};

export const useGetUsers = (limit?: number) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USERS],
        queryFn: () => getUsers(limit),
    });
};
