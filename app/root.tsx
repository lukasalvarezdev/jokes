import type { LinksFunction } from 'remix'
import { Links, LiveReload, Outlet, Meta, useCatch, useLocation, Link } from 'remix'
import globalStylesUrl from './styles/global.css'
import globalMediumStylesUrl from './styles/global-medium.css'
import globalLargeStylesUrl from './styles/global-large.css'

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: globalStylesUrl,
    },
    {
      rel: 'stylesheet',
      href: globalMediumStylesUrl,
      media: 'print, (min-width: 640px)',
    },
    {
      rel: 'stylesheet',
      href: globalLargeStylesUrl,
      media: 'screen and (min-width: 1024px)',
    },
  ]
}

const Document: React.FC<{ title?: string }> = ({ children, title }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body>
        {process.env.NODE_ENV === 'development' && <LiveReload />}
        {children}
      </body>
    </html>
  )
}

export default function App({ title }: { title?: string }) {
  return (
    <Document title={title}>
      <Outlet />
    </Document>
  )
}

export function CatchBoundary() {
  const { status } = useCatch()
  const { pathname } = useLocation()

  if (status === 401) {
    return (
      <Document title="You must login">
        <div className="error-container">
          <p> You must login to be here.</p>
          <Link to={`/login?redirectTo=${pathname}`}>Go to login</Link>
        </div>
      </Document>
    )
  }

  return null
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title="Something went wrong">
      <div className="error-container">
        <h2>Something went wrong</h2>
        <p>{error.message}</p>
      </div>
    </Document>
  )
}
