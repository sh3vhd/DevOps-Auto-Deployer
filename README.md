# DevOps Auto Deployer – Repository Switcher

This repository now acts as a lightweight wrapper around the upstream project [`E-Commerce-Store-Pro`](https://github.com/sh3vhd/E-Commerce-Store-Pro).

## Usage

Run the helper script to download the latest copy of the upstream project into the `ecommerce-store-pro/` folder:

```bash
./scripts/sync-ecommerce-store-pro.sh
```

The script removes any previous local copy, clones the remote repository, and strips its Git metadata so it can live directly inside this workspace. After running it, you can inspect, modify, and commit the synced sources as needed.

> **Note:** You need internet access and Git installed for the sync script to succeed.
