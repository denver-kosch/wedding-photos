-- DropIndex
DROP INDEX "submission_assets_immich_asset_id_key";

-- CreateIndex
CREATE INDEX "submission_assets_immich_asset_id_idx" ON "submission_assets"("immich_asset_id");
