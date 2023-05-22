#!/bin/bash

APPLICATION_ID="643f9820e4bda7002768d23a"
API_KEY="e3d1e240-75de-43c2-b9f3-f7764534a100"
KNACK_API_URL="https://api.knack.com/v1/objects/"
KNACK_PROPERTY_OBJECT_ID="object_86"
ALGOLIA_APP_ID="XM440BDFWL"
ALGOLIA_API_KEY="b4a1845dc1158f9a7b943987620234ab"

ITEM_OBJECT_URL="${KNACK_API_URL}${KNACK_PROPERTY_OBJECT_ID}"

syncAddress () {
    echo "$ALGOLIA_API_KEY $ALGOLIA_APP_ID"
  index=$(curl -s -X POST -H "X-Algolia-API-Key: $ALGOLIA_API_KEY" -H "X-Algolia-Application-Id: $ALGOLIA_APP_ID" --data-binary '{"name":"addresses"}' "https://${ALGOLIA_APP_ID}.algolia.net/1/indexes" | jq -r '.name')
  echo "Algolia index created: $index"
  
  nowDate=$(date +"%Y-%m-%d %H:%M:%S")
  hourStart=$(date -d "${nowDate:0:14}:00:00" +"%Y-%m-%d %H:%M:%S")
  hour=$(date -d "$nowDate" +"%H%M")

  page=1
  results=()

  while [ ${#results[@]} -ge 1000 ]
  do
    response=$(getItems ${page})
    rows=$(echo $response | jq -r '.rows')
    results+=($rows)
    indexSave=$(echo $rows | jq -c 'group_by(.objectID) | map({ "action": "updateObject", "body": .[0] })' | curl -s -X POST -H "X-Algolia-API-Key: $ALGOLIA_API_KEY" -H "X-Algolia-Application-Id: $ALGOLIA_APP_ID" --data-binary @- "https://${ALGOLIA_APP_ID}.algolia.net/1/indexes/addresses/batch")
    echo "Algolia index updated with ${#rows[@]} rows: $indexSave"
    ((page++))
  done

  echo "Sync completed at $hourStart"
}

getItems () {
  RECORDS_URL=${ITEM_OBJECT_URL}/records
  FILTERS='{"match":"and","rules":[{"field":"field_2014","operator":"is","value":"Live"}]}'
  QUERY="?page=${1}&rows_per_page=1000&format=raw&filters=$(echo $FILTERS | jq -r @uri)"

  json=$(curl -s -H "Content-Type: application/json" -H "X-Knack-Application-Id: $APPLICATION_ID" -H "X-Knack-REST-API-KEY: $API_KEY" "${RECORDS_URL}${QUERY}")
  rows=$(echo $json | jq -r '.records | map({ "Property Address": (.field_1619.street + .field_1619.street2 + .field_1619.city + .field_1619.state + .field_1619.zip), "Assessment Number": .field_1618, "ID Agility Property": .field_1841, "objectID": (.field_1618 | tostring) })')

  echo "{\"rows\":$rows}"
}

syncAddress
