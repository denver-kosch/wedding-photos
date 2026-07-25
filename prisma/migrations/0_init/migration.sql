-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('uploading', 'completed', 'partial', 'failed');

-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('pending', 'processing', 'completed', 'failed');

-- CreateTable
CREATE TABLE "submission_assets" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "submission_id" UUID NOT NULL,
    "immich_asset_id" UUID,
    "original_filename" TEXT NOT NULL,
    "mime_type" VARCHAR(100),
    "file_size_bytes" BIGINT,
    "upload_order" INTEGER NOT NULL DEFAULT 0,
    "status" "AssetStatus" NOT NULL DEFAULT 'pending',
    "error_message" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploaded_at" TIMESTAMPTZ(6),

    CONSTRAINT "submission_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submissions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "submitted_by" VARCHAR(100) NOT NULL,
    "message" VARCHAR(500),
    "upload_token" UUID NOT NULL DEFAULT gen_random_uuid(),
    "status" "SubmissionStatus" NOT NULL DEFAULT 'uploading',
    "expected_asset_count" INTEGER,
    "successful_asset_count" INTEGER NOT NULL DEFAULT 0,
    "failed_asset_count" INTEGER NOT NULL DEFAULT 0,
    "ip_address" INET,
    "user_agent" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ(6),

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "submission_assets_immich_asset_id_key" ON "submission_assets"("immich_asset_id");

-- CreateIndex
CREATE INDEX "submission_assets_submission_id_idx" ON "submission_assets"("submission_id");

-- CreateIndex
CREATE UNIQUE INDEX "submissions_upload_token_key" ON "submissions"("upload_token");

-- CreateIndex
CREATE INDEX "submissions_created_at_idx" ON "submissions"("created_at" DESC);

-- CreateIndex
CREATE INDEX "submissions_status_idx" ON "submissions"("status");

-- AddForeignKey
ALTER TABLE "submission_assets" ADD CONSTRAINT "submission_assets_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "submissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

