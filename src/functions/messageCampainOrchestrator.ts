import {
  app,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  InvocationContext,
} from '@azure/functions'
import * as df from 'durable-functions'
import {
  inputParserActivity,
  sendToQueueActivity,
  validateInputActivity,
} from './activities'
import { vendorCampaignOrchestrator } from './orchestrators'
import { isValidCampaignType } from '../validators'

const messageCampaignOrchestrator: HttpHandler = async (
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponse> => {
  const campaignType = request.params.campaignOrchestrationName

  if (!isValidCampaignType(campaignType)) {
    return new HttpResponse({
      status: 200,
      body: JSON.stringify({ success: false }),
    })
  }

  const client = df.getClient(context)

  const body = await request.json()

  if (typeof body !== 'object' || body === null) {
    return new HttpResponse({
      status: 200,
      body: JSON.stringify({ success: false }),
    })
  }

  const instanceId: string = await client.startNew(
    request.params.campaignOrchestrationName,
    { input: { vendor: request.params.campaignOrchestrationName, ...body } }
  )

  context.log(
    `Started orchestration with ID = '${instanceId}' for '${request.params.campaignOrchestrationName}' campaign.`
  )

  return new HttpResponse({
    status: 200,
    body: JSON.stringify({ success: true }),
  })
}

df.app.activity('inputParserActivity', { handler: inputParserActivity })
df.app.activity('validateInputActivity', { handler: validateInputActivity })
df.app.activity('sendToQueueActivity', { handler: sendToQueueActivity })

df.app.orchestration('viber', vendorCampaignOrchestrator)
df.app.orchestration('text', vendorCampaignOrchestrator)
df.app.orchestration('twilio', vendorCampaignOrchestrator)

app.http('messageCampaignOrchestrator', {
  route: 'async/{campaignOrchestrationName}/execute',
  extraInputs: [df.input.durableClient()],
  handler: messageCampaignOrchestrator,
})
