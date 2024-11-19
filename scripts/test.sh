#!/bin/bash

./scripts/parallel --tag <<EOF
pnpm test:browser
cd test-apps/new-addon && pnpm test:fastboot
EOF
