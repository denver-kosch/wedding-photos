'use client';
import { useState } from 'react';
import { AssetStatus, SubmissionStatus } from '@/app/generated/prisma/enums';
import ZoomedViewer from './zoomedViewer';


export type Asset = {
	id: string;
	status: AssetStatus;
	createdAt: Date;
	uploadOrder: number;
	submissionId: string;
	immichAssetId: string | null;
	originalFilename: string;
	mimeType: string | null;
	fileSizeBytes: bigint | null;
	errorMessage: string | null;
	uploadedAt: Date | null;
};

type Submission = {
	assets: Asset[];
	id: string;
	submittedBy: string;
	message: string | null;
	uploadToken: string;
	status: SubmissionStatus;
	expectedAssetCount: number | null;
	successfulAssetCount: number;
	failedAssetCount: number;
	ipAddress: string | null;
	userAgent: string | null;
	createdAt: Date;
	completedAt: Date | null;
};


export default function GalleryView ({submissions}: {submissions: Submission[]}) {
	const [viewerAssets, setViewerAssets] = useState<Asset[]>([]);

	return (
		<>
			<div className="min-h-0 flex flex-col overflow-y-auto w-full items-center">
				{submissions.map((submission) => (
					<article key={submission.id} className='mb-8 pb-4 flex w-fit flex-col items-center px-4 text-center bg-white/80 rounded hover:bg-gray-300/80' onClick={() => setViewerAssets(submission.assets)}>
						<header className='mb-6 mt-3 rounded border py-1 px-3'>
							<h2 className='text-3xl'>{submission.submittedBy}</h2>
							{submission.message && <p className='text-2xl'>{submission.message}</p>}
						</header>

						<div className="mx-auto flex w-full max-w-6xl flex-wrap justify-center gap-6">
							{submission.assets.map((asset) => (<img className='mx-4 max-h-80 w-auto rounded' key={asset.id} src={`/api/gallery-assets/${asset.immichAssetId}`} alt={`Photo submitted by ${submission.submittedBy}`} />))}
						</div>
					</article>
				))}
			</div>

			<ZoomedViewer assets={viewerAssets}  setAssets={setViewerAssets} visible={viewerAssets.length > 0} />
		</>
	)
}