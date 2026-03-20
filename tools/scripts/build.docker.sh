#!/bin/bash

# remove previous assets
rm -rf ./public/assets/configs
rm -rf ./public/assets/multichain
rm -rf ./public/assets/envs.js

docker build \
  --progress=plain \
  --build-arg GIT_COMMIT_SHA=$(git rev-parse --short HEAD) \
  --build-arg GIT_TAG=$(git describe --tags --abbrev=0) \
  --build-arg NODE_MAX_OLD_SPACE_SIZE=${NODE_MAX_OLD_SPACE_SIZE:-4096} \
  -t blockscout-frontend:local \
  ./
