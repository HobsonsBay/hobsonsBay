#!/bin/bash

# Set Knack API credentials
KNACK_APP_ID="5cf7091b790be9000a691701"
KNACK_API_KEY="89a78a00-872c-11e9-85bd-1f76d3d7deca"
KNACK_OBJECT_ID=object_86

# Set Algolia API credentials
ALGOLIA_APP_ID="JW7FDA7YTI"
ALGOLIA_API_KEY="7a3b39eba83ef97796c682e6a749be71"
ALGOLIA_INDEX_NAME="addresses"

# Set the URL for the Knack API endpoint
KNACK_API_URL="https://api.knack.com/v1/objects/${KNACK_OBJECT_ID}/records"

# Set the query parameters for the Knack API request
KNACK_QUERY_PARAMS="format=raw"

# Set the query filter for the Knack API request
KNACK_QUERY_FILTER='{"match":"and","rules":[{"field":"field_2014","operator":"is","value":"Live"},{"field":"field_5252","operator":"is","value":"Current"},{"field":"field_1596","operator":"is","value":"No"}]}'

# Build the full Knack API request URL
KNACK_REQUEST_URL="${KNACK_API_URL}?${KNACK_QUERY_PARAMS}&filters=$(echo ${KNACK_QUERY_FILTER} | jq -c .)"

# Set the Algolia API endpoint
ALGOLIA_API_URL="https://${ALGOLIA_APP_ID}.algolia.net/1/indexes/${ALGOLIA_INDEX_NAME}/batch"

# Set the content type for the Algolia API request
ALGOLIA_CONTENT_TYPE="application/json"

# Set the user agent for the API requests
USER_AGENT="knack-algolia-sync/1.0"

#Fetch the records from Knack

KNACK_RESPONSE=$(curl -s -H "X-Knack-Application-Id: ${KNACK_APP_ID}" \
     -H "X-Knack-REST-API-KEY: ${KNACK_API_KEY}" \
     -H "Content-Type: application/json" \
     -X GET "https://api.knack.com/v1/objects/object_86/records?rows_per_page=1000&format=raw&filters=filters=%7B%22match%22%3A%22and%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22field_2014%22%2C%22operator%22%3A%22is%22%2C%22value%22%3A%22Live%22%7D%2C%7B%22field%22%3A%22field_5252%22%2C%22operator%22%3A%22is%22%2C%22value%22%3A%22Current%22%7D%2C%7B%22field%22%3A%22field_1596%22%2C%22operator%22%3A%22is%22%2C%22value%22%3A%22No%22%7D%5D%7D")

# Extract the total number of records from the Knack API response
RECORD_COUNT=$(echo "${KNACK_RESPONSE}" | jq -r '.total_records')

# Push the records to Algolia in batches of 100
BATCH_SIZE=1000
BATCH_COUNT=$(( RECORD_COUNT / BATCH_SIZE + 1 ))

echo "Batch Size: $BATCH_SIZE"
echo "No of Batches: $BATCH_COUNT"
echo "No of Records to Sync: $RECORD_COUNT"

for (( i=0; i<$BATCH_COUNT; i++ )); do
  BATCH_START=$(( i * BATCH_SIZE ))
  echo "Batch No: $((i+1))"
  BATCH_QUERY_PARAMS="${KNACK_QUERY_PARAMS}&filters=$(echo ${KNACK_QUERY_FILTER} | jq -c .)&page=$(( i + 1 ))"
  
  # Fetch the batch of records from Knack
  BATCH_RESPONSE=$(curl -s -H "X-Knack-Application-Id: ${KNACK_APP_ID}" \
     -H "X-Knack-REST-API-KEY: ${KNACK_API_KEY}" \
     -H "Content-Type: application/json" \
     -X GET "https://api.knack.com/v1/objects/object_86/records?rows_per_page=1000&format=raw&filters=%7B%22match%22%3A%22and%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22field_2014%22%2C%22operator%22%3A%22is%22%2C%22value%22%3A%22Live%22%7D%2C%7B%22field%22%3A%22field_5252%22%2C%22operator%22%3A%22is%22%2C%22value%22%3A%22Current%22%7D%2C%7B%22field%22%3A%22field_1596%22%2C%22operator%22%3A%22is%22%2C%22value%22%3A%22No%22%7D%5D%7D&page=$(( i + 1 ))")
  
  # Extract the records array from the Knack API response
  RECORDS=$(echo "${BATCH_RESPONSE}" | jq -r '.records')
  ALGOLIA_REQUEST_BODY=$(echo "${RECORDS}" | jq -c '{ "requests": [ .[] | { "action": "updateObject", "body": { "Property Address": "\(.field_1619.street) \(.field_1619.street2 // "") \(.field_1619.city) \(.field_1619.state) \(.field_1619.zip)", "Assessment Number": .field_1618, "ID Agility Property": .field_1841, "objectID": (.field_1618 | tostring) } } ] }')
   # echo "${ALGOLIA_REQUEST_BODY}"
  ALGOLIA_RESPONSE=$(curl -s -H "X-Algolia-API-Key: ${ALGOLIA_API_KEY}" \
     -H "X-Algolia-Application-Id: ${ALGOLIA_APP_ID}" \
     -H "Content-Type: ${ALGOLIA_CONTENT_TYPE}" \
     -H "User-Agent: ${USER_AGENT}" \
     -X POST --data-binary "${ALGOLIA_REQUEST_BODY}" \
     "${ALGOLIA_API_URL}")
    echo "Algolia index update response:"
    echo "${ALGOLIA_REQUEST_BODY}"
    echo "${ALGOLIA_RESPONSE}"
done
