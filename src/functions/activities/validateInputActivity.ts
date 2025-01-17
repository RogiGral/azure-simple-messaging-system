import { ActivityHandler } from 'durable-functions'
import { messageParser } from '../../helpers'
import validateMessage from '../../validators/config.validator'
import { ValidationResult } from '../../types/vendorConfig'

export const validateInputActivity: ActivityHandler = (
  input: any
): Promise<ValidationResult> => {
  return Promise.resolve(validateMessage(input))
}
