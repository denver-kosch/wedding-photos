import UploadForm from './uploadForm';

export default function Home() {
	return (
			<main className="flex flex-1 size-full flex-col items-center justify-center px-16 font-sans">
				<h1 className="text-4xl font-bold text-center md:text-5xl bg-white/80 rounded">Denver & Kylan Kosch</h1>

				<p className="mt-6 text-l md:text-xl text-center bg-white/80 rounded md:w-[50%] font-semibold">
					Thank you for sharing in our special day! Here is where you 
					are welcome to upload photos from the day, whether they are 
					from the ceremony, reception, or any other part of the day!
				</p>

				<UploadForm />

			</main>
	);
}
 