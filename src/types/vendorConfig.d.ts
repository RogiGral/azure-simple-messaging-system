// Basic configurations
export interface MessageBaseConfig {
  selectedField: string
  campaignId: string
  market: string
}

// Platform-specific configurations
export interface TwilioMessageConfig extends MessageBaseConfig {
  message: string
  platform: 'twilio'
}

export interface TextMessageConfig extends MessageBaseConfig {
  message: string
  platform: 'm360' | 'infobip'
  senderId: string
  type: 'TextMessage'
  mid: string
}

// Viber-specific types
export type ViberMessageType =
  | 'TEXT_ONLY'
  | 'IMAGE_ONLY'
  | 'TEXT_IMAGE_BUTTON'
  | 'TEXT_BUTTON'

export interface ViberMessageConfig extends MessageBaseConfig {
  type: ViberMessageType
  appIdSelected: string
  mid: number
  selectedMessageType: string
  message?: string
  imageurl?: string
  button?: string
  action?: string
}

// Validation types
export interface ValidationError {
  configIndex: number
  errors: string[]
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  validCount: number
  invalidCount: number
}

// Combined message type
export type MessageConfig =
  | TwilioMessageConfig
  | TextMessageConfig
  | ViberMessageConfig

// Payload structure
export interface MessagePayload {
  inArguments: Array<{
    config: MessageConfig
    [key: string]: any
  }>
  [key: string]: any
}
