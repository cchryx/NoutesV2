/* eslint-disable @typescript-eslint/no-explicit-any */
import { ID, Query } from "appwrite";

import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { INewNoute, INewUser, IUpdateNoute, IUpdateUser } from "@/types";

export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        );

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl,
        });

        return newUser;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export async function saveUserToDB(user: {
    accountId: string;
    email: string;
    name: string;
    imageUrl: URL;
    username?: string;
}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            ID.unique(),
            user
        );

        return newUser;
    } catch (error) {
        console.log(error);
    }
}

export async function signInAccount(user: { email: string; password: string }) {
    try {
        const session = await account.createEmailPasswordSession(
            user.email,
            user.password
        );

        return session;
    } catch (error) {
        console.log(error);
    }
}

export async function signOutAccount() {
    try {
        const session = await account.deleteSession("current");

        return session;
    } catch (error) {
        console.log(error);
    }
}

export async function getAccount() {
    try {
        const currentAccount = await account.get();

        return currentAccount;
    } catch (error) {
        console.log(error);
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await getAccount();

        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
        );

        if (!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function createNoute(noute: INewNoute) {
    try {
        const uploadedFile = await uploadFile(noute.file[0]);

        if (!uploadedFile) throw Error;

        const fileUrl = getFilePreview(uploadedFile.$id);
        if (!fileUrl) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }

        const tags = noute.tags?.replace(/ /g, "").split(",") || [];

        const newNoute = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.noutesCollectionId,
            ID.unique(),
            {
                creator: noute.userId,
                caption: noute.caption,
                imageUrl: fileUrl,
                imageId: uploadedFile.$id,
                location: noute.location,
                tags: tags,
            }
        );

        if (!newNoute) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }

        return newNoute;
    } catch (error) {
        console.log(error);
    }
}

export async function uploadFile(file: File) {
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        );

        return uploadedFile;
    } catch (error) {
        console.log(error);
    }
}

export function getFilePreview(fileId: string) {
    try {
        const fileUrl = storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            2000,
            2000,
            undefined,
            100
        );

        if (!fileUrl) throw Error;

        return fileUrl;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteFile(fileId: string) {
    try {
        await storage.deleteFile(appwriteConfig.storageId, fileId);

        return { status: "ok" };
    } catch (error) {
        console.log(error);
    }
}

export async function updateNoute(noute: IUpdateNoute) {
    const hasFileToUpdate = noute.file.length > 0;

    try {
        let image = {
            imageUrl: noute.imageUrl,
            imageId: noute.imageId,
        };

        if (hasFileToUpdate) {
            // Upload new file to appwrite storage
            const uploadedFile = await uploadFile(noute.file[0]);
            if (!uploadedFile) throw Error;

            // Get new file url
            const fileUrl = getFilePreview(uploadedFile.$id);
            if (!fileUrl) {
                await deleteFile(uploadedFile.$id);
                throw Error;
            }

            image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
        }

        // Convert tags into array
        const tags = noute.tags?.replace(/ /g, "").split(",") || [];

        //  Update noute
        const updatedNoute = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.noutesCollectionId,
            noute.nouteId,
            {
                caption: noute.caption,
                imageUrl: image.imageUrl,
                imageId: image.imageId,
                location: noute.location,
                tags: tags,
            }
        );

        // Failed to update
        if (!updatedNoute) {
            // Delete new file that has been recently uploaded
            if (hasFileToUpdate) {
                await deleteFile(image.imageId);
            }

            // If no new file uploaded, just throw error
            throw Error;
        }

        // Safely delete old file after successful update
        if (hasFileToUpdate) {
            await deleteFile(noute.imageId);
        }

        return updatedNoute;
    } catch (error) {
        console.log(error);
    }
}

export async function getRecentNoutes() {
    try {
        const noutes = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.noutesCollectionId,
            [Query.orderDesc("$createdAt"), Query.limit(20)]
        );

        if (!noutes) throw Error;

        return noutes;
    } catch (error) {
        console.log(error);
    }
}

export async function likeNoute(nouteId: string, likesArray: string[]) {
    try {
        const updatedNoute = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.noutesCollectionId,
            nouteId,
            {
                likes: likesArray,
            }
        );

        if (!updatedNoute) throw Error;

        return updatedNoute;
    } catch (error) {
        console.log(error);
    }
}

export async function saveNoute(
    userId: string,
    nouteId: string,
    creatorId: string
) {
    try {
        const updatedNoute = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            ID.unique(),
            {
                user: userId,
                noute: nouteId,
                creator: creatorId,
            }
        );

        if (!updatedNoute) throw Error;

        return updatedNoute;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteSavedNoute(savedRecordId: string) {
    try {
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            savedRecordId
        );

        if (!statusCode) throw Error;

        return { status: "Ok" };
    } catch (error) {
        console.log(error);
    }
}

export async function getNouteById(nouteId?: string) {
    if (!nouteId) throw Error;

    try {
        const noute = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.noutesCollectionId,
            nouteId
        );

        if (!noute) throw Error;

        return noute;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteNoute(nouteId?: string, imageId?: string) {
    if (!nouteId || !imageId) return;

    try {
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.noutesCollectionId,
            nouteId
        );

        if (!statusCode) throw Error;

        await deleteFile(imageId);

        return { status: "Ok" };
    } catch (error) {
        console.log(error);
    }
}

export async function getInfiniteNoutes({
    pageParam = 0,
}: {
    pageParam?: number;
}) {
    const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];

    if (pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()));
    }

    try {
        const noutes = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.noutesCollectionId,
            queries
        );

        if (!noutes) throw Error;

        return noutes;
    } catch (error) {
        console.log(error);
    }
}

export async function searchNoutes(searchTerm: string) {
    try {
        const noutes = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.noutesCollectionId,
            [Query.search("caption", searchTerm)]
        );

        if (!noutes) throw Error;

        return noutes;
    } catch (error) {
        console.log(error);
    }
}

export async function getUserPosts(userId?: string) {
    if (!userId) return;

    try {
        const noute = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.noutesCollectionId,
            [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
        );

        if (!noute) throw Error;

        return noute;
    } catch (error) {
        console.log(error);
    }
}

export async function getUserById(userId: string) {
    try {
        const user = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            userId
        );

        if (!user) throw Error;

        return user;
    } catch (error) {
        console.log(error);
    }
}

export async function updateUser(user: IUpdateUser) {
    const hasFileToUpdate = user.file.length > 0;
    try {
        let image = {
            imageUrl: user.imageUrl,
            imageId: user.imageId,
        };

        if (hasFileToUpdate) {
            // Upload new file to appwrite storage
            const uploadedFile = await uploadFile(user.file[0]);
            if (!uploadedFile) throw Error;

            // Get new file url
            const fileUrl = getFilePreview(uploadedFile.$id);
            if (!fileUrl) {
                await deleteFile(uploadedFile.$id);
                throw Error;
            }

            image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
        }

        //  Update user
        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            user.userId,
            {
                name: user.name,
                bio: user.bio,
                imageUrl: image.imageUrl,
                imageId: image.imageId,
            }
        );

        // Failed to update
        if (!updatedUser) {
            // Delete new file that has been recently uploaded
            if (hasFileToUpdate) {
                await deleteFile(image.imageId);
            }
            // If no new file uploaded, just throw error
            throw Error;
        }

        // Safely delete old file after successful update
        if (user.imageId && hasFileToUpdate) {
            await deleteFile(user.imageId);
        }

        return updatedUser;
    } catch (error) {
        console.log(error);
    }
}

export async function getUsers(limit?: number) {
    const queries: any[] = [Query.orderDesc("$createdAt")];

    if (limit) {
        queries.push(Query.limit(limit));
    }

    try {
        const users = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            queries
        );

        if (!users) throw Error;

        return users;
    } catch (error) {
        console.log(error);
    }
}
