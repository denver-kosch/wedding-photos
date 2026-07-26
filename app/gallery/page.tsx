import { prisma } from '@/app/lib/prisma';

export const dynamic = "force-dynamic";

export default async function Gallery() {
    const submissions = await prisma.submission.findMany({
        where: { status: { in: ["COMPLETED", "PARTIAL"] } },
        include: { assets: { where: { status: "COMPLETED", immichAssetId: {not: null} }, orderBy: { uploadOrder: "asc" } } },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div>
            <h1 className='text-6xl my-8 text-center'>Gallery</h1>
            {submissions.map((submission) => (
                <article key={submission.id} className='mb-12 flex w-full flex-col items-center px-4 text-center'>
                    <header className='mb-6'>
                        <h2 >{submission.submittedBy}</h2>
                        <time>{submission.createdAt.toLocaleDateString()}</time>
                        {submission.message && <p>{submission.message}</p>}
                    </header>

                    <div className="mx-auto flex w-full max-w-6xl flex-wrap justify-center gap-6">
                        {submission.assets.map((asset) => (<img className='mx-4 max-h-80 w-auto' key={asset.id} src={`/api/gallery-assets/${asset.immichAssetId}`} alt={`Photo submitted by ${submission.submittedBy}`} />))}
                    </div>
                </article>
            ))}
        </div>
    );
}