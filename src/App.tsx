import { useEffect, useState } from 'react'
import { useIdleTimer } from 'react-idle-timer'
import './styles.css'

const timeout = 10_000
const promptBeforeIdle = 4_000

export default function App() {
  const [state, setState] = useState<string>('Active')
  const [remaining, setRemaining] = useState<number>(timeout)
  const [open, setOpen] = useState<boolean>(false)

  const onIdle = () => {
    setState('Idle')
    setOpen(false)
  }

  const onActive = () => {
    setState('Active')
    setOpen(false)
  }

  const onPrompt = () => {
    setState('Prompted')
    setOpen(true)
  }

  const { getRemainingTime, activate } = useIdleTimer({
    onIdle,
    onActive,
    onPrompt,
    timeout,
    promptBeforeIdle,
    throttle: 500
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(Math.ceil(getRemainingTime() / 1000))
    }, 500)

    return () => {
      clearInterval(interval)
    }
  })

  const handleStillHere = () => {
    activate()
  }

  const timeTillPrompt = Math.max(remaining - promptBeforeIdle / 1000, 0)
  const seconds = timeTillPrompt > 1 ? 'seconds' : 'second'

  return (
    <>
      <h1>React Idle Timer</h1>
      <h2>Confirm Prompt</h2>
      <br />
      <p>Current State: {state}</p>
      {timeTillPrompt > 0 && (
        <p>
          {timeTillPrompt} {seconds} until prompt
        </p>
      )}
      <div
        className='modal'
        style={{
          display: open ? 'flex' : 'none'
        }}>
        <h3>Are you still here?</h3>
        <p>Logging out in {remaining} seconds</p>
        <button onClick={handleStillHere}>Im still here</button>
      </div>
    </>
  )
}
