"use client";

import { useEffect, useRef, useState } from "react";

type Preview = {
  file: File;
  url: string;
};

export default () => {
    const [previews, setPreviews] = useState<Preview[]>([]);
    const previewUrls = useRef<string[]>([]);

    function handlePhotosSelected(event: React.ChangeEvent<HTMLInputElement>) {
        previewUrls.current.forEach((url) => {URL.revokeObjectURL(url)});

        const files = Array.from(event.target.files ?? []);

        const newPreviews = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));

        console.log("Selected files:", files);

        previewUrls.current = newPreviews.map((preview) => preview.url);
        setPreviews(newPreviews);
    }

    useEffect(() => {
        return () => {previewUrls.current.forEach((url) => {URL.revokeObjectURL(url)})};
    }, []);

  return (
    <div>
        <label htmlFor="photos" className="inline-block cursor-pointer rounded bg-wedding-rose px-4 py-2" >
            {previews.length > 0 ? "Choose different photos" : "Choose photos"}
        </label>

        <input id="photos" type="file" name="photos" accept="image/*" multiple required className="sr-only" onChange={handlePhotosSelected} />

        {previews.length > 0 && (
        <ul className="mt-4 grid w-full grid-cols-3 gap-3">
            {previews.map((preview) => (
            <li key={preview.url} className="min-w-0">
                <img src={preview.url} alt={`Preview of ${preview.file.name}`} className="block aspect-square w-full rounded object-cover" />

                <p className="mt-1 truncate text-sm">{preview.file.name}</p>
            </li>
            ))}
        </ul>
        )}
    </div>
  );
}