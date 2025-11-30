import { useState, useMemo } from 'react'
import { Appointment, Service, Professional, AppointmentStatus } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Calendar } from '@/components/ui/calendar'
import { CalendarDots, User, Clock, Phone, Envelope, CheckCircle, XCircle, Warning } from '@phosphor-icons/react'
import { formatDateTime, formatDate, formatTime, getStatusColor, getStatusLabel, formatCurrency } from '@/lib/utils'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type AgendaViewProps = {
  appointments: Appointment[]
  services: Service[]
  professionals: Professional[]
  onStatusChange: (id: string, status: AppointmentStatus) => void
  onDelete: (id: string) => void
}

export default function AgendaView({
  appointments,
  services,
  professionals,
  onStatusChange,
  onDelete
}: AgendaViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [filterProfessional, setFilterProfessional] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day')

  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const aptDate = parseISO(apt.dateTime)
      
      let dateMatch = false
      if (viewMode === 'day') {
        dateMatch = isSameDay(aptDate, selectedDate)
      } else {
        const weekStart = startOfWeek(selectedDate, { locale: ptBR })
        const weekEnd = endOfWeek(selectedDate, { locale: ptBR })
        dateMatch = aptDate >= weekStart && aptDate <= weekEnd
      }

      const professionalMatch = filterProfessional === 'all' || apt.professionalId === filterProfessional
      const statusMatch = filterStatus === 'all' || apt.status === filterStatus

      return dateMatch && professionalMatch && statusMatch
    }).sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
  }, [appointments, selectedDate, viewMode, filterProfessional, filterStatus])

  const weekDays = useMemo(() => {
    if (viewMode !== 'week') return []
    const start = startOfWeek(selectedDate, { locale: ptBR })
    const end = endOfWeek(selectedDate, { locale: ptBR })
    return eachDayOfInterval({ start, end })
  }, [selectedDate, viewMode])

  const getAppointmentDetails = (apt: Appointment) => {
    const service = services.find(s => s.id === apt.serviceId)
    const professional = professionals.find(p => p.id === apt.professionalId)
    return { service, professional }
  }

  const stats = useMemo(() => {
    const total = filteredAppointments.length
    const scheduled = filteredAppointments.filter(a => a.status === 'scheduled').length
    const confirmed = filteredAppointments.filter(a => a.status === 'confirmed').length
    const completed = filteredAppointments.filter(a => a.status === 'completed').length
    const cancelled = filteredAppointments.filter(a => a.status === 'cancelled').length
    const noShow = filteredAppointments.filter(a => a.status === 'no-show').length

    return { total, scheduled, confirmed, completed, cancelled, noShow }
  }, [filteredAppointments])

  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CalendarDots size={64} className="text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">Nenhum agendamento ainda</p>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Os agendamentos feitos pelos clientes aparecerão aqui.
            Certifique-se de cadastrar serviços e profissionais primeiro.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Agendados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.scheduled + stats.confirmed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Concluídos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Faltas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.noShow}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Selecione a Data</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                locale={ptBR}
                className="rounded-md border-0"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Filtros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Visualização</label>
                <Select value={viewMode} onValueChange={(v) => setViewMode(v as 'day' | 'week')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Dia</SelectItem>
                    <SelectItem value="week">Semana</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {professionals.length > 1 && (
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Profissional</label>
                  <Select value={filterProfessional} onValueChange={setFilterProfessional}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {professionals.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="scheduled">Agendado</SelectItem>
                    <SelectItem value="confirmed">Confirmado</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                    <SelectItem value="no-show">Faltou</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {viewMode === 'day' 
                    ? format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                    : `Semana de ${format(weekDays[0], 'dd/MM', { locale: ptBR })} a ${format(weekDays[6], 'dd/MM', { locale: ptBR })}`
                  }
                </CardTitle>
                <CardDescription>
                  {filteredAppointments.length} agendamento{filteredAppointments.length !== 1 ? 's' : ''}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredAppointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CalendarDots size={48} className="text-muted-foreground mb-3" />
                <p className="text-muted-foreground">
                  Nenhum agendamento para {viewMode === 'day' ? 'este dia' : 'esta semana'}
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-3">
                  {filteredAppointments.map(apt => {
                    const { service, professional } = getAppointmentDetails(apt)
                    return (
                      <Card
                        key={apt.id}
                        className="cursor-pointer transition-all hover:shadow-md"
                        onClick={() => setSelectedAppointment(apt)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">{apt.clientName}</h4>
                                <Badge className={getStatusColor(apt.status)} variant="outline">
                                  {getStatusLabel(apt.status)}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{service?.name}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Clock size={14} />
                              <span>{formatTime(apt.dateTime)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <User size={14} />
                              <span className="truncate">{professional?.name}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
        <DialogContent className="sm:max-w-lg">
          {selectedAppointment && (() => {
            const { service, professional } = getAppointmentDetails(selectedAppointment)
            return (
              <>
                <DialogHeader>
                  <DialogTitle>Detalhes do Agendamento</DialogTitle>
                  <DialogDescription>
                    Gerencie este agendamento
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status</span>
                      <Badge className={getStatusColor(selectedAppointment.status)} variant="outline">
                        {getStatusLabel(selectedAppointment.status)}
                      </Badge>
                    </div>

                    <Separator />

                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Data e Horário</div>
                      <div className="text-lg font-semibold text-primary">
                        {formatDateTime(selectedAppointment.dateTime)}
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Serviço</div>
                        <div className="font-medium">{service?.name}</div>
                        <div className="text-sm text-muted-foreground">{service?.duration} min</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Valor</div>
                        <div className="font-medium">{service && formatCurrency(service.price)}</div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Profissional</div>
                      <div className="font-medium">{professional?.name}</div>
                      {professional?.specialty && (
                        <div className="text-sm text-muted-foreground">{professional.specialty}</div>
                      )}
                    </div>

                    <Separator />

                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Cliente</div>
                      <div className="font-medium">{selectedAppointment.clientName}</div>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                        <Phone size={14} />
                        {selectedAppointment.clientPhone}
                      </div>
                      {selectedAppointment.clientEmail && (
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                          <Envelope size={14} />
                          {selectedAppointment.clientEmail}
                        </div>
                      )}
                    </div>

                    {selectedAppointment.notes && (
                      <>
                        <Separator />
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Observações</div>
                          <div className="text-sm">{selectedAppointment.notes}</div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium mb-2">Ações</div>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedAppointment.status === 'scheduled' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2"
                          onClick={() => {
                            onStatusChange(selectedAppointment.id, 'confirmed')
                            setSelectedAppointment(null)
                          }}
                        >
                          <CheckCircle size={16} />
                          Confirmar
                        </Button>
                      )}

                      {(selectedAppointment.status === 'scheduled' || selectedAppointment.status === 'confirmed') && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => {
                              onStatusChange(selectedAppointment.id, 'completed')
                              setSelectedAppointment(null)
                            }}
                          >
                            <CheckCircle size={16} weight="fill" />
                            Concluir
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => {
                              onStatusChange(selectedAppointment.id, 'no-show')
                              setSelectedAppointment(null)
                            }}
                          >
                            <Warning size={16} weight="fill" />
                            Marcar Falta
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2 text-destructive hover:text-destructive"
                            onClick={() => {
                              onStatusChange(selectedAppointment.id, 'cancelled')
                              setSelectedAppointment(null)
                            }}
                          >
                            <XCircle size={16} />
                            Cancelar
                          </Button>
                        </>
                      )}

                      {selectedAppointment.status !== 'scheduled' && selectedAppointment.status !== 'confirmed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="col-span-2 gap-2 text-destructive hover:text-destructive"
                          onClick={() => {
                            onDelete(selectedAppointment.id)
                            setSelectedAppointment(null)
                          }}
                        >
                          <XCircle size={16} weight="fill" />
                          Excluir Agendamento
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
