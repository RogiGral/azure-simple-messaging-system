param location string = resourceGroup().location
param storageAccountName string 
param functionAppName string 
param appInsightsName string 
param logAnalyticsName string 

param cosmosDbAccountName string 
param cosmosDbDatabaseName string 
param cosmosDbContainerName string 
param cosmosDbPartitionKey string
module storageAccount './modules/storageAccount.bicep' = {
  name: storageAccountName
  params: {
    location: location
    storageAccountName: storageAccountName
  }
}
module cosmosDb './modules/cosmosDb.bicep' = {
  name: cosmosDbAccountName
  params: {
    location: location
    cosmosDbAccountName: cosmosDbAccountName
    cosmosDbDatabaseName: cosmosDbDatabaseName
    cosmosDbContainerName: cosmosDbContainerName
    cosmosDbPartitionKey: cosmosDbPartitionKey
  }
}
module appInsights './modules/appInsights.bicep' = {
  name: appInsightsName
  params: {
    location: location
    appInsightsName: appInsightsName
    logAnalyticsName: logAnalyticsName
  }
}
module functionApp './modules/functionApp.bicep' = {
  name: functionAppName
  params: {
    location: location
    functionAppName: functionAppName
    storageAccountName: storageAccountName
    appInsightsInstrumentationKey: appInsights.outputs.appInsightsInstrumentationKey
    cosmosDbAccountName: cosmosDbAccountName
    cosmosDbDatabaseName: cosmosDbDatabaseName
    cosmosDbContainerName: cosmosDbContainerName
  }
}




