import bcrypt from 'bcryptjs'
import { createCookieSessionStorage, redirect } from 'remix'
import { db } from './db.server'

interface LoginType {
  username: string
  password: string
}

export async function login({ username, password }: LoginType) {
  const user = await db.user.findFirst({ where: { username } })
  if (!user) return null

  const passwordsMatch = await bcrypt.compare(password, user.passwordHash)
  if (!passwordsMatch) return null

  return user
}

const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) throw new Error('envrionment variable SESSION_SECRET must be set')

const storage = createCookieSessionStorage({
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
    name: 'RJ_session',
    secrets: [sessionSecret],
  },
})

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession(userId)
  session.set('userId', userId)
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  })
}
