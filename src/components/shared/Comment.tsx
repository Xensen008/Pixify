import { Models } from "appwrite";
import Loader from "./Loader";
import { formatTimeAgo } from "@/lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useCreateComment, useGetComments } from "@/lib/react-query/queriesAndMutation";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";

const Comment = () => {
    const [commentText, setCommentText] = useState("");
    const [newCommentLoading, setNewCommentLoading] = useState(false);
    const { id } = useParams();
    const { user } = useUserContext();
    const { mutate: createComment, isPending: isCreatingComment } = useCreateComment();
    const { data: comments, isLoading: isLoadingComments, refetch: refetchComments } = useGetComments(id || "");

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim() !== "") {
            setNewCommentLoading(true);
            createComment(
                { postId: id || "", userId: user.id, text: commentText },
                {
                    onSuccess: () => {
                        setCommentText("");
                        refetchComments();
                        setTimeout(() => setNewCommentLoading(false), 3000); // Hide skeleton after 3 seconds
                    },
                }
            );
        }
    };

    useEffect(() => {
        if (newCommentLoading) {
            setTimeout(() => setNewCommentLoading(false), 3000); // Fallback to hide skeleton after 3 seconds
        }
    }, [newCommentLoading]);

    const CommentSkeleton = () => (
        <div className="flex items-start gap-2 py-2 animate-pulse">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
            </div>
        </div>
    );

    return (
        <div className="w-full">
            <h3 className="body-bold mb-2">Comments</h3>
            {isLoadingComments ? (
                <Loader />
            ) : comments?.documents.length === 0 && !newCommentLoading ? (
                <p className="text-light-3 h-[120px] text-center py-4">No comments yet.</p>
            ) : (
                <div className="flex flex-col gap-4 h-[120px] overflow-y-auto custom-scrollbar">
                    {newCommentLoading && <CommentSkeleton />}
                    {comments?.documents.map((comment: Models.Document) => (
                        <div key={comment.$id} className="flex items-start gap-2 py-2">
                            <img
                                src={comment.user.imageUrl || "/assets/icons/profile-placeholder.svg"}
                                alt="user avatar"
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="small-medium text-light-1">{comment.user.name}</p>
                                    <p className="subtle-semibold text-light-3">
                                        {formatTimeAgo(comment.$createdAt)}
                                    </p>
                                </div>
                                <p className="small-regular text-light-2 mt-1">{comment.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <form onSubmit={handleSubmitComment} className="flex gap-2">
                <Input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="bg-dark-4 text-light-1 border-none focus:outline-none"
                />
                <Button type="submit" className="shad-button_primary px-8" disabled={isCreatingComment}>
                    {isCreatingComment ? "Posting..." : "Post"}
                </Button>
            </form>
        </div>
    )
}

export default Comment;