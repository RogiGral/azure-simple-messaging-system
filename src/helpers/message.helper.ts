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
