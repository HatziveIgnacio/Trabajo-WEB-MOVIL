#!/bin/bash

# Create www directory if not exists
mkdir -p www

# Copy needed files to www
cp -r src/index.html www/
cp -r src/assets www/

echo "Angular files copied to www directory for serving."