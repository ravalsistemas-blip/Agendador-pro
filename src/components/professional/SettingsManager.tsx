import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { BusinessSettings, BusinessHours } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

export default function SettingsManager() {
  const [settings, setSettings] = useKV<BusinessSettings>('businessSettings', {
    businessName: 'Meu Negócio',
    slotDuration: 30,
    businessHours: {
      'segunda-feira': { enabled: true, start: '09:00', end: '18:00' },
      'terça-feira': { enabled: true, start: '09:00', end: '18:00' },
      'quarta-feira': { enabled: true, start: '09:00', end: '18:00' },
      'quinta-feira': { enabled: true, start: '09:00', end: '18:00' },
      'sexta-feira': { enabled: true, start: '09:00', end: '18:00' },
      'sábado': { enabled: false, start: '09:00', end: '13:00' },
      'domingo': { enabled: false, start: '09:00', end: '13:00' }
    },
    bookingAdvance: 30,
    reminderTime: 120
  })

  const [localSettings, setLocalSettings] = useState<BusinessSettings>(settings || {
    businessName: 'Meu Negócio',
    slotDuration: 30,
    businessHours: {
      'segunda-feira': { enabled: true, start: '09:00', end: '18:00' },
      'terça-feira': { enabled: true, start: '09:00', end: '18:00' },
      'quarta-feira': { enabled: true, start: '09:00', end: '18:00' },
      'quinta-feira': { enabled: true, start: '09:00', end: '18:00' },
      'sexta-feira': { enabled: true, start: '09:00', end: '18:00' },
      'sábado': { enabled: false, start: '09:00', end: '13:00' },
      'domingo': { enabled: false, start: '09:00', end: '13:00' }
    },
    bookingAdvance: 30,
    reminderTime: 120
  })

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings)
    }
  }, [settings])

  const handleSave = () => {
    setSettings(localSettings)
    toast.success('Configurações salvas com sucesso!')
  }

  const updateBusinessHours = (day: string, field: keyof BusinessHours[string], value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value
        }
      }
    }))
  }

  const weekDays = [
    'segunda-feira',
    'terça-feira',
    'quarta-feira',
    'quinta-feira',
    'sexta-feira',
    'sábado',
    'domingo'
  ]

  const dayLabels: Record<string, string> = {
    'segunda-feira': 'Segunda-feira',
    'terça-feira': 'Terça-feira',
    'quarta-feira': 'Quarta-feira',
    'quinta-feira': 'Quinta-feira',
    'sexta-feira': 'Sexta-feira',
    'sábado': 'Sábado',
    'domingo': 'Domingo'
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h3 className="text-2xl font-semibold">Configurações</h3>
        <p className="text-sm text-muted-foreground">
          Configure o funcionamento do seu negócio
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações Gerais</CardTitle>
          <CardDescription>
            Dados básicos do estabelecimento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="business-name">Nome do Negócio</Label>
            <Input
              id="business-name"
              value={localSettings.businessName}
              onChange={(e) => setLocalSettings({ ...localSettings, businessName: e.target.value })}
              placeholder="Ex: Barbearia do João"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="slot-duration">Duração do Slot (minutos)</Label>
              <Input
                id="slot-duration"
                type="number"
                value={localSettings.slotDuration}
                onChange={(e) => setLocalSettings({ ...localSettings, slotDuration: parseInt(e.target.value) || 30 })}
                min="5"
                step="5"
              />
              <p className="text-xs text-muted-foreground">
                Intervalo entre horários disponíveis
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reminder-time">Lembrete (minutos antes)</Label>
              <Input
                id="reminder-time"
                type="number"
                value={localSettings.reminderTime}
                onChange={(e) => setLocalSettings({ ...localSettings, reminderTime: parseInt(e.target.value) || 120 })}
                min="30"
                step="30"
              />
              <p className="text-xs text-muted-foreground">
                Quando enviar lembrete ao cliente
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Horários de Funcionamento</CardTitle>
          <CardDescription>
            Defina quando o negócio está aberto para agendamentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weekDays.map(day => {
              const daySettings = localSettings.businessHours[day] || { enabled: false, start: '09:00', end: '18:00' }
              return (
                <div key={day} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`${day}-enabled`} className="text-base font-medium">
                      {dayLabels[day]}
                    </Label>
                    <Switch
                      id={`${day}-enabled`}
                      checked={daySettings.enabled}
                      onCheckedChange={(checked) => updateBusinessHours(day, 'enabled', checked)}
                    />
                  </div>

                  {daySettings.enabled && (
                    <div className="ml-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor={`${day}-start`} className="text-xs text-muted-foreground">
                          Abertura
                        </Label>
                        <Input
                          id={`${day}-start`}
                          type="time"
                          value={daySettings.start}
                          onChange={(e) => updateBusinessHours(day, 'start', e.target.value)}
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor={`${day}-end`} className="text-xs text-muted-foreground">
                          Fechamento
                        </Label>
                        <Input
                          id={`${day}-end`}
                          type="time"
                          value={daySettings.end}
                          onChange={(e) => updateBusinessHours(day, 'end', e.target.value)}
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor={`${day}-break-start`} className="text-xs text-muted-foreground">
                          Início Pausa
                        </Label>
                        <Input
                          id={`${day}-break-start`}
                          type="time"
                          value={daySettings.breakStart || ''}
                          onChange={(e) => updateBusinessHours(day, 'breakStart', e.target.value || undefined)}
                          placeholder="--:--"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor={`${day}-break-end`} className="text-xs text-muted-foreground">
                          Fim Pausa
                        </Label>
                        <Input
                          id={`${day}-break-end`}
                          type="time"
                          value={daySettings.breakEnd || ''}
                          onChange={(e) => updateBusinessHours(day, 'breakEnd', e.target.value || undefined)}
                          placeholder="--:--"
                        />
                      </div>
                    </div>
                  )}

                  <Separator />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          Salvar Configurações
        </Button>
      </div>
    </div>
  )
}
