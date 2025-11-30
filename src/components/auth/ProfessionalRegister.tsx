import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Eye, EyeSlash, Storefront } from '@phosphor-icons/react'
import { ProfessionalCategory } from '@/lib/types'
import { generateId } from '@/lib/utils'

const PROFESSIONAL_CATEGORIES: { value: ProfessionalCategory; label: string; group: string }[] = [
  { value: 'Cabeleireiro', label: 'Cabeleireiro', group: 'Beleza / Estética' },
  { value: 'Barbearia', label: 'Barbearia', group: 'Beleza / Estética' },
  { value: 'Manicure/pedicure', label: 'Manicure/pedicure', group: 'Beleza / Estética' },
  { value: 'Designer de sobrancelhas', label: 'Designer de sobrancelhas', group: 'Beleza / Estética' },
  { value: 'Depilação', label: 'Depilação', group: 'Beleza / Estética' },
  { value: 'Clínicas de estética', label: 'Clínicas de estética (botox, limpeza de pele etc.)', group: 'Beleza / Estética' },
  { value: 'Psicólogo', label: 'Psicólogo', group: 'Saúde / Bem-estar' },
  { value: 'Nutricionista', label: 'Nutricionista', group: 'Saúde / Bem-estar' },
  { value: 'Fisioterapeuta', label: 'Fisioterapeuta', group: 'Saúde / Bem-estar' },
  { value: 'Personal trainer', label: 'Personal trainer', group: 'Saúde / Bem-estar' },
  { value: 'Fonoaudiólogo', label: 'Fonoaudiólogo', group: 'Saúde / Bem-estar' },
  { value: 'Quiropraxista', label: 'Quiropraxista', group: 'Saúde / Bem-estar' },
  { value: 'Médico', label: 'Médicos em geral (clínica, consultório pequeno)', group: 'Saúde / Bem-estar' },
  { value: 'Banho e tosa', label: 'Banho e tosa', group: 'Pet / Automotivo' },
  { value: 'Veterinário', label: 'Veterinário', group: 'Pet / Automotivo' },
  { value: 'Mecânico', label: 'Mecânico', group: 'Pet / Automotivo' },
  { value: 'Lava-rápido / estética automotiva', label: 'Lava-rápido / estética automotiva', group: 'Pet / Automotivo' },
  { value: 'Advogado', label: 'Advogado', group: 'Serviços Profissionais' },
  { value: 'Contador', label: 'Contador', group: 'Serviços Profissionais' },
  { value: 'Consultor de negócios', label: 'Consultor de negócios', group: 'Serviços Profissionais' },
  { value: 'Coach / mentor', label: 'Coach / mentor', group: 'Serviços Profissionais' },
  { value: 'Fotógrafo / filmagem', label: 'Fotógrafo / filmagem (sessões, ensaios)', group: 'Serviços Profissionais' },
  { value: 'Professor particular', label: 'Professor particular', group: 'Educação' },
  { value: 'Escola de idiomas', label: 'Escola de idiomas (aulas particulares)', group: 'Educação' },
  { value: 'Aulas de música / dança / instrumentos', label: 'Aulas de música / dança / instrumentos', group: 'Educação' },
]

const CATEGORY_GROUPS = [
  'Beleza / Estética',
  'Saúde / Bem-estar',
  'Pet / Automotivo',
  'Serviços Profissionais',
  'Educação'
]

type ProfessionalRegisterProps = {
  onRegister: (data: {
    email: string
    password: string
    businessName: string
    category: ProfessionalCategory
    ownerName: string
    phone: string
  }) => void
  onSwitchToLogin: () => void
}

export default function ProfessionalRegister({ onRegister, onSwitchToLogin }: ProfessionalRegisterProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [category, setCategory] = useState<ProfessionalCategory | ''>('')
  const [ownerName, setOwnerName] = useState('')
  const [phone, setPhone] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!email) newErrors.email = 'E-mail é obrigatório'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'E-mail inválido'

    if (!password) newErrors.password = 'Senha é obrigatória'
    else if (password.length < 6) newErrors.password = 'Senha deve ter no mínimo 6 caracteres'

    if (!confirmPassword) newErrors.confirmPassword = 'Confirme sua senha'
    else if (password !== confirmPassword) newErrors.confirmPassword = 'As senhas não coincidem'

    if (!businessName) newErrors.businessName = 'Nome do negócio é obrigatório'
    if (!category) newErrors.category = 'Selecione uma categoria'
    if (!ownerName) newErrors.ownerName = 'Seu nome é obrigatório'
    if (!phone) newErrors.phone = 'Telefone é obrigatório'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onRegister({
        email,
        password,
        businessName,
        category: category as ProfessionalCategory,
        ownerName,
        phone
      })
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Storefront size={32} weight="bold" className="text-primary" />
        </div>
        <CardTitle className="text-2xl">Cadastro de Profissional</CardTitle>
        <CardDescription>
          Crie sua conta para gerenciar seus agendamentos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="owner-name">Seu nome completo *</Label>
              <Input
                id="owner-name"
                placeholder="João Silva"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
              />
              {errors.ownerName && <p className="text-sm text-destructive">{errors.ownerName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone/WhatsApp *</Label>
              <Input
                id="phone"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="business-name">Nome do seu negócio *</Label>
            <Input
              id="business-name"
              placeholder="Salão Beleza & Arte"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
            {errors.businessName && <p className="text-sm text-destructive">{errors.businessName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria profissional *</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as ProfessionalCategory)}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Selecione sua área de atuação" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_GROUPS.map(group => (
                  <div key={group}>
                    <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                      {group}
                    </div>
                    {PROFESSIONAL_CATEGORIES.filter(cat => cat.group === group).map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="password">Senha *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar senha *</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Digite a senha novamente"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Criar conta
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Já tem uma conta? </span>
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-primary hover:underline font-medium"
            >
              Fazer login
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
