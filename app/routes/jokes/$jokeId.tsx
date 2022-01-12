import { useLoaderData, useParams, Link, useCatch } from 'remix'
import type { LoaderFunction } from 'remix'
import { Joke } from '.prisma/client'
import { db } from '~/utils/db.server'

type LoaderData = Pick<Joke, 'name' | 'content'>

export const loader: LoaderFunction = async ({ params }) => {
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
    select: { content: true, name: true },
  })

  if (!joke) throw new Response('Joke not found', { status: 404 })
  return joke
}

export default function JokeRoute() {
  const joke = useLoaderData<LoaderData>()

  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <h3>{joke.name}</h3>
      <p>{joke.content}</p>
    </div>
  )
}

export function CatchBoundary() {
  const { status } = useCatch()

  if (status === 404) {
    return (
      <div className="error-container">
        <p>Joke not found</p>
        <Link to="/jokes">Go to all the jokes</Link>
      </div>
    )
  }

  return null
}

export function ErrorBoundary() {
  const { jokeId } = useParams()

  return (
    <div className="error-container">
      There was an error loading joke by the id {jokeId}. Sorry.
    </div>
  )
}
