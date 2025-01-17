export async function processMessage(message: string): Promise<string[]> {
  const urlPattern = /(https?:\/\/[^\s<>)"']+)/g
  const urls = Array.from(message.matchAll(urlPattern), (match) => match[0])
  try {
    const validUrls = urls.filter((url) => {
      try {
        new URL(url)
        return true
      } catch {
        console.warn(`Invalid URL found: ${url}`)
        return false
      }
    })

    return validUrls
  } catch (error) {
    console.error('Error processing URLs:', error)
    return []
  }
}

export async function replaceUrls(
  message: string,
  urlsMap: Map<string, string>
): Promise<string> {
  let result = message

  const TOKEN_API_BASE_URL = process.env.TOKEN_API_BASE_URL

  urlsMap.forEach((value, key) => {
    result = result.replace(key, `${TOKEN_API_BASE_URL}?token=${value}`)
  })
  return result
}

export async function messageParser(
  vendor: string,
  payload: any[]
): Promise<any[]> {
  switch (vendor.toUpperCase()) {
    case 'VIBER':
      return viberMessageParser(payload)
    case 'TWILIO':
      return twilioMessageParser(payload)
    case 'TEXT':
      return textMessageParser(payload)
    default:
      throw new Error(`Unsupported vendor: ${vendor}`)
  }
}

async function viberMessageParser(payload: any[]): Promise<any[]> {
  const processedMessages = payload
    .map((item) => item.config)
    .filter((config) => config)
    .map(processViberConfig)

  return processedMessages
}

async function twilioMessageParser(payload: any[]): Promise<any[]> {
  const processedMessages = payload
    .map((item) => item.config)
    .filter((config) => config)
    .map(processTwilioConfig)

  return processedMessages
}

async function textMessageParser(payload: any[]): Promise<any[]> {
  const processedMessages = payload
    .map((item) => item.config)
    .filter((config) => config)
    .map(processTextConfig)

  return processedMessages
}

const generateSeq = () => Math.floor(Math.random() * 1000000)

const processTextConfig = (config: any) => {
  switch (config.platform.toUpperCase()) {
    case 'M360':
      return {
        app_key: '<app_key>',
        app_secret: '<app_secret>',
        msisdn: config.selectedField,
        content: config.message,
        shortcode_mask: config.senderId,
        rcvd_transid: '12334512312312',
        is_intl: false,
      }
    case 'INFOBIP': {
      return {
        messages: [
          {
            destinations: [{ to: config.selectedField }],
            from: config.senderId,
            text: config.message,
          },
        ],
      }
    }
  }
}

const processTwilioConfig = (config: any) => {
  return {
    to: config.selectedField,
    message: config.message,
    country: config.country,
  }
}

const processViberConfig = (config: any) => {
  const baseOutput = {
    service_id: parseInt(config.appIdSelected),
    dest: config.selectedField,
    seq: generateSeq(),
    label: config.selectedMessageType,
  }

  switch (config.type) {
    case 'TEXT_ONLY':
      return {
        ...baseOutput,
        type: 106,
        message: {
          '#txt': config.message,
        },
      }

    case 'IMAGE_ONLY':
      return {
        ...baseOutput,
        type: 107,
        message: {
          '#img': config.imageurl,
        },
      }

    case 'TEXT_IMAGE_BUTTON':
      return {
        ...baseOutput,
        type: 108,
        message: {
          '#txt': config.message,
          '#img': config.imageurl,
          '#caption': config.button,
          '#action': config.action,
        },
      }

    case 'TEXT_BUTTON':
      return {
        ...baseOutput,
        type: 109,
        message: {
          '#txt': config.message,
          '#caption': config.button,
          '#action': config.action,
        },
      }

    default:
      throw new Error(`Unsupported message type: ${config.type}`)
  }
}
