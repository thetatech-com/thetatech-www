import { Users } from 'lucide-react'

const Groups = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <Users className="mb-4 h-24 w-24 text-primary" />
      <h1 className="mb-2 text-4xl font-bold">Groups</h1>
      <p className="text-lg text-muted-foreground">
        Connect with communities soon!
      </p>
    </div>
  )
}

export default Groups
