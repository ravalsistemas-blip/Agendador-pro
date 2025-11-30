import { useMemo } from 'react'
import { Appointment, Service, Professional } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { ChartLine, Users, Clock, TrendUp, Warning } from '@phosphor-icons/react'
import { formatCurrency } from '@/lib/utils'
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns'

type ReportsViewProps = {
  appointments: Appointment[]
  services: Service[]
  professionals: Professional[]
}

export default function ReportsView({
  appointments,
  services,
  professionals
}: ReportsViewProps) {
  const stats = useMemo(() => {
    const now = new Date()
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)

    const thisMonthAppointments = appointments.filter(apt => {
      const aptDate = parseISO(apt.dateTime)
      return isWithinInterval(aptDate, { start: monthStart, end: monthEnd })
    })

    const total = thisMonthAppointments.length
    const completed = thisMonthAppointments.filter(a => a.status === 'completed').length
    const cancelled = thisMonthAppointments.filter(a => a.status === 'cancelled').length
    const noShow = thisMonthAppointments.filter(a => a.status === 'no-show').length
    const scheduled = thisMonthAppointments.filter(a => a.status === 'scheduled' || a.status === 'confirmed').length

    const completionRate = total > 0 ? (completed / total) * 100 : 0
    const noShowRate = total > 0 ? (noShow / total) * 100 : 0

    const revenue = thisMonthAppointments
      .filter(a => a.status === 'completed')
      .reduce((sum, apt) => {
        const service = services.find(s => s.id === apt.serviceId)
        return sum + (service?.price || 0)
      }, 0)

    const serviceStats = services.map(service => {
      const serviceAppointments = thisMonthAppointments.filter(a => a.serviceId === service.id)
      const count = serviceAppointments.length
      const completedCount = serviceAppointments.filter(a => a.status === 'completed').length
      const revenue = completedCount * service.price

      return {
        service,
        count,
        completedCount,
        revenue
      }
    }).sort((a, b) => b.count - a.count)

    const professionalStats = professionals.map(professional => {
      const profAppointments = thisMonthAppointments.filter(a => a.professionalId === professional.id)
      const count = profAppointments.length
      const completedCount = profAppointments.filter(a => a.status === 'completed').length
      const noShowCount = profAppointments.filter(a => a.status === 'no-show').length

      return {
        professional,
        count,
        completedCount,
        noShowCount,
        noShowRate: count > 0 ? (noShowCount / count) * 100 : 0
      }
    }).sort((a, b) => b.count - a.count)

    const topClients = Object.values(
      thisMonthAppointments.reduce((acc, apt) => {
        if (!acc[apt.clientName]) {
          acc[apt.clientName] = {
            name: apt.clientName,
            phone: apt.clientPhone,
            count: 0,
            completed: 0
          }
        }
        acc[apt.clientName].count++
        if (apt.status === 'completed') {
          acc[apt.clientName].completed++
        }
        return acc
      }, {} as Record<string, { name: string; phone: string; count: number; completed: number }>)
    ).sort((a, b) => b.count - a.count).slice(0, 10)

    return {
      total,
      completed,
      cancelled,
      noShow,
      scheduled,
      completionRate,
      noShowRate,
      revenue,
      serviceStats,
      professionalStats,
      topClients
    }
  }, [appointments, services, professionals])

  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <ChartLine size={64} className="text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">Sem dados para exibir</p>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Os relatórios aparecerão aqui quando houver agendamentos registrados.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold">Relatórios do Mês</h3>
        <p className="text-sm text-muted-foreground">
          Análise de desempenho e estatísticas
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ChartLine size={16} />
              Total de Agendamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.scheduled} pendentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendUp size={16} />
              Receita Gerada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(stats.revenue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.completed} serviços concluídos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock size={16} />
              Taxa de Conclusão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {stats.completionRate.toFixed(0)}%
            </div>
            <Progress value={stats.completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Warning size={16} />
              Taxa de Faltas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {stats.noShowRate.toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.noShow} faltas no mês
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Serviços Mais Populares</CardTitle>
            <CardDescription>Ranking de serviços por demanda</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.serviceStats.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhum serviço cadastrado
              </p>
            ) : (
              <div className="space-y-4">
                {stats.serviceStats.map((item, index) => (
                  <div key={item.service.id}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          #{index + 1}
                        </Badge>
                        <span className="font-medium">{item.service.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {item.count} agendamentos
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.completedCount} concluídos
                      </span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(item.revenue)}
                      </span>
                    </div>
                    {index < stats.serviceStats.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users size={20} />
              Desempenho da Equipe
            </CardTitle>
            <CardDescription>Estatísticas por profissional</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.professionalStats.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhum profissional cadastrado
              </p>
            ) : (
              <div className="space-y-4">
                {stats.professionalStats.map((item) => (
                  <div key={item.professional.id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{item.professional.name}</span>
                      <Badge variant="secondary">{item.count} agendamentos</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Concluídos: </span>
                        <span className="font-medium text-green-600">{item.completedCount}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Faltas: </span>
                        <span className="font-medium text-orange-600">
                          {item.noShowCount} ({item.noShowRate.toFixed(0)}%)
                        </span>
                      </div>
                    </div>
                    {stats.professionalStats.indexOf(item) < stats.professionalStats.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Clientes Mais Frequentes</CardTitle>
          <CardDescription>Top 10 clientes do mês</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.topClients.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhum cliente cadastrado ainda
            </p>
          ) : (
            <div className="space-y-3">
              {stats.topClients.map((client, index) => (
                <div key={client.phone} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-mono text-xs w-8 justify-center">
                      {index + 1}
                    </Badge>
                    <div>
                      <div className="font-medium">{client.name}</div>
                      <div className="text-xs text-muted-foreground">{client.phone}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{client.count} visitas</div>
                    <div className="text-xs text-muted-foreground">
                      {client.completed} concluídas
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
