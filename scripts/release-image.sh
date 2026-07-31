#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
project_dir="$(dirname "$script_dir")"
cd "$project_dir"

version="$(node -p "require('./package.json').version")"

if [[ -z "$version" ]]; then
  echo "Error: package.json does not contain a version."
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