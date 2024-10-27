import { Models } from "appwrite";
import Loader from "./Loader";
import { formatTimeAgo } from "@/lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useCreateComment, useGetComments } from "@/lib/react-query/queriesAndMutation";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";



const Comment = () => {
    const [commentText, setCommentText] = useState("");
    const { id } = useParams();
    const { user } = useUserContext();
    const { mutate: createComment } = useCreateComment();
    const { data: comments, isLoading: isLoadingComments } = useGetComments(id || "");
    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim() !== "") {
            createComment({ postId: id || "", userId: user.id, text: commentText });
            setCommentText("");
        }
    };

    return (
        <div className="w-full">
            <h3 className="body-bold mb-2">Comments</h3>
            {isLoadingComments ? (
                <Loader />
            ) : comments?.documents.length === 0 ? (
                <p className="text-light-3 h-[120px] text-center py-4">No comments yet.</p>
            ) : (
                <div className="flex flex-col gap-4 h-[120px] overflow-y-auto custom-scrollbar">
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
                <Button type="submit" className="shad-button_primary px-8">
                    Post
                </Button>
            </form>
        </div>
    )
}

export default Comment
