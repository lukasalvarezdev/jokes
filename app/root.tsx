import type { LinksFunction } from 'remix'
import { Links, LiveReload, Outlet, Meta } from 'remix'
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

export default function App({ title }: { title?: string }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <Outlet />
      <body>{process.env.NODE_ENV === 'development' && <LiveReload />}</body>
    </html>
  )
}
