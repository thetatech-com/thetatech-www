import { Flag } from 'lucide-react'

const Pages = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <Flag className="mb-4 h-24 w-24 text-primary" />
      <h1 className="mb-2 text-4xl font-bold">Pages</h1>
      <p className="text-lg text-muted-foreground">
        Follow your favorite pages soon!
      </p>
    </div>
  )
}

export default Pages
