#!/bin/bash

./scripts/parallel --tag <<EOF
yarn test:browser
cd test-apps/new-addon && yarn test:fastboot
EOF
