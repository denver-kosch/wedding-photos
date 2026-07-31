import { prisma } from '@/app/lib/prisma';
import ZoomedViewer from './zoomedViewer';
import GalleryView from './galleryView';

export const dynamic = "force-dynamic";

export default async function Gallery() {
	const submissions = await prisma.submission.findMany({
		where: { status: { in: ["COMPLETED", "PARTIAL"] } },
		include: { assets: { where: { status: "COMPLETED", immichAssetId: {not: null} }, orderBy: { uploadOrder: "asc" } } },
		orderBy: { createdAt: "desc" },
	});

	return (
		<div className="flex h-dvh min-h-0 flex-col overflow-hidden relative">
			<h1 className="my-8 shrink-0 text-center text-6xl">Gallery</h1>
			<GalleryView submissions={submissions} />
		</div>
	);
}