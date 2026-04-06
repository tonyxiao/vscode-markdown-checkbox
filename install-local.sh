#!/usr/bin/env bash
set -euo pipefail

npm install
npm run compile
npx @vscode/vsce package --no-yarn
code --install-extension markdown-checkbox-*.vsix
