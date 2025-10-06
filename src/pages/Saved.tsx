import { Bookmark } from 'lucide-react'

const Saved = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <Bookmark className="mb-4 h-24 w-24 text-primary" />
      <h1 className="mb-2 text-4xl font-bold">Saved</h1>
      <p className="text-lg text-muted-foreground">
        Your saved posts will appear here soon!
      </p>
    </div>
  )
}

export default Saved
