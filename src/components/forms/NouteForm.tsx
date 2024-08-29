import { zodResolver } from "@hookform/resolvers/zod";
import { Models } from "appwrite";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FileUploader, Loader } from "@/components/shared";
import { Textarea } from "../ui/textarea";
import { NouteValidation } from "@/lib/validation";
import { useNavigate } from "react-router-dom";
import { useCreateNoute, useUpdateNoute } from "@/lib/react-query/queries";
import { useToast } from "../ui/use-toast";
import { useUserContext } from "@/context/AuthContext";

type NouteFormProps = {
    noute?: Models.Document;
    action: "Create" | "Update";
};

const NouteForm = ({ noute, action }: NouteFormProps) => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user } = useUserContext();

    const { mutateAsync: createNoute, isLoading: isLoadingCreate } =
        useCreateNoute();
    const { mutateAsync: updateNoute, isLoading: isLoadingUpdate } =
        useUpdateNoute();

    const form = useForm<z.infer<typeof NouteValidation>>({
        resolver: zodResolver(NouteValidation),
        defaultValues: {
            caption: noute ? noute?.caption : "",
            file: [],
            location: noute ? noute.location : "",
            tags: noute ? noute.tags.join(",") : "",
        },
    });

    async function onSubmit(values: z.infer<typeof NouteValidation>) {
        if (noute && action === "Update") {
            const updatedPost = await updateNoute({
                ...values,
                nouteId: noute.$id,
                imageId: noute.imageId,
                imageUrl: noute.imageUrl,
            });

            if (!updatedPost) {
                toast({
                    title: `${action} noute failed. Please try again.`,
                });
            }
            return navigate(`/noutes/${noute.$id}`);
        }

        const newNoute = await createNoute({ ...values, userId: user.id });

        if (!newNoute) {
            toast({
                title: `${action} noute failed. Please try again.`,
            });
        }

        navigate("/");
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-9 w-full max-w-5xl"
            >
                <FormField
                    control={form.control}
                    name="caption"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">
                                Caption
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    className="shad-textarea custom-scrollbar"
                                    {...field}
                                />
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
                            <FormLabel className="shad-form_label">
                                Add Photos
                            </FormLabel>
                            <FormControl>
                                <FileUploader
                                    fieldChange={field.onChange}
                                    mediaUrl={noute?.imageUrl}
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
                            <FormLabel className="shad-form_label">
                                Add Location
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    className="shad-input"
                                    {...field}
                                />
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
                            <FormLabel className="shad-form_label">
                                Add Tags (separated by comma " , ")
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Art, Expression, Learn"
                                    type="text"
                                    className="shad-input"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />

                <div className="flex gap-4 items-center justify-end">
                    <Button
                        type="button"
                        className="shad-button_dark_4"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="shad-button_primary whitespace-nowrap"
                        disabled={isLoadingCreate || isLoadingUpdate}
                    >
                        {isLoadingCreate || (isLoadingUpdate && <Loader />)}
                        {action} Noute
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default NouteForm;
