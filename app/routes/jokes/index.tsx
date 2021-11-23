import * as React from 'react'

export default function JokesIndexRoute() {
  React.useEffect(() => {
    document.write('<h1>Jokes Index</h1>')
  }, [])

  return (
    <div>
      <p>Here's a random joke:</p>
      <p>I was wondering why the frisbee was getting bigger, then it hit me.</p>
    </div>
  )
}
