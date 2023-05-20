#!/bin/bash

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js and try again."
    exit 1
fi

# Set environment variables
export APPLICATION_ID="643f9820e4bda7002768d23a"
export API_KEY="e3d1e240-75de-43c2-b9f3-f7764534a100"
export KNACK_API_URL="https://api.knack.com/v1/objects/"
export KNACK_PROPERTY_OBJECT_ID="object_86"
export ALGOLIA_APP_ID="XM440BDFWL"
export ALGOLIA_API_KEY="b4a1845dc1158f9a7b943987620234ab"

# Run the Node.js script for synchronization
node ../syncAddresses.ts

# End of script