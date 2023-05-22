Function Import-KnackToAlgolia {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true, 
            HelpMessage="Knack API key")]
            [string]$KnackAPIKey,

        [Parameter(Mandatory=$true, 
            HelpMessage="The identifier for the source Knack Application")]
            [string]$KnackAppId,

        [Parameter(Mandatory=$true, 
            HelpMessage="Algolia API key")]
            [string]$AlgoliaAPIKey,

        [Parameter(Mandatory=$true, 
            HelpMessage="The identifier for the target Algolia Application")]
            [string]$AlgoliaAppId
    )

    BEGIN {
        #setup Knack API URL
        $KnackQueryParams = "format=raw"
        $KnackQueryFilter = '{"match":"and","rules":[{"field":"field_5252","operator":"is","value":"Current"},{"field":"field_1596","operator":"is","value":"No"}]}'
        $KnackAPIUrl = "https://api.knack.com/v1/objects/object_86/records?" + $KnackQueryParams + "&filters=" + $KnackQueryFilter + '&rows_per_page=1000'
    
        #construct and run an initial request to get the page count
        $KnackHeaders = @{ 'X-Knack-Application-Id'= $KnackAppId; 'X-Knack-REST-API-KEY' = $KnackAPIKey; 'Content-Type'='application/json'}

        Write-Debug ("Fetch the records from Knack at " + $KnackAPIUrl)
        Write-Debug ("Fetching with headers " + (ConvertTo-Json $KnackHeaders))

        $KnackResponse = Invoke-WebRequest -Uri $KnackAPIUrl -Method Get -Headers $KnackHeaders
        Write-Debug $KnackResponse 

        $Records = ConvertFrom-Json $KnackResponse 
        Write-Debug ('Records Found: ' + $Records.records.Length)
    }
    PROCESS {
        #setup Algolia API call URL
        $AlgoliaAPIUrl = "https://" + $AlgoliaAppId + ".algolia.net/1/indexes/addresses/batch"
    
        #loop through the pages and process the records
        for ($Index = 0; $Index -lt $Records.total_pages; $Index += 1) {
        
            #set up the page URL and retrieve the page
            $Page = ($Index + 1)
            $KnackGetPageUrl = $KnackAPIUrl + '&page=' + $Page
            $KnackResponse = Invoke-WebRequest -Uri $knackGetPageUrl -Method Get -Headers $knackHeaders
    
            #push the records into PSObjects to simplify handling
            $Records = $KnackResponse | ConvertFrom-Json
   
            Write-Debug ("Page " + $Page + " Retrieved. " + $Records.records.Length + " records")

            #push the records over to the target format 
            $MappedBatch = @()
            foreach ($Record in $Records.records) {

                #handle the empty second address line neatly
                if ([string]::IsNullOrEmpty($record.field_1619.street2)) {
                    $StreetAddress = $Record.field_1619.street 
                } else {
                    $StreetAddress = $Record.field_1619.street + ', ' + $Record.field_1619.street2
                }

                $MappedRecord = 
                    @{ 
                        action = 'updateObject'; 
                        body = @{
                            "Property Address" = $StreetAddress + ' ' + $Record.field_1619.city + ', ' + $Record.field_1619.state + ' ' + $Record.field_1619.zip;
                            "Assessment Number" = $Record.field_1618;
                            "ID Agility Property" = $Record.field_1841; 
                            objectID = $Record.field_1618
                        }
                    }
                $MappedBatch += $MappedRecord
            }

            $AlgoliaRequestBody = '{ "requests" : [ ' + (ConvertTo-Json $MappedBatch) + ' ]}'
            $AlgoliaRequestHeaders = @{  
                "X-Algolia-API-Key" = $AlgoliaAPIKey;
                "X-Algolia-Application-Id" = $AlgoliaAppId;
                "Content-Type" = "application/json";
                "User-Agent" = "knack-algolia-sync/1.0"
                }

            Write-Debug $AlgoliaRequestBody

            $AlgoliaResponse = Invoke-WebRequest $AlgoliaAPIUrl -Method Post -Headers $AlgoliaRequestHeaders -Body $AlgoliaRequestBody
            Write-Debug $AlgoliaResponse
        }
    }
    END {
            if ($algoliaResponse.StatusCode -eq 200) { Write-Output ("Page " + $Page + " Records Synchronised: " + $MappedBatch.Length) } else { Write-Output ("Synchronisation Failed with code " + $algoliaResponse.StatusCode) }
    }
}

$KNACK_APP_ID="643f9820e4bda7002768d23a"
$KNACK_API_KEY="e3d1e240-75de-43c2-b9f3-f7764534a100"

$ALGOLIA_APP_ID="XM440BDFWL"
$ALGOLIA_API_KEY="b4a1845dc1158f9a7b943987620234ab"

Import-KnackToAlgolia -KnackAPIKey $KNACK_API_KEY -KnackAppId $KNACK_APP_ID -AlgoliaAPIKey $ALGOLIA_API_KEY -AlgoliaAppId $ALGOLIA_APP_ID -ErrorAction Stop