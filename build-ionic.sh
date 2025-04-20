#!/bin/bash
# Build script for Ionic Angular app

echo "Building Ionic Angular app..."

# Install dependencies if needed
# npm install

# Build the Angular app
npx @angular/cli build --configuration=production

# Copy to www folder
cp -r dist/* www/

echo "Build complete. Files copied to www/ directory."