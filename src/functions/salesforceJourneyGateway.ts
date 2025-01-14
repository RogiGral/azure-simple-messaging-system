import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions'
import { tokenService } from '../services/token.service'
import { processMessage, replaceUrls } from '../helpers/message.helper'
import { cosmosDbService } from '../services/cosmosDb.service'

export async function salesforceJourneyGateway(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const requestJson = (await request.json()) as SalesforceJourneyPayload

    const { journeyId } = requestJson
    const { message: messageWithUrls } = requestJson.inArguments[0].config

    context.info(`Processing message with journeyId: ${journeyId}`)

    const urls = await processMessage(messageWithUrls)
    if (!urls.length) {
      return {
        status: 200,
        body: JSON.stringify({ message: messageWithUrls }),
      }
    }

    urls.forEach((url) => context.info(`Found URL: ${url}`))

    const messageWithToken = await tokenService.generateTokenizedUrls(urls)

    messageWithToken.forEach((value, key) =>
      context.info(`Tokenized URL: ${key} -> ${value}`)
    )

    await cosmosDbService.saveTokenizedUrls(messageWithToken, journeyId)

    const messageWithTokenizedUrls = await replaceUrls(
      messageWithUrls,
      messageWithToken
    )

    context.info(`Message with tokenized URLs: ${messageWithTokenizedUrls}`)

    return { body: JSON.stringify(messageWithTokenizedUrls) }
  } catch (error) {
    context.error(`Error processing message: ${error}`)
    return {
      status: 500,
      body: JSON.stringify({ error: error }),
    }
  }
}

app.http('salesforceJourneyGateway', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: salesforceJourneyGateway,
})
