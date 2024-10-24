import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea"

import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import FileUploader from "../shared/FileUploader";

const PostFormSchema = z.object({
    caption: z.string().min(5).max(500),
    file: z.custom<File[]>(),
    location: z.string().min(2).max(100),
    tags: z.string(),
});

const PostForm = () => {
    const isSigningIn = false
    const form = useForm<z.infer<typeof PostFormSchema>>({
        resolver: zodResolver(PostFormSchema),
        defaultValues: {
            caption: "",
            file: undefined,
            location: "",
            tags: "",
        }
    })

    const onSubmit = (values: z.infer<typeof PostFormSchema>) => {
        //do Somthing
        console.log(values)
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
                                <FileUploader />
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
                    <Button className="shad-button_dark_4" type="button" disabled={isSigningIn}>
                        Cancel
                    </Button>
                    <Button className="shad-button_primary whitespace-nowrap" type="submit" disabled={isSigningIn}>
                        Post
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default PostForm