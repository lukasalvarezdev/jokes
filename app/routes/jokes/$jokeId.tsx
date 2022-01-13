import { useLoaderData, useParams, Link, useCatch, redirect } from 'remix'
import type { ActionFunction } from 'remix'
import { Joke } from '.prisma/client'
import { db } from '~/utils/db.server'
import type { LoaderFunctionType, MetaFunctionType } from '~/utils/types'
import { getUserId, requireUserId } from '~/utils/session.server'

type LoaderData = { joke: Pick<Joke, 'name' | 'content' | 'jokesterId'>; canDelete: boolean }

export const meta: MetaFunctionType<LoaderData> = ({ data }) => {
  if (!data) return { title: 'Something went wrong', description: 'Something went wrong' }

  return { title: `${data.joke.name} - Jokes App`, description: data.joke.content }
}

export const loader: LoaderFunctionType<LoaderData> = async ({ params, request }) => {
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
    select: { content: true, name: true, jokesterId: true },
  })
  const userId = await getUserId(request)

  if (!joke) throw new Response('Joke not found', { status: 404 })
  return { joke, canDelete: joke.jokesterId === userId }
}

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData()

  if (form.get('_method') === 'delete') {
    const userId = await requireUserId(request)
    const joke = await db.joke.findUnique({
      where: { id: params.jokeId },
    })
    if (!joke) {
      throw new Response("Can't delete what does not exist", { status: 404 })
    }
    if (joke.jokesterId !== userId) {
      throw new Response("Pssh, nice try. That's not your joke", {
        status: 401,
      })
    }

    await db.joke.delete({ where: { id: params.jokeId } })
    return redirect('/jokes')
  }
}

export default function JokeRoute() {
  const { joke, canDelete } = useLoaderData<LoaderData>()

  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <h3>{joke.name}</h3>
      <p>{joke.content}</p>

      {canDelete ? (
        <form method="post">
          <input type="hidden" name="_method" value="delete" />
          <button type="submit">Delete</button>
        </form>
      ) : null}
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
