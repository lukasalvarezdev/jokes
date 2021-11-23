import type { LinksFunction } from 'remix'
import styles from '~/styles/index.css'

export const links: LinksFunction = () => {
  return [
    {
      href: styles,
      rel: 'stylesheet',
    },
  ]
}

export default function IndexRoute() {
  return <div>Hello Index Route</div>
}
