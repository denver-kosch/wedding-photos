import Image from "next/image";
import PhotoPicker from "@/app/photoPicker";

export default function Home() {

	const uploadPhotos = async (formData: FormData) => {
		"use server";

		const name = formData.get("name") as string;
		const message = formData.get("message") as string;
		const photos = formData.getAll("photos") as File[];

		console.log("Name:", name);
		console.log("Message:", message);
		console.log("Photos:", photos);
	};


	return (
			<main className="flex flex-1 w-full flex-col items-center justify-center py-32 px-16 font-sans">
				<h1 className="text-4xl font-bold text-center md:text-5xl">Denver & Kylan Kosch</h1>

				<p className="mt-6 text-l md:text-xl text-center">
					Thank you for sharing in our special day! Here is where you 
					are welcome to upload photos from the day, whether they are 
					from the ceremony, reception, or any other part of the day!
				</p>

				<form className="flex flex-col w-[35%] items-center justify-center mt-6 border border-solid border-black" action={uploadPhotos}>
					<input type='text' name='name' placeholder='Your Name(s)' className="mb-4 bg-wedding-cream" required/>
					<input type='text' name='message' placeholder='A Message To The Couple?' className="mb-4 bg-wedding-cream" />
					<PhotoPicker />
					<button type='submit' className="bg-wedding-rosewood text-white px-4 py-2 rounded hover:bg-wedding-rose">Upload</button>
				</form>
			</main>
	);
}
 