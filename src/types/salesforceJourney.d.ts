interface SalesforceJourneyGatewayRequest {
  version: string
  config: {
    appIdSelected: string
    mid: number
    market: string
    labels?: string | null
    message: string
    selectedField: string
    selectedMessageType: string
    imageurl?: string
    button?: string
    action?: string
    imageUrl?: string
    campaignId?: string
  }
  configured: number[]
  row: string
  interactionId: string
  emailAddress: string
  emailDemographics: string
}

interface SalesforceJourneyPayload {
  inArguments: SalesforceJourneyGatewayRequest[]
  outArguments: any[]
  activityObjectID: string
  journeyId: string
  activityId: string
  definitionInstanceId: string
  activityInstanceId: string
  keyValue: string
  mode: number
}
