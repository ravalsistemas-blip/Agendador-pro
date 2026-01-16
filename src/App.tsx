import { useState, useEffect } from 'react'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { User, CalendarDots, SignOut } from '@phosphor-icons/react'
import { ProfessionalAccount, ClientAccount, ProfessionalCategory } from '@/lib/types'
import { generateId } from '@/lib/utils'
import { toast } from 'sonner'
import ProfessionalPanel from './components/ProfessionalPanel'
import ClientPanel from './components/ClientPanel'
import ProfessionalLogin from './components/auth/ProfessionalLogin'
import ProfessionalRegister from './components/auth/ProfessionalRegister'
import ClientRegister from './components/auth/ClientRegister'

function App() {
  const [view, setView] = useState<'client' | 'professional'>('client')
  const [professionalAccounts, setProfessionalAccounts] = useLocalStorage<ProfessionalAccount[]>('professionalAccounts', [])
  const [clientAccounts, setClientAccounts] = useLocalStorage<ClientAccount[]>('clientAccounts', [])
  const [currentProfessional, setCurrentProfessional] = useLocalStorage<string | null>('currentProfessional', null)
  const [currentClient, setCurrentClient] = useLocalStorage<string | null>('currentClient', null)
  const [professionalAuthView, setProfessionalAuthView] = useState<'login' | 'register'>('login')
  const [showClientRegister, setShowClientRegister] = useState(false)
  const [loginError, setLoginError] = useState('')

  const loggedInProfessional = professionalAccounts?.find(acc => acc.id === currentProfessional)
  const loggedInClient = clientAccounts?.find(acc => acc.id === currentClient)

  useEffect(() => {
    if (view === 'client' && !loggedInClient && !showClientRegister) {
      const timer = setTimeout(() => {
        setShowClientRegister(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [view, loggedInClient, showClientRegister])

  const handleProfessionalRegister = (data: {
    email: string
    password: string
    businessName: string
    category: ProfessionalCategory
    ownerName: string
    phone: string
  }) => {
    if (professionalAccounts?.some(acc => acc.email === data.email)) {
      toast.error('Este e-mail já está cadastrado')
      return
    }

    const newAccount: ProfessionalAccount = {
      id: generateId(),
      email: data.email,
      password: data.password,
      businessName: data.businessName,
      category: data.category,
      ownerName: data.ownerName,
      phone: data.phone,
      createdAt: new Date().toISOString()
    }

    setProfessionalAccounts((current) => [...(current || []), newAccount])
    setCurrentProfessional(newAccount.id)
    toast.success('Conta criada com sucesso!')
  }

  const handleProfessionalLogin = (email: string, password: string) => {
    const account = professionalAccounts?.find(
      acc => acc.email === email && acc.password === password
    )

    if (account) {
      setCurrentProfessional(account.id)
      setLoginError('')
      toast.success(`Bem-vindo de volta, ${account.ownerName}!`)
    } else {
      setLoginError('E-mail ou senha incorretos')
    }
  }

  const handleProfessionalLogout = () => {
    setCurrentProfessional(null)
    toast.success('Você saiu da sua conta')
  }

  const handleClientRegister = (data: {
    firstName: string
    lastName: string
    phone: string
    cpf?: string
  }) => {
    const newAccount: ClientAccount = {
      id: generateId(),
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      cpf: data.cpf,
      createdAt: new Date().toISOString()
    }

    setClientAccounts((current) => [...(current || []), newAccount])
    setCurrentClient(newAccount.id)
    setShowClientRegister(false)
    toast.success('Dados salvos com sucesso!')
  }

  const handleClientSkipRegister = () => {
    setShowClientRegister(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <CalendarDots size={24} weight="bold" className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  AgendaFácil
                </h1>
                <p className="text-xs text-muted-foreground">
                  Sistema de agendamento profissional
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {view === 'professional' && loggedInProfessional && (
                <div className="hidden sm:flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Olá,</span>
                  <span className="font-medium">{loggedInProfessional.ownerName}</span>
                </div>
              )}
              
              <Tabs value={view} onValueChange={(v) => setView(v as 'client' | 'professional')} className="w-auto">
                <TabsList>
                  <TabsTrigger value="client" className="gap-2">
                    <User size={16} weight="bold" />
                    <span className="hidden sm:inline">Cliente</span>
                  </TabsTrigger>
                  <TabsTrigger value="professional" className="gap-2">
                    <CalendarDots size={16} weight="bold" />
                    <span className="hidden sm:inline">Profissional</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {view === 'professional' && loggedInProfessional && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleProfessionalLogout}
                  className="gap-2"
                >
                  <SignOut size={16} weight="bold" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        {view === 'client' ? (
          showClientRegister && !loggedInClient ? (
            <div className="container mx-auto px-4 py-12">
              <ClientRegister
                onRegister={handleClientRegister}
                onSkip={handleClientSkipRegister}
              />
            </div>
          ) : (
            <ClientPanel clientAccount={loggedInClient} />
          )
        ) : (
          loggedInProfessional ? (
            <ProfessionalPanel professionalAccount={loggedInProfessional} />
          ) : (
            <div className="container mx-auto px-4 py-12">
              {professionalAuthView === 'login' ? (
                <ProfessionalLogin
                  onLogin={handleProfessionalLogin}
                  onSwitchToRegister={() => {
                    setProfessionalAuthView('register')
                    setLoginError('')
                  }}
                  error={loginError}
                />
              ) : (
                <ProfessionalRegister
                  onRegister={handleProfessionalRegister}
                  onSwitchToLogin={() => setProfessionalAuthView('login')}
                />
              )}
            </div>
          )
        )}
      </main>
    </div>
  )
}

export default App
