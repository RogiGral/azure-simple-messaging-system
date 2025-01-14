export const config = {
  DEFAULT_TTL: 60 * 60 * 24, // 24 hours
  TOKEN_API_BASE_URL:
    process.env.TOKEN_API_BASE_URL || 'http://localhost:7071/api/token',
}
