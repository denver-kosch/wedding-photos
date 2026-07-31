import { prisma } from "@/app/lib/prisma";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET( _request: Request, context: {params: Promise<{assetId: string}>} ) {
    const { assetId } = await context.params;

    if (!UUID_PATTERN.test(assetId)) return new Response("Invalid asset ID", { status: 400 });
    
    const submissionAsset = await prisma.submissionAsset.findFirst({ where: { immichAssetId: assetId, status: "COMPLETED" }, select: { id: true } });

    if (!submissionAsset) return new Response("Photo not found", { status: 404 });

    const immichUrl = process.env.IMMICH_URL;
    const galleryKey = process.env.IMMICH_GALLERY_KEY;

    if (!immichUrl || !galleryKey) {
        console.error("Missing IMMICH_URL or IMMICH_GALLERY_API_KEY");
        return new Response("Gallery is not configured", { status: 500 });
    }

    const immichResponse = await fetch(`${immichUrl}/assets/${encodeURIComponent(assetId)}/original`, { headers: { "x-api-key": galleryKey }, cache: "no-store" });

    if (!immichResponse.ok) {
        const errorText = await immichResponse.text();
        console.error("Immich photo request failed", { assetId, status: immichResponse.status, error: errorText });
        return new Response("Unable to retrieve photo", { status: immichResponse.status === 404 ? 404 : 502 });
    }

    return new Response(immichResponse.body, {
        status: 200,
        headers: {
            "Content-Type": immichResponse.headers.get("content-type") ?? "image/jpeg",
            "Cache-Control": "private, max-age=3600",
        },
    });
}