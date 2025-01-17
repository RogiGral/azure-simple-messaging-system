import { ActivityHandler } from 'durable-functions'

export const sendToQueueActivity: ActivityHandler = (
  input: any
): Promise<any> => {
  return Promise.resolve(input)
}
