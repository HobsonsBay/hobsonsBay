@echo off

rem Set Knack API credentials
set KNACK_APP_ID=643f9820e4bda7002768d23a
set KNACK_API_KEY=e3d1e240-75de-43c2-b9f3-f7764534a100
set KNACK_OBJECT_ID=object_86

rem Set Algolia API credentials
set ALGOLIA_APP_ID=XM440BDFWL
set ALGOLIA_API_KEY=b4a1845dc1158f9a7b943987620234ab
set ALGOLIA_INDEX_NAME=addresses

rem Set the URL for the Knack API endpoint
set KNACK_API_URL=https://api.knack.com/v1/objects/%KNACK_OBJECT_ID%/records

rem Set the query parameters for the Knack API request
set KNACK_QUERY_PARAMS=format=raw

rem Set the query filter for the Knack API request
set KNACK_QUERY_FILTER={"match":"and","rules":[{"field":"field_2014","operator":"is","value":"Live"}]}

rem Build the full Knack API request URL
set KNACK_REQUEST_URL=%KNACK_API_URL%?%KNACK_QUERY_PARAMS%&filters=%KNACK_QUERY_FILTER%

rem Set the Algolia API endpoint
set ALGOLIA_API_URL=https://%ALGOLIA_APP_ID%.algolia.net/1/indexes/%ALGOLIA_INDEX_NAME%/batch

rem Set the content type for the Algolia API request
set ALGOLIA_CONTENT_TYPE=application/json

rem Set the user agent for the API requests
set USER_AGENT=knack-algolia-sync/1.0

rem Fetch the records from Knack
curl -H "X-Knack-Application-Id: %KNACK_APP_ID%" ^
     -H "X-Knack-REST-API-KEY: %KNACK_API_KEY%" ^
     -H "Content-Type: application/json" ^
     -X GET "%KNACK_REQUEST_URL%" > knack_records.json

rem Extract the records array from the Knack API response
jq -r ".records" knack_records.json > knack_records_array.json

rem Push the records to Algolia in batches of 100
jq -c ".[]" knack_records_array.json | powershell -Command "$batch = 1; while ($line = [System.Console]::In.ReadLine()) {if (([int]$batch % 100) -eq 1) { Out-File -FilePath ('knack_records-{0:d4}-batch-{1:d4}.json' -f $KNACK_QUERY_FILTER, ([int]([math]::Floor($batch/100))+1)) -InputObject $line } else { Add-Content -Path ('knack_records-{0:d4}-batch-{1:d4}.json' -f $KNACK_QUERY_FILTER, ([int]([math]::Floor($batch/100))+1)) -Value $line }; $batch++}"


for %%f in (knack_records_batch_*) do (
  set /p BATCH_REQUEST=<"%%f"
  set ALGOLIA_REQUEST_BODY={ "requests": [ %BATCH_REQUEST% ], "filters": "%KNACK_QUERY_FILTER%" }

  rem Push the records to Algolia
  curl -s -H "X-Algolia-API-Key: %ALGOLIA_API_KEY%" ^
    -H "X-Algolia-Application-Id: %ALGOLIA_APP_ID%" ^
    -H "Content-Type: %ALGOLIA_CONTENT_TYPE%" ^
    -H "User-Agent: %USER_AGENT%" ^
    -X POST --data-binary "%ALGOLIA_REQUEST_BODY%" ^
    "%ALGOLIA_API_URL%"

  echo Algolia index update response:
  echo.
)

rem Clean up temporary files
del knack_records.json knack_records_array.json knack_records_batch_*
