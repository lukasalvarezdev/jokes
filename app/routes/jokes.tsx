import * as React from 'react'
import { Joke } from '.prisma/client'
import { LoaderFunction, useLoaderData } from 'remix'
import { Outlet, Link } from 'remix'
import { db } from '~/utils/db.server'

type LoaderData = Pick<Joke, 'id' | 'name'>[]

export const loader: LoaderFunction = async () => {
  const jokes = await db.joke.findMany({
    take: 5,
    select: { id: true, name: true },
    orderBy: { createdAt: 'desc' },
  })

  return jokes
}

export default function JokesRoute() {
  const jokes = useLoaderData<LoaderData>()

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
  jokes: LoaderData
}

const jokesContext = React.createContext<JokesContextProps>({} as JokesContextProps)

export function useJokes() {
  const ctx = React.useContext(jokesContext)
  return ctx
}
