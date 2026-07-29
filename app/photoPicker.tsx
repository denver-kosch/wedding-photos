"use client";

import { useEffect, useRef, useState } from "react";

type Preview = {
  file: File;
  url: string;
};

export default () => {
    const [previews, setPreviews] = useState<Preview[]>([]);
    const previewUrls = useRef<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    const handlePhotosSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        previewUrls.current.forEach((url) => {URL.revokeObjectURL(url)});
        const files = Array.from(event.target.files ?? []);
        const newPreviews = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
        previewUrls.current = newPreviews.map((preview) => preview.url);
        setPreviews(newPreviews);
    };

    const removePhoto = (urlToRemove: string) => {
        const remainingPreviews = previews.filter((preview) => preview.url !== urlToRemove);
        URL.revokeObjectURL(urlToRemove);
        previewUrls.current = previewUrls.current.filter((url) => url !== urlToRemove);
        setPreviews(remainingPreviews);

        if (inputRef.current) {
            const dataTransfer = new DataTransfer();
            remainingPreviews.forEach((preview) => {dataTransfer.items.add(preview.file)});
            inputRef.current.files = dataTransfer.files;
        }
    }

    useEffect(() => {
        const form = inputRef.current?.form;

        function handleFormReset() {
            previewUrls.current.forEach((url) => {URL.revokeObjectURL(url)});
            previewUrls.current = [];
            setPreviews([]);
        }

        form?.addEventListener("reset", handleFormReset);

        return () => {
            form?.removeEventListener("reset", handleFormReset);
            previewUrls.current.forEach((url) => {URL.revokeObjectURL(url)});
        };
    }, []);

  return (
    <div className="flex flex-col items-center w-full my-4">
        <label htmlFor="photos" className="cursor-pointer rounded bg-wedding-rose px-4 py-2">{previews.length > 0 ? "Choose different photos" : "Choose photos"}</label>
        <input ref={inputRef} id="photos" type="file" name="photos" accept="image/*" multiple required className="sr-only" onChange={handlePhotosSelected} />
        {previews.length> 0 && <div className="mt-4 flex w-full overflow-x-auto gap-3">
            {previews.map((preview) => (
                <div className="relative w-32 flex-shrink-0" key={preview.url}>
                    <img src={preview.url} alt={`Preview of ${preview.file.name}`} className="block aspect-square w-full rounded object-cover" />
                    <button type="button" onClick={() => removePhoto(preview.url)} aria-label={`Remove ${preview.file.name}`}
                    className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-lg leading-none text-white hover:bg-black">
                        ×
                    </button>
                </div>
            ))}
        </div>}
    </div>
  );
}