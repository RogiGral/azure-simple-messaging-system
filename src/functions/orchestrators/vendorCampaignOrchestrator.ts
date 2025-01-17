import { OrchestrationContext, OrchestrationHandler } from 'durable-functions'

export const vendorCampaignOrchestrator: OrchestrationHandler = function* (
  context: OrchestrationContext
) {
  const input = context.df.getInput() as any

  const { isValid, errors } = yield context.df.callActivity(
    'validateInputActivity',
    input
  )

  if (!isValid) {
    context.log(errors)
    return errors
  }

  const parsedInput = yield context.df.callActivity(
    'inputParserActivity',
    input
  )

  context.log(parsedInput)

  return parsedInput
}
