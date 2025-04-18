import { ID, Query, Models } from "appwrite";

import { appwriteConfig, account, databases, storage, avatars } from "./config";
import { IUpdatePost, INewPost, INewUser, IUpdateUser } from "@/types";

// ============================================================
// AUTH
// ============================================================

// ============================== SIGN UP
export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    ) as Models.User<Models.Preferences>;

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    });

    return newUser as Models.Document;
  } catch (error) {
    console.log(error);
    return error;
  }
}

// ============================== SAVE USER TO DB
export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: string;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

// ============================== SIGN IN
export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailPasswordSession(user.email, user.password);

    return session;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET ACCOUNT
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET USER
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// ============================== SIGN OUT
export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    console.log(error);
  }
}

// ============================================================
// POSTS
// ============================================================

// ============================== CREATE POST
export async function createPost(post: INewPost) {
  try {
    // Upload file to appwrite storage
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw Error;

    // Get direct file URL without transformations
    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post with direct URL
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// ============================== UPLOAD FILE
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

// ============================== GET FILE URL
export function getFilePreview(fileId: string) {
  try {
    // Get the file view URL directly as a string
    return storage.getFileView(appwriteConfig.storageId, fileId);
  } catch (error) {
    console.log(error);
    return null;
  }
}

// ============================== DELETE FILE
export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET POSTS
export async function searchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search("caption", searchTerm)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam: string | null }) {
  const queries: any[] = [Query.orderDesc('$createdAt'), Query.limit(10)];
  
  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { documents: [] };
  }
}

// ============================== GET POST BY ID
export async function getPostById(postId?: string) {
  if (!postId) throw Error;

  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}

// ============================== UPDATE POST
export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;

      // Get direct file URL without transformations
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    } else {
      // Always ensure we're using a direct URL without transformations
      const directUrl = getFilePreview(image.imageId);
      if (directUrl) {
        image.imageUrl = directUrl;
      }
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    //  Update post
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );

    // Failed to update
    if (!updatedPost) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }
      throw Error;
    }

    // Safely delete old file after successful update
    if (hasFileToUpdate) {
      await deleteFile(post.imageId);
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// ============================== DELETE POST
export async function deletePost(postId?: string, imageId?: string) {
  if (!postId || !imageId) return;

  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    if (!statusCode) throw Error;

    await deleteFile(imageId);

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

// ============================== LIKE / UNLIKE POST
export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

// ============================== SAVE POST
export async function savePost(userId: string, postId: string) {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.saveCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}
// ============================== DELETE SAVED POST
export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.saveCollectionId,
      savedRecordId
    );

    if (!statusCode) throw Error;

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

// Follow a user
export async function followUser(followerId: string, followingId: string) {
  try {
    // Check if the follow relationship already exists
    const existingFollow = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followersCollectionId,
      [
        Query.equal('follower', followerId),
        Query.equal('following', followingId)
      ]
    );

    if (existingFollow.total > 0) {
      // Already following, do nothing
      return null;
    }

    const newFollow = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followersCollectionId,
      ID.unique(),
      {
        follower: followerId,
        following: followingId,
      }
    );

    return newFollow;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function unfollowUser(followerId: string, followingId: string) {
  try {
    const existingFollow = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followersCollectionId,
      [
        Query.equal('follower', followerId),
        Query.equal('following', followingId)
      ]
    );

    if (existingFollow.total === 0) {
      // Not following, do nothing
      return null;
    }

    const deleteFollow = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followersCollectionId,
      existingFollow.documents[0].$id
    );

    return deleteFollow;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function checkIsFollowing(followerId: string, followingId: string) {
  try {
    const existingFollow = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followersCollectionId,
      [
        Query.equal('follower', followerId),
        Query.equal('following', followingId)
      ]
    );

    return existingFollow.total > 0;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// Get followers count
export async function getFollowersCount(userId: string) {
  try {
    const followers = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followersCollectionId,
      [Query.equal('following', userId)]
    );

    return followers.total;
  } catch (error) {
    console.log(error);
    return 0;
  }
}




// Get following count
export async function getFollowingCount(userId: string) {
  try {
    const following = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followersCollectionId,
      [Query.equal('follower', userId)]
    );

    return following.total;
  } catch (error) {
    console.log(error);
    return 0;
  }
}




// ============================== GET USER'S POST
export async function getUserPosts(userId?: string) {
  if (!userId) return;

  try {
    const post = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET POPULAR POSTS (BY HIGHEST LIKE COUNT)
export async function getRecentPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

// ============================================================
// USER
// ============================================================

// ============================== GET USERS
export async function getUsers(limit?: number) {
  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(limit || 10000)]
    );

    if (!users) throw Error;

    const usersWithFollowers = await Promise.all(
      users.documents.map(async (user) => {
        const followersCount = await getFollowersCount(user.$id);
        return { ...user, followersCount };
      })
    );

    const sortedUsers = usersWithFollowers.sort((a, b) => b.followersCount - a.followersCount);

    return { ...users, documents: sortedUsers };
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET USER BY ID
export async function getUserById(userId: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    if (!user) throw Error;

    return user;
  } catch (error) {
    console.log(error);
  }
}

// Create a new comment
export async function createComment(postId: string, userId: string, text: string) {
  try {
    const newComment = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
        text: text
      }
    );

    return newComment;
  } catch (error) {
    console.error("Error creating comment:", error);
  }
}

// Get comments for a post
export async function getComments(postId: string) {
  try {
    const comments = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      [
        Query.equal("post", postId),
        Query.orderDesc("$createdAt"),
        Query.limit(100)
      ]
    );

    return comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
}
// ============================== UPDATE USER
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
      appwriteConfig.userCollectionId,
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

// Search users
export async function searchUsers(searchTerm: string) {
  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.search("name", searchTerm)]
    );

    return users;
  } catch (error) {
    console.error("Error searching users:", error);
    return { documents: [] };
  }
}

// Get users with pagination
export async function getInfiniteUsers({ pageParam }: { pageParam: string | null }) {
  const queries: any[] = [Query.orderAsc("$createdAt"), Query.limit(12)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam));
  }

  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}

// Add this new function
export async function deleteUserAndSession(userId: string) {
  try {
    console.log("Starting cleanup for userId:", userId);

    // First, find the user document using $id instead of accountId
    const documents = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("$id", userId)]
    );
    

    if (documents.documents.length > 0) {
      const userDoc = documents.documents[0];
     

      try {
        // Delete the user document
        const deleteResult = await databases.deleteDocument(
          appwriteConfig.databaseId,
          appwriteConfig.userCollectionId,
          userDoc.$id
        );
        console.log("Delete result:", deleteResult);
      } catch (deleteError) {
        console.error("Error deleting user document:", deleteError);
        throw deleteError;
      }
    } else {
      console.log("No user document found for userId:", userId);
    }

    return true;
  } catch (error) {
    console.error("Error during cleanup:", error);
    throw error;
  }
}

// ============================== CLEAN IMAGE URLS
export async function cleanImageUrls() {
  try {
    // Get all posts
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.limit(100)]
    );

    let updatedCount = 0;

    if (posts && posts.documents.length) {
      // Update each post with direct image URL
      for (const post of posts.documents) {
        if (post.imageId) {
          // Get direct URL without transformations
          const directUrl = getFilePreview(post.imageId);
          if (directUrl) {
            await databases.updateDocument(
              appwriteConfig.databaseId,
              appwriteConfig.postCollectionId,
              post.$id,
              {
                imageUrl: directUrl
              }
            );
            updatedCount++;
          }
        }
      }
    }

    // Get all users
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.limit(100)]
    );

    if (users && users.documents.length) {
      // Update each user's image URL
      for (const user of users.documents) {
        try {
          let imageUrl;
          if (user.imageId) {
            // If user has an uploaded image, get direct URL
            imageUrl = getFilePreview(user.imageId);
          } else {
            // If no uploaded image, generate avatar URL
            imageUrl = avatars.getInitials(user.name);
          }
          
          if (imageUrl) {
            await databases.updateDocument(
              appwriteConfig.databaseId,
              appwriteConfig.userCollectionId,
              user.$id,
              {
                imageUrl: imageUrl
              }
            );
            updatedCount++;
          }
        } catch (err) {
          console.log(`Error updating user ${user.$id}:`, err);
          continue; // Skip to next user if there's an error
        }
      }
    }

    return { 
      status: "ok", 
      message: `Updated ${updatedCount} image URLs to use direct URLs`,
      updatedCount 
    };
  } catch (error) {
    console.log(error);
    return { 
      status: "error", 
      message: "Failed to update image URLs",
      error: String(error)
    };
  }
}
