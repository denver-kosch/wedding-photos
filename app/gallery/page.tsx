import { prisma } from '@/app/lib/prisma';

export default async function Gallery() {
    const submissions = await prisma.submission.findMany({
        where: { status: { in: ["COMPLETED", "PARTIAL"] } },
        include: { assets: { where: { status: "COMPLETED", immichAssetId: {not: null} }, orderBy: { uploadOrder: "asc" } } },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div>
            {submissions.map((submission) => (
                <article key={submission.id}>
                    <header>
                    <h2>{submission.submittedBy}</h2>
                    <time>{submission.createdAt.toLocaleDateString()}</time>
                    {submission.message && <p>{submission.message}</p>}
                    </header>

                    <div className="photo-grid">
                        {submission.assets.map((asset) => (<img key={asset.id} src={`/api/gallery-assets/${asset.immichAssetId}`} alt={`Photo submitted by ${submission.submittedBy}`} />))}
                    </div>
                </article>
            ))}
        </div>
    );
}