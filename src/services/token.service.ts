import crypto from 'crypto'

class TokenService {
  generateToken(length = 32) {
    return crypto
      .randomBytes(length)
      .toString('base64')
      .replace(/[/+=]/g, '')
      .slice(0, length)
  }

  async generateTokenizedUrls(urls: string[]): Promise<Map<string, string>> {
    return new Map(urls.map((url) => [url, this.generateToken()]))
  }
}

export const tokenService = new TokenService()
