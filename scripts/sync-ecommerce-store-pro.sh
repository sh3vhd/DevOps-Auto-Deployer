#!/usr/bin/env bash
set -euo pipefail

REPO_URL="https://github.com/sh3vhd/E-Commerce-Store-Pro.git"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="${SCRIPT_DIR}/../ecommerce-store-pro"

rm -rf "${TARGET_DIR}"
echo "Cloning ${REPO_URL} into ${TARGET_DIR}..."
git clone "${REPO_URL}" "${TARGET_DIR}"
rm -rf "${TARGET_DIR}/.git"
echo "Repository synced successfully."
