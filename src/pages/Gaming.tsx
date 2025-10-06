import { Gamepad2 } from 'lucide-react'

const Gaming = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <Gamepad2 className="mb-4 h-24 w-24 text-primary" />
      <h1 className="mb-2 text-4xl font-bold">Gaming</h1>
      <p className="text-lg text-muted-foreground">
        Gaming content coming soon!
      </p>
    </div>
  )
}

export default Gaming
