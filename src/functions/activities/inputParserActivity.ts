import { ActivityHandler } from 'durable-functions'
import { messageParser } from '../../helpers'

export const inputParserActivity: ActivityHandler = (
  input: any
): Promise<any[]> => {
  const parsedInput = messageParser(input.vendor, input.inArguments)
  return parsedInput
}
