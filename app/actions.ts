'use server';

import { init, uploadAsset, addAssetsToAlbum } from "@immich/sdk";
import { prisma } from "./lib/prisma";
import { headers } from "next/headers";
import { UploadState } from "./upload-types";


export const uploadPhotos = async (previousState: UploadState, formData: FormData): Promise<UploadState> => {
        "use server";
        
        init({ baseUrl: process.env.IMMICH_URL!, apiKey: process.env.IMMICH_API_KEY! });

        const name = String(formData.get("name") ?? "").trim();
        const rawMessage = String(formData.get("message") ?? "").trim();
        const photos = formData.getAll("photos").filter((entry): entry is File => entry instanceof File && entry.size > 0);

        if (!name) throw new Error("Please enter your name.");
        if (name.length > 100) throw new Error("Name must be 100 characters or fewer.");
        if (rawMessage.length > 500) throw new Error("Message must be 500 characters or fewer.");
        if (photos.length === 0) throw new Error("Please select at least one photo.");
    
        const requestHeaders = await headers();

        const ipAddress = requestHeaders.get("cf-connecting-ip") ?? requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

        const submission = await prisma.submission.create({
            data: {
                submittedBy: name, message: rawMessage || null, expectedAssetCount: photos.length, ipAddress, 
                userAgent: requestHeaders.get("user-agent"),
                assets: {
                    create: photos.map((photo, index) => ({
                        originalFilename: photo.name,
                        mimeType: photo.type || null,
                        fileSizeBytes: BigInt(photo.size),
                        uploadOrder: index,
                    })),
                },
            },
            include: {assets: {orderBy: {uploadOrder: "asc"}}}
        });

        const outcomes = await Promise.all(
            photos.map(async (photo, index) => {
                const assetRecord = submission.assets[index];

                try {
                    await prisma.submissionAsset.update({where: {id: assetRecord.id}, data: {status: "PROCESSING"}});

                    const timestamp = new Date(photo.lastModified || Date.now()).toISOString();

                    const uploadedAsset = await uploadAsset({
                        assetMediaCreateDto: {
                        assetData: photo,
                        fileCreatedAt: timestamp,
                        fileModifiedAt: timestamp,
                        },
                    });
                    /* Save the Immich ID immediately. If adding it to the album subsequently fails, the database still records where the uploaded file went. */
                    await prisma.submissionAsset.update({where: {id: assetRecord.id}, data: {immichAssetId: uploadedAsset.id}});

                    const albumResults = await addAssetsToAlbum({id: process.env.IMMICH_ALBUM_ID!, bulkIdsDto: {ids: [uploadedAsset.id]},});

                    const albumResult = albumResults[0];

                    if (!albumResult?.success) throw new Error(`Immich uploaded the file, but could not add it to the Wedding Photos album: ${albumResult?.error ?? "unknown album error"}`,);
                    
                    await prisma.submissionAsset.update({
                        where: {id: assetRecord.id,},
                        data: {status: "COMPLETED", uploadedAt: new Date(), errorMessage: null},
                    });

                    return { success: true, assetId: assetRecord.id };
                } catch (error: unknown) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    console.error(`Failed to upload ${photo.name}:`, error);
                    await prisma.submissionAsset.update({ where: {id: assetRecord.id}, data: { status: "FAILED", errorMessage } });
                    return { success: false, assetId: assetRecord.id, error: errorMessage };
                }
            })
        );

        const successfulAssetCount = outcomes.filter((outcome) => outcome.success,).length;

        const failedAssetCount = outcomes.length - successfulAssetCount;

        const submissionStatus =
        successfulAssetCount === outcomes.length ? "COMPLETED" : successfulAssetCount === 0 ? "FAILED" : "PARTIAL";

        await prisma.submission.update({
        where: { id: submission.id },
        data: {
            status: submissionStatus,
            successfulAssetCount,
            failedAssetCount,
            completedAt: new Date(),
        },
        });

        if (submissionStatus === "COMPLETED") return { status: "success", successfulCount: successfulAssetCount };
        

        if (submissionStatus === "PARTIAL") return { status: "partial", successfulCount: successfulAssetCount, failedCount: failedAssetCount, message: "Some photos uploaded, but others failed." };
        
        return {
            status: "error",
            failedCount: failedAssetCount,
            message: "We couldn't upload your photos. Please try again.",
        };
};