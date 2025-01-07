param location string
param cosmosDbAccountName string
param cosmosDbDatabaseName string
param cosmosDbContainerName string
param cosmosDbPartitionKey string


resource cosmosDbAccount 'Microsoft.DocumentDB/databaseAccounts@2024-12-01-preview' = {
  name: cosmosDbAccountName
  location: location
  properties: {
    enableFreeTier: true
    databaseAccountOfferType: 'Standard'
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
    }
    locations: [
      {
        locationName: location
      }
    ]
  }
}

resource cosmosDbDatabase 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2024-12-01-preview' = {
  parent: cosmosDbAccount
  name: cosmosDbDatabaseName
  properties: {
    resource: {
      id: cosmosDbDatabaseName
    }
    options: {
      throughput: 1000
    }
  }
}

resource cosmosDbContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2024-12-01-preview' = {
  parent: cosmosDbDatabase
  name: cosmosDbContainerName
  properties: {
    resource: {
      id: cosmosDbContainerName
      partitionKey: {
        paths: [
          cosmosDbPartitionKey
        ]
        kind: 'Hash'
      }
      indexingPolicy: {
        indexingMode: 'consistent'
        includedPaths: [
          {
            path: '/*'
          }
        ]
        excludedPaths: [
          {
            path: '/_etag/?'
          }
        ]
      }
    }
  }
}

