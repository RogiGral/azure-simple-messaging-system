param location string
param storageAccountName string



resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: storageAccountName
  location: location
  tags: {
    environment: 'dev'
    buisness_unit: 'it'
  }
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
}


