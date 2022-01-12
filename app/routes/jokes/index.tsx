export default function JokesIndexRoute() {
  return (
    <div>
      <p>Here's a random joke:</p>
      <p>I was wondering why the frisbee was getting bigger, then it hit me.</p>
    </div>
  )
}

export function ErrorBoundary() {
  return <div className="error-container">I did a whoopsies.</div>
}
