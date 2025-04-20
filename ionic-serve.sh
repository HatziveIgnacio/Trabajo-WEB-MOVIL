#!/bin/bash
# Script to serve Ionic Angular app on Replit

# Export environment variables for Ionic
export IONIC_HTTP_HOST=0.0.0.0
export IONIC_HTTP_PORT=5000
export IONIC_DISABLE_BROWSER_OPEN=true
export IONIC_USE_LOCAL_CLI=true

# Tell Ionic to listen on 0.0.0.0 (all interfaces)
npx ionic serve --external --address=0.0.0.0 --port=5000 --no-open