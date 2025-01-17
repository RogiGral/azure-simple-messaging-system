import { Twilio } from 'twilio'
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message'

interface MessageOptions {
  to: string
  body: string
  mediaUrl?: string[]
  scheduledTime?: Date
}

export class TwilioService {
  private client: Twilio
  private phoneNumber: string

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN

    if (!accountSid || !authToken || !process.env.TWILIO_PHONE_NUMBER) {
      throw new Error('Missing required Twilio configuration')
    }

    this.phoneNumber = process.env.TWILIO_PHONE_NUMBER

    this.client = require('twilio')(accountSid, authToken)
  }

  async sendMessage(options: MessageOptions): Promise<MessageInstance> {
    try {
      this.validatePhoneNumber(options.to)

      const messageParams = {
        to: options.to,
        from: this.phoneNumber,
        body: options.body,
        ...(options.mediaUrl && { mediaUrl: options.mediaUrl }),
      }

      if (options.scheduledTime) {
        if (options.scheduledTime < new Date()) {
          throw new Error('Scheduled time must be in the future')
        }
        messageParams['sendAt'] = options.scheduledTime.toISOString()
        messageParams['scheduleType'] = 'fixed'
        return await this.client.messages.create(messageParams)
      }

      return await this.client.messages.create(messageParams)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to send message'
      throw new Error(`Twilio error: ${errorMessage}`)
    }
  }

  async sendBulkMessages(
    numbers: string[],
    body: string
  ): Promise<MessageInstance[]> {
    try {
      const sendPromises = numbers.map((number) =>
        this.sendMessage({ to: number, body })
      )
      return await Promise.all(sendPromises)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to send bulk messages'
      throw new Error(`Twilio bulk message error: ${errorMessage}`)
    }
  }

  private validatePhoneNumber(phoneNumber: string): void {
    const phoneRegex = /^\+[1-9]\d{1,14}$/
    if (!phoneRegex.test(phoneNumber)) {
      throw new Error(
        'Invalid phone number format. Must be E.164 format (e.g., +1234567890)'
      )
    }
  }

  async getMessageHistory(limit: number = 50): Promise<MessageInstance[]> {
    try {
      const messages = await this.client.messages.list({ limit })
      return messages
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to retrieve message history'
      throw new Error(`Twilio history error: ${errorMessage}`)
    }
  }
}
