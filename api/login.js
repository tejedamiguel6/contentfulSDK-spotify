const clientId = '481089f1423043609ccb922dc46e1639'
const redirectUri = 'http://localhost:3000'

const generateRandomString = (length) => {
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const values = window.crypto.getRandomValues(new Uint8Array(length))
  return values.reduce(
    (acc, x) => acc + possible.charAt(x % possible.length),
    ''
  )
}

const sha256 = async (plain) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return window.crypto.subtle.digest('SHA-256', data)
}

const base64UrlEncode = (arrayBuffer) => {
  const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
  return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

const generateCodeChallenge = async (verifier) => {
  const hashed = await sha256(verifier)
  return base64UrlEncode(hashed)
}

export const getAuthCode = async () => {
  var state = generateRandomString(16)

  const codeVerifier = generateRandomString(128)
  const codeChallenge = await generateCodeChallenge(codeVerifier)
  window.localStorage.setItem('code_verifier', codeVerifier)

  const authUrl = new URL('https://accounts.spotify.com/authorize')
  const params = {
    response_type: 'code',
    client_id: clientId,
    scope: 'user-read-private user-read-email',
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
    state: state,
  }
  authUrl.search = new URLSearchParams(params).toString()
  window.open(authUrl.toString())
}

export async function exchangeCodeForToken() {
  if (!codeVerifier) throw new Error('Code verifier not found')

  const code = new URLSearchParams(window.location.search).get('code')
  const state = new URLSearchParams(window.location.search).get('state')

  console.log('this code--->', code)

  const authOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code: code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
      code_verifier: codeVerifier,
    }),
  }

  try {
    const tokenResponse = await fetch(
      'https://accounts.spotify.com/api/token',
      authOptions
    )

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      throw new Error(
        errorData.error_description || 'Error fetching access token'
      )
    }

    const tokenData = await tokenResponse.json()
    console.log(tokenData, '<--Token Data')
    // Handle token data (e.g., store token, update UI)
  } catch (error) {
    console.error('Error in exchangeCodeForToken:', error)
  }
}
