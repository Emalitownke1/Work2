name: Unzip and Flatten

on:
  workflow_dispatch:

jobs:
  unzip_flatten:
    name: Unzip ZIP and Move to Root
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Unzip and move to root
        run: |
          mkdir temp
          unzip -q "Bwm-trekker-6f70a5dea5e66e8712f51cb4c8dbd1a4d0a76cd9 (1).zip" -d temp
          inner_dir=$(find temp -mindepth 1 -maxdepth 1 -type d)
          mv -n "$inner_dir"/* .
          rm -rf temp
          rm "Bwm-trekker-6f70a5dea5e66e8712f51cb4c8dbd1a4d0a76cd9 (1).zip"

      - name: Commit and Push
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add .
          git commit -m "Unzipped and moved contents to repo root" || echo "No changes to commit"
          git push origin HEAD:main
