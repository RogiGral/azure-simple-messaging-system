import {
  MessageBaseConfig,
  TwilioMessageConfig,
  TextMessageConfig,
  ViberMessageConfig,
  MessageConfig,
  ValidationResult,
  ViberMessageType,
  MessagePayload,
} from '../types/vendorConfig'

// Validate common fields across all message types
function validateBaseConfig(config: MessageBaseConfig): string[] {
  const errors: string[] = []

  if (!config.selectedField) {
    errors.push('selectedField is required')
  } else if (!/^\d+$/.test(config.selectedField)) {
    errors.push('selectedField must contain only digits')
  }

  if (!config.campaignId) {
    errors.push('campaignId is required')
  }

  if (!config.market) {
    errors.push('market is required')
  } else if (!/^[A-Z]{2}$/.test(config.market)) {
    errors.push('market must be a 2-letter country code in uppercase')
  }

  return errors
}

// Validate Twilio-specific configuration
function validateTwilioConfig(config: TwilioMessageConfig): string[] {
  const errors: string[] = []

  if (!config.message) {
    errors.push('message is required for Twilio messages')
  }

  return errors
}

// Validate Text message configuration (m360/infobip)
function validateTextConfig(config: TextMessageConfig): string[] {
  const errors: string[] = []

  if (!config.message) {
    errors.push('message is required for text messages')
  }

  if (!config.senderId) {
    errors.push('senderId is required for text messages')
  }

  if (!config.type || config.type !== 'TextMessage') {
    errors.push('type must be "TextMessage"')
  }

  if (!config.mid) {
    errors.push('mid is required for text messages')
  }

  return errors
}

// Validate Viber message type-specific fields
function validateViberMessageType(config: ViberMessageConfig): string[] {
  const errors: string[] = []

  switch (config.type) {
    case 'TEXT_ONLY':
    case 'TEXT_BUTTON':
      if (!config.message) {
        errors.push(`message is required for ${config.type}`)
      }
      if (config.type === 'TEXT_BUTTON') {
        if (!config.button) {
          errors.push('button is required for TEXT_BUTTON')
        }
        if (!config.action) {
          errors.push('action is required for TEXT_BUTTON')
        }
      }
      break

    case 'IMAGE_ONLY':
      if (!config.imageurl) {
        errors.push('imageurl is required for IMAGE_ONLY')
      }
      break

    case 'TEXT_IMAGE_BUTTON':
      if (!config.message) {
        errors.push('message is required for TEXT_IMAGE_BUTTON')
      }
      if (!config.imageurl) {
        errors.push('imageurl is required for TEXT_IMAGE_BUTTON')
      }
      if (!config.button) {
        errors.push('button is required for TEXT_IMAGE_BUTTON')
      }
      if (!config.action) {
        errors.push('action is required for TEXT_IMAGE_BUTTON')
      }
      break
  }

  return errors
}

// Validate Viber-specific configuration
function validateViberConfig(config: ViberMessageConfig): string[] {
  const errors: string[] = []

  if (!config.type) {
    errors.push('type is required for Viber messages')
  }

  if (!config.appIdSelected) {
    errors.push('appIdSelected is required for Viber messages')
  }

  if (!config.selectedMessageType) {
    errors.push('selectedMessageType is required for Viber messages')
  }

  if (typeof config.mid !== 'number') {
    errors.push('mid must be a number for Viber messages')
  }

  return [...errors, ...validateViberMessageType(config)]
}

// Validate single config
function validateSingleConfig(config: MessageConfig): string[] {
  let errors = validateBaseConfig(config)

  if ('platform' in config) {
    if (config.platform === 'twilio') {
      errors = [...errors, ...validateTwilioConfig(config)]
    } else if (config.platform === 'm360' || config.platform === 'infobip') {
      errors = [...errors, ...validateTextConfig(config as TextMessageConfig)]
    }
  } else {
    errors = [...errors, ...validateViberConfig(config as ViberMessageConfig)]
  }

  return errors
}

// Main validation function
function validatePayload(inArguments: Array<any>): ValidationResult {
  if (!Array.isArray(inArguments)) {
    return {
      isValid: false,
      errors: [{ configIndex: -1, errors: ['inArguments must be an array'] }],
      validCount: 0,
      invalidCount: 1,
    }
  }

  if (inArguments.length === 0) {
    return {
      isValid: false,
      errors: [
        { configIndex: -1, errors: ['inArguments array cannot be empty'] },
      ],
      validCount: 0,
      invalidCount: 1,
    }
  }

  const result: ValidationResult = {
    isValid: true,
    errors: [],
    validCount: 0,
    invalidCount: 0,
  }

  // Validate each config in the inArguments array
  inArguments.forEach((arg, index) => {
    const config = arg?.config

    if (!config) {
      result.errors.push({
        configIndex: index,
        errors: ['Missing config object'],
      })
      result.invalidCount++
      return
    }

    const configErrors = validateSingleConfig(config)

    if (configErrors.length > 0) {
      result.errors.push({
        configIndex: index,
        errors: configErrors,
      })
      result.invalidCount++
    } else {
      result.validCount++
    }
  })

  result.isValid = result.invalidCount === 0

  return result
}

// Entry point function
export const validateMessage = (payload: MessagePayload): ValidationResult => {
  const { inArguments = [] } = payload
  return validatePayload(inArguments)
}

export default validateMessage
