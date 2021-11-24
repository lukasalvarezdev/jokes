import { useLoaderData } from 'remix'
import type { LoaderFunction } from 'remix'
import { Joke } from '.prisma/client'
import { db } from '~/utils/db.server'

type LoaderData = Pick<Joke, 'name' | 'content'>

export const loader: LoaderFunction = async ({ params }) => {
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
    select: { content: true, name: true },
  })

  if (!joke) throw new Error('Joke not found')
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
