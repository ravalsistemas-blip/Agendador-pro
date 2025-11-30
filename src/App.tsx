import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, CalendarDots } from '@phosphor-icons/react'
import ProfessionalPanel from './components/ProfessionalPanel'
import ClientPanel from './components/ClientPanel'

function App() {
  const [view, setView] = useState<'client' | 'professional'>('client')

  return (
    <div className="min-h-screen bg-background">
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
          </div>
        </div>
      </header>

      <main>
        {view === 'client' ? <ClientPanel /> : <ProfessionalPanel />}
      </main>
    </div>
  )
}

export default App
