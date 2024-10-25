import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea"

import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import FileUploader from "../shared/FileUploader";
import { PostFormValidation } from "@/lib/validation";
import { Models } from "appwrite";
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../shared/Loader";

type PostFormProps = {
    post?: Models.Document
    action: "Create" | "Update";
}

const PostForm = ({ post, action }: PostFormProps) => {
    const { mutateAsync: createPost, isPending: isLoadingCreate } = useCreatePost()
    const { mutateAsync: updatePost, isPending: isLoadingUpdate } = useUpdatePost()

    const { toast } = useToast();
    const { user } = useUserContext();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof PostFormValidation>>({
        resolver: zodResolver(PostFormValidation),
        defaultValues: {
            caption: post?.caption || "",
            file: [],
            location: post?.location || "",
            tags: post ? post?.tags.join(",") : "",
        }
    })

    const onSubmit = async (values: z.infer<typeof PostFormValidation>) => {
        if (post && action === "Update") {
            const updatedPost = await updatePost({
                ...values,
                postId: post.$id,
                imageId: post?.imageId,
                imageUrl: post?.imageUrl
            })
            if(!updatedPost) {
                toast({
                    title: ' Please try again'
                })
            }
            return navigate(`/post/${post.$id}`)
        }
        const newPost = await createPost({
            ...values,
            userId: user.id
        })
        
        if(!newPost) {
                toast({
                    title: 'Please try again'
                })
            }
        
        navigate(`/`)
        }


    return (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
                    <FormField
                        control={form.control}
                        name="caption"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="shad-label">Caption</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Add your caption..." className="shad-textarea custom-scrollbar" {...field} />
                                </FormControl>
                                <FormMessage className="shad-form_message" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="file"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="shad-label">Add Image</FormLabel>
                                <FormControl>
                                    <FileUploader
                                        fieldChange={field.onChange}
                                        mediaUrl={post?.imageUrl || ""}
                                    />
                                </FormControl>
                                <FormMessage className="shad-form_message" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="shad-label">Add Location</FormLabel>
                                <FormControl>
                                    <Input type="text" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage className="shad-form_message" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="shad-label">Add Tags (separated by comma)</FormLabel>
                                <FormControl>
                                    <Input type="text" className="shad-input" placeholder="Art, Photography, Travel, etc." {...field} />
                                </FormControl>
                                <FormMessage className="shad-form_message" />
                            </FormItem>
                        )}
                    />
                    <div className="flex gap-4 justify-end items-center">
                        <Button className="shad-button_dark_4" type="button" onClick={() => navigate('/')}>
                            Cancel
                        </Button>
                        <Button className="shad-button_primary whitespace-nowrap" type="submit" disabled={action === 'Update' ? isLoadingUpdate : isLoadingCreate}>
                            {action === 'Update' ? (isLoadingUpdate ? <> <Loader /> Updating...</> : 'Update') : (isLoadingCreate ? <> <Loader /> Posting...</> : 'Post')}
                        </Button>
                    </div>
                </form>
            </Form>
        )
    }

    export default PostForm