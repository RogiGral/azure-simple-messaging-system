import { cosmosDbService } from '../services/cosmosDb.service'
import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions'

export async function linkRedirect(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const token = request.query.get('token')

  if (!token) {
    return {
      status: 400,
      headers: {
        'Content-Type': 'text/html',
      },
      body: '<html><body><h1>Error: Token is required</h1><p>Please provide a valid token in the URL.</p></body></html>',
    }
  }

  try {
    const targetUrl = (await cosmosDbService.getTokenizedUrls(token)) as string

    if (!targetUrl || targetUrl.length === 0) {
      return {
        status: 404,
        headers: {
          'Content-Type': 'text/html',
        },
        body: '<html><body><h1>Error: Link not found</h1><p>The provided token does not match any stored URLs.</p></body></html>',
      }
    }

    context.log(`Redirecting to: ${targetUrl}`)

    try {
      new URL(targetUrl)
    } catch {
      return {
        status: 400,
        headers: {
          'Content-Type': 'text/html',
        },
        body: '<html><body><h1>Error: Invalid URL stored</h1><p>The stored URL is not valid.</p></body></html>',
      }
    }

    return {
      status: 302,
      headers: {
        Location: targetUrl,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        Pragma: 'no-cache',
      },
    }
  } catch (error) {
    context.log('Error fetching token from CosmosDB:', error)
    return {
      status: 500,
      headers: {
        'Content-Type': 'text/html',
      },
      body: '<html><body><h1>Internal Server Error</h1><p>An error occurred while processing your request.</p></body></html>',
    }
  }
}

app.http('linkRedirect', {
  methods: ['GET'],
  route: 'token',
  authLevel: 'anonymous',
  handler: linkRedirect,
})
