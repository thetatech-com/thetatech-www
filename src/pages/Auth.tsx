import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Checkbox } from '@/components/ui/checkbox'

const Auth = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSeller, setIsSeller] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('signin')
  const [signInMethod, setSignInMethod] = useState('password')

  const { signInWithPassword, signUpWithEmail, user, loading, signInWithOtp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'

  useEffect(() => {
    if (user && !loading) {
      navigate(from, { replace: true })
    }
  }, [user, loading, navigate, from])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (signInMethod === 'password') {
      await signInWithPassword(email, password)
    } else {
      await signInWithOtp(email)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    await signUpWithEmail(email, password, isSeller)
  }

  if (loading && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="bg-gradient-to-r from-primary to-accent bg-clip-text text-2xl font-bold text-transparent">
              Welcome to tetha
            </CardTitle>
            <CardDescription>
              Sign in to your account or create a new one to get started
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6 grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <RadioGroup
                    value={signInMethod}
                    onValueChange={setSignInMethod}
                    className="mb-4 grid grid-cols-2 gap-4"
                  >
                    <Label
                      htmlFor="password-radio"
                      className={`flex items-center justify-center rounded-md border p-4 text-sm font-medium ${signInMethod === 'password' ? 'border-primary bg-primary/10' : 'border-border'}`}
                    >
                      <RadioGroupItem
                        value="password"
                        id="password-radio"
                        className="sr-only"
                      />
                      Sign in with Password
                    </Label>
                    <Label
                      htmlFor="magiclink-radio"
                      className={`flex items-center justify-center rounded-md border p-4 text-sm font-medium ${signInMethod === 'magiclink' ? 'border-primary bg-primary/10' : 'border-border'}`}
                    >
                      <RadioGroupItem
                        value="magiclink"
                        id="magiclink-radio"
                        className="sr-only"
                      />
                      Sign in with Magic Link
                    </Label>
                  </RadioGroup>

                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-background/50"
                    />
                  </div>

                  {signInMethod === 'password' && (
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-background/50"
                      />
                    </div>
                  )}

                  {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (signInMethod === 'password' ? 'Sign In' : 'Send Magic Link')}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="is-seller-signup" checked={isSeller} onCheckedChange={(checked) => setIsSeller(!!checked)} />
                      <Label htmlFor="is-seller-signup">Are you a seller?</Label>
                    </div>

                    {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
                    
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Account'}
                    </Button>
                  </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default Auth
