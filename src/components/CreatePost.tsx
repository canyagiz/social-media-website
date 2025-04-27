import React, { ChangeEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "../supabase-client";

interface PostInput {
    title: string;
    content: string;
}

const createPost = async (post: PostInput, imageFile: File) => {

    const filePath = `${post.title}-${Date.now()}-${imageFile.name}`;

    const { data: uploadData, error: uploadError } = await supabase.storage.from("post-images").upload(filePath, imageFile);
    if (uploadError) throw new Error(uploadError.message);

    const { data: publicURLData } = await supabase.storage.from("post-images").getPublicUrl(filePath);

    const { data, error } = await supabase.from("posts").insert({...post, image_url: publicURLData.publicUrl});

    if (error) throw new Error(error.message);
    return data;
};

export const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const { mutate, isPending, isError } = useMutation({ mutationFn: (data: {post:PostInput, imageFile:File}) => {
        return createPost(data.post, data.imageFile);
    }}); // mutationFn: the function makes supabase call & return back a response to useMutation Hook

    const handleSubmit = (event: React.FormEvent) => {
        /* Normally, after submission, the page is refreshed. Thus, the user information is lost.
            for being able to inserr post data on supabase postgresql, refreshing behaviour is stopped.
        */
        event.preventDefault();

        /* React Query 2 important hooks
            - 1. useQuery
            - 2. useMutation: Add, insert, delete, update data on service
        */
       if(!selectedFile) return;
        mutate({post:{ title, content }, imageFile: selectedFile}); // try insert title and content on supabase "posts" table after submit button is clicked
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files[0]) { // if user pass multiple files, accept only first one
            setSelectedFile(e.target.files[0]);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      <div>
        <label htmlFor="title" className="block mb-2 font-medium">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="content" className="block mb-2 font-medium">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          rows={5}
          required
        />
      </div>

      <div>
        <label htmlFor="image" className="block mb-2 font-medium">
          Upload Image
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-gray-200"
        />
      </div>
      <button
        type="submit"
        className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
      > {isPending ? "Creating..." : "Create Post"}
      </button>

      {isError && <p className="text-red-500"> Error creating post.</p>}
    </form>
  );
};
