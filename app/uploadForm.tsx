"use client";

import { useActionState } from "react";
import { uploadPhotos } from "./actions";
import PhotoPicker from "./photoPicker";
import { UploadState } from "./upload-types";


const initialState = { status: "idle", message: "" } satisfies UploadState;

export default function UploadForm() {
  const [state, formAction, isPending] = useActionState( uploadPhotos, initialState );
    
    if (state.status === "success") return (
        <section className='border rounded items-center justify-center text-center p-4 mt-4 bg-white/70'>
                <h2 className="">Thank you!</h2>
                <p className="">Your photos have been added to our wedding album.{<br/>}We can't wait to look through them!</p>
        </section>
    );
    

    return (
        <form className="flex flex-col w-full md:w-[35%] items-center justify-center mt-6 border rounded bg-black/70" action={formAction}>
            <input type='text' name='name' placeholder='Your Name(s)' maxLength={100} className="my-4 bg-wedding-cream rounded" required/>
            <input type='text' name='message' placeholder='Message (Optional)' maxLength={500} className="bg-wedding-cream rounded" />
            <PhotoPicker />
            <button type='submit' className="bg-wedding-rosewood text-white px-4 py-2 mb-4 rounded hover:bg-wedding-rose" disabled={isPending}>{isPending ? "Uploading…" : "Upload"}</button>
            {state.status === "error" && (<p role="alert">{state.message}</p>)}
        </form>
    )
};