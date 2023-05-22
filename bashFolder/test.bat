@echo off

REM Check if Node.js is installed
where node > nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js and try again.
    exit /b 1
)

REM Set environment variables
set APPLICATION_ID=643f9820e4bda7002768d23a
set API_KEY=e3d1e240-75de-43c2-b9f3-f7764534a100
set KNACK_API_URL=https://api.knack.com/v1/objects/
set KNACK_PROPERTY_OBJECT_ID=object_86
set ALGOLIA_APP_ID=XM440BDFWL
set ALGOLIA_API_KEY=b4a1845dc1158f9a7b943987620234ab

REM Run the Node.js script for synchronization
node ./syncAddresses.ts

REM End of script
