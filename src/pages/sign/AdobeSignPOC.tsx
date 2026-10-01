import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { generateCodeChallenge, generateCodeVerifier, randomString } from '../../lib/pkce'
import './EsignPOC.css'

// Acrobat Sign (formerly Adobe Sign) — a different product/API from the Adobe PDF
// Embed API used by the pdf-signature POC. Uses Adobe IMS OAuth with PKCE for public
// clients, then the Acrobat Sign REST API v6 to create an agreement for embedded signing.
// https://opensource.adobe.com/acrobat-sign/developer_guide/openapi/swagger-ui.html
const CLIENT_ID = import.meta.env.VITE_ADOBE_SIGN_CLIENT_ID ?? 'your-adobe-sign-client-id'
const AUTH_BASE = import.meta.env.VITE_ADOBE_SIGN_AUTH_BASE ?? 'https://secure.na1.adobesign.com'
const REDIRECT_URI = import.meta.env.VITE_ADOBE_SIGN_REDIRECT_URI ?? `${window.location.origin}/adobe-sign`
const SCOPES = 'user_login:self+agreement_write:self+agreement_send:self'
const DEMO_MODE = CLIENT_ID === 'your-adobe-sign-client-id'
const DEMO_TOKEN = 'demo-token'
const DEMO_API_ACCESS_POINT = 'demo'

const VERIFIER_KEY = 'adobesign_pkce_verifier'
const STATE_KEY = 'adobesign_pkce_state'
const TOKEN_KEY = 'adobesign_access_token'

type Status = { kind: 'info' | 'warning' | 'error' | 'success'; message: string }

function AdobeSignPOC() {
  const exchanging = useRef(false)
  const [accessToken, setAccessToken] = useState<string | null>(
    () => sessionStorage.getItem(TOKEN_KEY),
  )
  const [apiAccessPoint, setApiAccessPoint] = useState<string | null>(null)
  const [status, setStatus] = useState<Status | null>(null)
  const [signingUrl, setSigningUrl] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const state = params.get('state')
    if (!code || exchanging.current) return
    exchanging.current = true

    const expectedState = sessionStorage.getItem(STATE_KEY)
    const verifier = sessionStorage.getItem(VERIFIER_KEY)
    window.history.replaceState({}, '', window.location.pathname)

    function fail(message: string) {
      setStatus({ kind: 'error', message })
    }

    if (!verifier || state !== expectedState) {
      fail('PKCE state mismatch — please try connecting again.')
      return
    }

    function exchangeToken() {
      setBusy(true)
      fetch(`${AUTH_BASE}/oauth/v2/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code as string,
          client_id: CLIENT_ID,
          redirect_uri: REDIRECT_URI,
          code_verifier: verifier as string,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.access_token) throw new Error(data.error_description ?? 'No access token returned')
          sessionStorage.setItem(TOKEN_KEY, data.access_token)
          setAccessToken(data.access_token)
          setStatus({ kind: 'success', message: 'Connected to Acrobat Sign.' })
        })
        .catch((err) =>
          fail(
            `Token exchange failed: ${err.message}. If your app's OAuth config doesn't allow public/PKCE clients, this step needs a backend to hold the client secret.`,
          ),
        )
        .finally(() => setBusy(false))
    }
    exchangeToken()
  }, [])

  useEffect(() => {
    if (!accessToken || apiAccessPoint || accessToken === DEMO_TOKEN) return

    function loadApiAccessPoint() {
      setBusy(true)
      fetch(`${AUTH_BASE}/api/rest/v6/baseUris`, { headers: { Authorization: `Bearer ${accessToken}` } })
        .then((res) => res.json())
        .then((data) => {
          if (!data.apiAccessPoint) throw new Error('No apiAccessPoint returned')
          setApiAccessPoint(data.apiAccessPoint)
        })
        .catch((err) => setStatus({ kind: 'error', message: `Could not resolve API endpoint: ${err.message}` }))
        .finally(() => setBusy(false))
    }
    loadApiAccessPoint()
  }, [accessToken, apiAccessPoint])

  const handleConnect = async () => {
    if (DEMO_MODE) {
      setAccessToken(DEMO_TOKEN)
      setApiAccessPoint(DEMO_API_ACCESS_POINT)
      setStatus({
        kind: 'info',
        message: 'Simulated connection (no VITE_ADOBE_SIGN_CLIENT_ID set) — no real Acrobat Sign account is used.',
      })
      return
    }

    const verifier = generateCodeVerifier()
    const challenge = await generateCodeChallenge(verifier)
    const state = randomString(24)
    sessionStorage.setItem(VERIFIER_KEY, verifier)
    sessionStorage.setItem(STATE_KEY, state)

    const authUrl = new URL(`${AUTH_BASE}/public/oauth/v2`)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('scope', SCOPES)
    authUrl.searchParams.set('client_id', CLIENT_ID)
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI)
    authUrl.searchParams.set('code_challenge', challenge)
    authUrl.searchParams.set('code_challenge_method', 'S256')
    authUrl.searchParams.set('state', state)
    window.location.href = authUrl.toString()
  }

  const handleSendForSigning = async () => {
    if (!accessToken || !apiAccessPoint) return

    if (apiAccessPoint === DEMO_API_ACCESS_POINT) {
      setSigningUrl('/sample.pdf')
      setStatus({
        kind: 'success',
        message: 'Simulated signing session ready below (rendering sample.pdf directly, no Acrobat Sign API call was made).',
      })
      return
    }

    setBusy(true)
    setStatus({ kind: 'info', message: 'Uploading document and creating agreement…' })
    try {
      const pdfBlob = await fetch('/sample.pdf').then((r) => r.blob())
      const form = new FormData()
      form.append('File-Name', 'sample.pdf')
      form.append('File', pdfBlob, 'sample.pdf')

      const transient = await fetch(`${apiAccessPoint}api/rest/v6/transientDocuments`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: form,
      }).then((r) => r.json())

      if (!transient.transientDocumentId) throw new Error(transient.message ?? 'Document upload failed')

      const agreement = await fetch(`${apiAccessPoint}api/rest/v6/agreements`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileInfos: [{ transientDocumentId: transient.transientDocumentId }],
          name: 'Acrobat Sign POC document',
          participantSetsInfo: [
            {
              memberInfos: [{ email: 'signer@example.com' }],
              order: 1,
              role: 'SIGNER',
            },
          ],
          signatureType: 'ESIGN',
          state: 'IN_PROCESS',
        }),
      }).then((r) => r.json())

      if (!agreement.id) throw new Error(agreement.message ?? 'Agreement creation failed')

      const views = await fetch(`${apiAccessPoint}api/rest/v6/agreements/${agreement.id}/signingUrls`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }).then((r) => r.json())

      const url = views.signingUrlSetInfos?.[0]?.signingUrls?.[0]?.esignUrl
      if (!url) throw new Error('No embedded signing URL returned')
      setSigningUrl(url)
      setStatus({ kind: 'success', message: 'Embedded signing session ready below.' })
    } catch (err) {
      setStatus({ kind: 'error', message: (err as Error).message })
    } finally {
      setBusy(false)
    }
  }

  const handleDisconnect = () => {
    sessionStorage.removeItem(TOKEN_KEY)
    setAccessToken(null)
    setApiAccessPoint(null)
    setSigningUrl(null)
    setStatus(null)
  }

  return (
    <div className="esign-poc">
      <h1>Adobe Acrobat Sign integration</h1>
      <p>
        Connects via Adobe IMS OAuth + PKCE, then uploads <code>sample.pdf</code> as a transient
        document, creates an agreement, and opens an embedded signing session.
      </p>

      {DEMO_MODE && (
        <p className="esign-status warning">
          No <code>VITE_ADOBE_SIGN_CLIENT_ID</code> set &mdash; running in demo mode, which simulates
          the flow locally instead of calling Acrobat Sign. To use the real API, register an app in
          the{' '}
          <a href="https://acrobat.adobe.com/link/account/api" target="_blank" rel="noreferrer">
            Acrobat Sign API console
          </a>{' '}
          with redirect URI <code>{REDIRECT_URI}</code>, confirm your tenant's shard matches{' '}
          <code>VITE_ADOBE_SIGN_AUTH_BASE</code>, and set that env var.
        </p>
      )}

      {status && <p className={`esign-status ${status.kind}`}>{status.message}</p>}

      <div className="esign-panel">
        {!accessToken ? (
          <button onClick={handleConnect} disabled={busy}>
            Connect to Acrobat Sign
          </button>
        ) : (
          <div className="esign-actions">
            <button onClick={handleSendForSigning} disabled={busy || !apiAccessPoint}>
              Send sample.pdf for embedded signing
            </button>
            <button onClick={handleDisconnect} disabled={busy}>
              Disconnect
            </button>
          </div>
        )}
      </div>

      {signingUrl && (
        <div className="esign-signing-frame">
          <iframe src={signingUrl} title="Acrobat Sign embedded signing" />
        </div>
      )}

      <p>
        <Link to="/">Back home</Link>
      </p>
    </div>
  )
}

export default AdobeSignPOC
