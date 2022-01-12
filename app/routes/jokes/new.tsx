import type { ActionFunction, LoaderFunction } from 'remix'
import { redirect, useActionData, useCatch, useLocation, Link } from 'remix'
import { db } from '~/utils/db.server'
import { getUserId, requireUserId } from '~/utils/session.server'

function validateName(name: string) {
  if (!name) {
    return 'Name is required'
  }
  if (name.length < 3) {
    return 'Name must be at least 3 characters'
  }
}

function validateContent(content: string) {
  if (!content) {
    return 'Content is required'
  }
  if (content.length < 10) {
    return 'Content must be at least 10 characters'
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request)

  if (!userId) {
    throw new Response('You must be logged in to create a joke', { status: 401 })
  }
  return {}
}

interface ActionData {
  formError?: string
  fieldErrors?: { name?: string; content?: string }
  fields?: { name: string; content: string }
}

export const action: ActionFunction = async ({ request }): Promise<Response | ActionData> => {
  const userId = await requireUserId(request, '/jokes/new')
  const form = await request.formData()
  const name = form.get('name')
  const content = form.get('content')

  if (typeof name !== 'string' || typeof content !== 'string') {
    return { formError: 'Invalid form data' }
  }

  const fieldErrors = {
    name: validateName(name),
    content: validateContent(content),
  }

  if (Object.values(fieldErrors).some(Boolean)) {
    return { fieldErrors, fields: { name, content } }
  }

  const joke = await db.joke.create({
    data: { name, content, jokesterId: userId },
  })

  return redirect(`/jokes/${joke.id}`)
}

export default function NewJokeRoute() {
  const actionData = useActionData<ActionData>()

  return (
    <div>
      <p>Add your own hilarious joke</p>
      <form method="post">
        <div>
          <label>
            Name:{' '}
            <input
              type="text"
              defaultValue={actionData?.fields?.name}
              name="name"
              aria-invalid={Boolean(actionData?.fieldErrors?.name) || undefined}
              aria-describedby={actionData?.fieldErrors?.name ? 'name-error' : undefined}
            />
          </label>
          {actionData?.fieldErrors?.name ? (
            <p className="form-validation-error" role="alert" id="name-error">
              {actionData.fieldErrors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label>
            Content:{' '}
            <textarea
              defaultValue={actionData?.fields?.content}
              name="content"
              aria-invalid={Boolean(actionData?.fieldErrors?.content) || undefined}
              aria-describedby={actionData?.fieldErrors?.content ? 'content-error' : undefined}
            />
          </label>
          {actionData?.fieldErrors?.content ? (
            <p className="form-validation-error" role="alert" id="content-error">
              {actionData.fieldErrors.content}
            </p>
          ) : null}
        </div>
        <div>
          <button type="submit" className="button">
            Add
          </button>
        </div>
      </form>
    </div>
  )
}

export function CatchBoundary() {
  const { status } = useCatch()
  const { pathname } = useLocation()

  if (status === 401) {
    return (
      <div className="error-container">
        <p> You must login to create a joke</p>
        <Link to={`/login?redirectTo=${pathname}`}>Go to login</Link>
      </div>
    )
  }

  return null
}

export function ErrorBoundary() {
  return (
    <div className="error-container">Something unexpected went wrong. Sorry about that.</div>
  )
}
