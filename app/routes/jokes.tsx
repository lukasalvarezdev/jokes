import * as React from 'react'
import { Outlet } from 'remix'

// This is a parent route.
export default function JokesRoute() {
  const pepe = 'Hola'

  React.useEffect(() => {
    console.log('First render')
  }, [])

  return (
    <div>
      <jokesContext.Provider
        value={{
          pepe,
        }}
      >
        <h1>J🤪KES</h1>
        <Outlet />
      </jokesContext.Provider>
    </div>
  )
}

export const jokesContext = React.createContext<{ pepe: string }>({} as any)
