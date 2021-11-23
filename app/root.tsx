import { Links, LiveReload, Meta, Outlet } from 'remix'

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
