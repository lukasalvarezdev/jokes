import * as React from 'react'
import { useLoaderData, Outlet, Link } from 'remix'
import type { LinksFunction } from 'remix'
import type { Joke, User } from '.prisma/client'
import { db } from '~/utils/db.server'
import stylesUrl from '../styles/jokes.css'
import { getUser } from '~/utils/session.server'
import type { LoaderFunctionType } from '~/utils/types'

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: stylesUrl,
    },
  ]
}

interface LoaderData {
  jokes: Array<Pick<Joke, 'id' | 'name'>>
  user: User | null
}

export const loader: LoaderFunctionType<LoaderData> = async ({ request }) => {
  const user = await getUser(request)
  const jokes = await db.joke.findMany({
    take: 5,
    select: { id: true, name: true },
    orderBy: { createdAt: 'desc' },
  })

  return { jokes, user }
}

export default function JokesRoute() {
  const { jokes, user } = useLoaderData<LoaderData>()

  return (
    <div className="jokes-layout">
      <header className="jokes-header">
        <div className="container">
          <h1 className="home-link">
            <Link to="/" title="Remix Jokes" aria-label="Remix Jokes">
              <span className="logo">🤪</span>
              <span className="logo-medium">J🤪KES</span>
            </Link>
          </h1>
          {user ? (
            <div className="user-info">
              <span>{`Hi ${user.username}`}</span>
              <form action="/logout" method="post">
                <button type="submit" className="button">
                  Logout
                </button>
              </form>
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </header>
      <main className="jokes-main">
        <div className="container">
          <div className="jokes-list">
            <Link to=".">Get a random joke</Link>
            <p>Here are a few more jokes to check out:</p>
            <ul>
              {jokes.map(j => (
                <li key={j.id}>
                  <Link to={j.id}>{j.name}</Link>
                </li>
              ))}
            </ul>
            <Link to="new" className="button">
              Add your own
            </Link>
          </div>
          <div className="jokes-outlet">
            <jokesContext.Provider
              value={{
                jokes,
              }}
            >
              <Outlet />
            </jokesContext.Provider>
          </div>
        </div>
      </main>
    </div>
  )
}

interface JokesContextProps {
  jokes: LoaderData['jokes']
}

const jokesContext = React.createContext<JokesContextProps>({} as JokesContextProps)

export function useJokes() {
  const ctx = React.useContext(jokesContext)
  return ctx
}
