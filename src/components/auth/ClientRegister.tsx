import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserPlus } from '@phosphor-icons/react'

type ClientRegisterProps = {
  onRegister: (data: {
    firstName: string
    lastName: string
    phone: string
    cpf?: string
  }) => void
  onSkip: () => void
}

export default function ClientRegister({ onRegister, onSkip }: ClientRegisterProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [cpf, setCpf] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!firstName.trim()) newErrors.firstName = 'Nome é obrigatório'
    if (!lastName.trim()) newErrors.lastName = 'Sobrenome é obrigatório'
    if (!phone.trim()) newErrors.phone = 'WhatsApp é obrigatório'

    if (cpf && cpf.trim()) {
      const cleanCpf = cpf.replace(/\D/g, '')
      if (cleanCpf.length !== 11) {
        newErrors.cpf = 'CPF deve ter 11 dígitos'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onRegister({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        cpf: cpf.trim() || undefined
      })
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
          <UserPlus size={32} weight="bold" className="text-accent-foreground" />
        </div>
        <CardTitle className="text-2xl">Seus Dados</CardTitle>
        <CardDescription>
          Precisamos de algumas informações para o agendamento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="first-name">Nome *</Label>
              <Input
                id="first-name"
                placeholder="João"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="last-name">Sobrenome *</Label>
              <Input
                id="last-name"
                placeholder="Silva"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">WhatsApp *</Label>
            <Input
              id="phone"
              placeholder="(00) 00000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpf">CPF (opcional)</Label>
            <Input
              id="cpf"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '')
                if (value.length <= 11) {
                  setCpf(value)
                }
              }}
            />
            {errors.cpf && <p className="text-sm text-destructive">{errors.cpf}</p>}
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onSkip}
            >
              Pular
            </Button>
            <Button type="submit" className="flex-1">
              Continuar
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Seus dados serão salvos para facilitar futuros agendamentos
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
