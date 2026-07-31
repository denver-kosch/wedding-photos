'use client';
import { Dispatch, SetStateAction } from "react";
import { Asset } from "./galleryView";

export default function AssetViewer({ assets, visible, setAssets }: { assets: Asset[], visible: boolean, setAssets: Dispatch<SetStateAction<Asset[]>> })  {

    return (
        visible && 
        <div className='fixed inset-0 z-[999] flex snap-x snap-mandatory items-center gap-4 overflow-x-auto overflow-y-hidden bg-black/90' onClick={() => setAssets([])}>
            {assets.map((asset) => (
                <div className="flex h-dvh w-[80dvw] shrink-0 snap-center items-center justify-center first:ml-[10dvw] last:mr-[10dvw]" key={asset.id} >
                    <img className="h-[90dvh] w-[80dvw] object-contain" src={`/api/gallery-assets/${asset.immichAssetId}`} alt={asset.originalFilename} />
                </div>
            ))}
        </div>
    );
};