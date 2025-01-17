export const isValidCampaignType = (type: string) => {
  return ['viber', 'text', 'twilio'].includes(type)
}
