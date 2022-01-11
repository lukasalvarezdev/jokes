import { Link } from 'remix'
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

export default function Index() {
  return (
    <div className="container">
      <div className="content">
        <h1>
          Remix <span>Jokes!</span>
        </h1>
        <nav>
          <ul>
            <li>
              <Link to="jokes">Read Jokes</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
