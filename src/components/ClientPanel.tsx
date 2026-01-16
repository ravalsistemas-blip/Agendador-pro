import { useState, useMemo } from 'react'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { Service, Professional, Appointment, BusinessSettings, ClientAccount } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Clock, User, Phone, Envelope, CheckCircle } from '@phosphor-icons/react'
import { formatCurrency, generateTimeSlots, isTimeSlotAvailable, generateId, formatDateTime } from '@/lib/utils'
import { sendConfirmationToClient, sendNotificationToProfessional } from '@/lib/notifications'
import { format, parse, startOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type ClientPanelProps = {
  clientAccount?: ClientAccount
}

export default function ClientPanel({ clientAccount }: ClientPanelProps) {
  const [services] = useLocalStorage<Service[]>('services', [])
  const [professionals] = useLocalStorage<Professional[]>('professionals', [])
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>('appointments', [])
  const [businessSettings] = useLocalStorage<BusinessSettings>('businessSettings', {
    businessName: 'Meu Negócio',
    slotDuration: 30,
    businessHours: {},
    bookingAdvance: 30,
    reminderTime: 120
  })

  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [clientName, setClientName] = useState(
    clientAccount ? `${clientAccount.firstName} ${clientAccount.lastName}` : ''
  )
  const [clientPhone, setClientPhone] = useState(clientAccount?.phone || '')
  const [clientEmail, setClientEmail] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null)

  const availableTimeSlots = useMemo(() => {
    if (!selectedDate || !selectedProfessional || !businessSettings || !appointments) return []

    const dayName = format(selectedDate, 'EEEE', { locale: ptBR }).toLowerCase()
    const daySettings = businessSettings.businessHours[dayName]

    if (!daySettings || !daySettings.enabled) return []

    const allSlots = generateTimeSlots(
      daySettings.start,
      daySettings.end,
      businessSettings.slotDuration,
      daySettings.breakStart,
      daySettings.breakEnd
    )

    const dateString = format(selectedDate, 'yyyy-MM-dd')
    
    return allSlots.filter(timeSlot => {
      const dateTime = `${dateString}T${timeSlot}:00`
      return isTimeSlotAvailable(
        dateTime,
        appointments.filter(apt => apt.professionalId === selectedProfessional.id),
        selectedService?.duration || businessSettings.slotDuration
      )
    })
  }, [selectedDate, selectedProfessional, appointments, businessSettings, selectedService])

  const handleBooking = () => {
    if (!selectedService || !selectedProfessional || !selectedDate || !selectedTime || !clientName || !clientPhone) {
      return
    }

    const dateString = format(selectedDate, 'yyyy-MM-dd')
    const dateTime = `${dateString}T${selectedTime}:00`

    const newAppointment: Appointment = {
      id: generateId(),
      serviceId: selectedService.id,
      professionalId: selectedProfessional.id,
      clientName,
      clientPhone,
      clientEmail: clientEmail || undefined,
      dateTime,
      status: 'scheduled',
      confirmationSent: true,
      reminderSent: false,
      createdAt: new Date().toISOString()
    }

    setAppointments((current) => [...(current || []), newAppointment])

    sendConfirmationToClient(newAppointment, selectedService, selectedProfessional)
    sendNotificationToProfessional(newAppointment, selectedService)

    setConfirmedAppointment(newAppointment)
    setShowConfirmation(true)

    setSelectedService(null)
    setSelectedProfessional(null)
    setSelectedDate(undefined)
    setSelectedTime(null)
    setClientName('')
    setClientPhone('')
    setClientEmail('')
  }

  const resetForm = () => {
    setSelectedService(null)
    setSelectedProfessional(null)
    setSelectedDate(undefined)
    setSelectedTime(null)
  }

  if (!services || services.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Bem-vindo ao AgendaFácil</CardTitle>
            <CardDescription>
              O profissional ainda não configurou os serviços disponíveis.
              Por favor, volte mais tarde.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            {clientAccount ? `Olá, ${clientAccount.firstName}!` : 'Agendar Horário'}
          </h2>
          <p className="text-muted-foreground">
            Escolha o serviço, profissional e horário desejado
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">1. Escolha o Serviço</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-3">
                  {services.map(service => (
                    <Card
                      key={service.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedService?.id === service.id
                          ? 'border-primary ring-2 ring-primary ring-offset-2'
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => {
                        setSelectedService(service)
                        if (selectedService?.id !== service.id) {
                          setSelectedProfessional(null)
                          setSelectedDate(undefined)
                          setSelectedTime(null)
                        }
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{service.name}</h3>
                          <Badge variant="secondary">{formatCurrency(service.price)}</Badge>
                        </div>
                        {service.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {service.description}
                          </p>
                        )}
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock size={14} />
                          <span>{service.duration} min</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">2. Escolha o Profissional</CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedService ? (
                <p className="text-sm text-muted-foreground text-center py-12">
                  Selecione um serviço primeiro
                </p>
              ) : !professionals || professionals.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-12">
                  Nenhum profissional cadastrado
                </p>
              ) : (
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-3">
                    {professionals.map(professional => (
                      <Card
                        key={professional.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedProfessional?.id === professional.id
                            ? 'border-primary ring-2 ring-primary ring-offset-2'
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => {
                          setSelectedProfessional(professional)
                          if (selectedProfessional?.id !== professional.id) {
                            setSelectedDate(undefined)
                            setSelectedTime(null)
                          }
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                              <User size={24} className="text-primary" weight="bold" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{professional.name}</h3>
                              {professional.specialty && (
                                <p className="text-sm text-muted-foreground">
                                  {professional.specialty}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>

        {selectedService && selectedProfessional && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">3. Escolha a Data</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date)
                    setSelectedTime(null)
                  }}
                  disabled={(date) => date < startOfDay(new Date())}
                  locale={ptBR}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">4. Escolha o Horário</CardTitle>
                </CardHeader>
                <CardContent>
                  {availableTimeSlots.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-12">
                      Nenhum horário disponível para esta data
                    </p>
                  ) : (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {availableTimeSlots.map(timeSlot => (
                        <Button
                          key={timeSlot}
                          variant={selectedTime === timeSlot ? 'default' : 'outline'}
                          className="h-12"
                          onClick={() => setSelectedTime(timeSlot)}
                        >
                          {timeSlot}
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {selectedTime && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">5. Seus Dados</CardTitle>
                  {clientAccount && (
                    <p className="text-sm text-muted-foreground">
                      Seus dados já estão salvos
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="client-name">Nome completo *</Label>
                    <Input
                      id="client-name"
                      placeholder="Seu nome"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      disabled={!!clientAccount}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client-phone">Telefone/WhatsApp *</Label>
                    <Input
                      id="client-phone"
                      placeholder="(00) 00000-0000"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      disabled={!!clientAccount}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client-email">E-mail (opcional)</Label>
                    <Input
                      id="client-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                    />
                  </div>

                  <Separator />

                  <div className="rounded-lg bg-muted p-4 space-y-2">
                    <h3 className="font-semibold">Resumo do Agendamento</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>Serviço:</strong> {selectedService.name}</p>
                      <p><strong>Profissional:</strong> {selectedProfessional.name}</p>
                      <p><strong>Data:</strong> {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR }) : ''}</p>
                      <p><strong>Horário:</strong> {selectedTime}</p>
                      <p><strong>Duração:</strong> {selectedService.duration} minutos</p>
                      <p><strong>Valor:</strong> {formatCurrency(selectedService.price)}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={resetForm}
                    >
                      Cancelar
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleBooking}
                      disabled={!clientName || !clientPhone}
                    >
                      Confirmar Agendamento
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle size={40} weight="fill" className="text-green-600" />
            </div>
            <DialogTitle className="text-center text-xl">Agendamento Confirmado!</DialogTitle>
            <DialogDescription className="text-center">
              Seu horário foi agendado com sucesso
            </DialogDescription>
          </DialogHeader>
          {confirmedAppointment && (
            <div className="space-y-4">
              <div className="rounded-lg border bg-card p-4 space-y-2 text-sm">
                <p><strong>Data e Horário:</strong></p>
                <p className="text-lg font-semibold text-primary">
                  {formatDateTime(confirmedAppointment.dateTime)}
                </p>
                <Separator className="my-2" />
                <p><strong>Serviço:</strong> {services?.find(s => s.id === confirmedAppointment.serviceId)?.name}</p>
                <p><strong>Profissional:</strong> {professionals?.find(p => p.id === confirmedAppointment.professionalId)?.name}</p>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Você receberá um lembrete 2 horas antes do horário agendado.
              </p>
              <Button className="w-full" onClick={() => setShowConfirmation(false)}>
                Entendi
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
