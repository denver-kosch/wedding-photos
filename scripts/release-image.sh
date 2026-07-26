#!/usr/bin/env bash

set -euo pipefail

version="${1:-}"

if [[ -z "$version" ]]; then
  echo "Usage: pnpm release:image 1.0.1"
  exit 1
fi

image="dkkosch/wedding-photos:$version"

echo "Building Next.js..."
pnpm build

echo "Building and pushing $image..."
docker buildx build \
  --platform linux/amd64 \
  --tag "$image" \
  --push \
  .

echo
echo "Published $image"
echo "Update the TrueNAS YAML to:"
echo "image: $image"