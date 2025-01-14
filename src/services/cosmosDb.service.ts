import { CosmosClient, Database, Container } from '@azure/cosmos'

class CosmosDbService {
  public cosmosClient: CosmosClient
  public database: Database
  public container: Container

  constructor() {
    const connectionString = process.env.COSMOSDB_CONNECTION_STRING
    const dbName = process.env.COSMOSDB_DATABASE_NAME
    const containerName = process.env.COSMOSDB_CONTAINER_NAME

    if (!connectionString) {
      throw new Error('COSMOSDB_CONNECTION_STRING is not defined')
    }
    if (!dbName) {
      throw new Error('COSMOSDB_DATABASE_NAME is not defined')
    }
    if (!containerName) {
      throw new Error('COSMOSDB_CONTAINER_NAME is not defined')
    }

    try {
      this.cosmosClient = new CosmosClient(connectionString)
      this.database = this.cosmosClient.database(dbName)
      this.container = this.database.container(containerName)
    } catch (error) {
      throw new Error(`Failed to initialize Cosmos DB connection: ${error}`)
    }
  }

  async saveTokenizedUrls(
    tokenizedUrls: Map<string, string>,
    journeyId: string
  ): Promise<void> {
    const savePromises = Array.from(tokenizedUrls).map(([url, token]) =>
      cosmosDbService.container.items.create({
        url,
        token,
        journeyId,
      })
    )
    await Promise.all(savePromises)
  }

  async getTokenizedUrls(token: string): Promise<String> {
    const { resources: items } = await cosmosDbService.container.items
      .query({
        query: 'SELECT * FROM c WHERE c.token = @token',
        parameters: [{ name: '@token', value: token }],
      })
      .fetchAll()

    return items.length > 0 ? items[0].url : ''
  }
}

export const cosmosDbService = new CosmosDbService()
