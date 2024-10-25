import { useUserContext } from "@/context/AuthContext";
import { formatTimeAgo } from "@/lib/utils";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type PostCardProps = {
    post: Models.Document;
}

const PostCard = ({ post }: PostCardProps) => {
    const { user } = useUserContext();

    if (!post.creator) return null;
    return (
        <div className="post-card">
            <div className="flex-between">
                <div className="flex item-center gap-2">
                    <Link to={`/profile/${post.creator.$id}`}>
                        <img src={post.creator.imageUrl} alt="creator-image" className="rounded-full object-cover w-12 lg:h-12" />
                    </Link>


                    <div className="flex flex-col">
                        <p className="base-medium lg:body-bold text-light-1">{post.creator.name}</p>

                        <div className="flex-center gap-2 text-light-3 text-sm">

                            <p className="subtle-semibold lg:base-regular">
                                {formatTimeAgo(post.$createdAt)}
                            </p>
                            -
                            <p className="subtle-semibold lg:small-regular">
                                {post.location}
                            </p>
                        </div>
                    </div>
                </div>
                <Link to={`/update-post/${post.$id}`} className={`${user.id !== post.creator.$id && 'hidden'}`}>
                    <img src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
                </Link>
            </div>
            <Link to={`/post/${post.$id}`}>
                <div className="small-medium lg:base-medium py-5">
                    <p>{post.caption}</p>
                    <ul className="flex gap-1 mt-2">
                        {post.tags.map((tag: string) => (
                            <li key={tag} className="text-primary-500 text-xs font-bold"># {tag}</li>
                        ))}
                    </ul>
                </div>
                <img src={post.imageUrl || '/assets/icons/profile-placeholder.svg'} alt="post-image" className="rounded-lg w-full aspect-square object-cover mt-2" /> 
            </Link>

            <PostStats post={post} userId={user.id} />   
        </div>
    )
}

export default PostCard