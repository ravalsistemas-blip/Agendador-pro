import { useState, useEffect } from 'react'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { Service, Professional, Appointment, BusinessSettings, AppointmentStatus, ProfessionalAccount } from '@/lib/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CalendarDots, Users, Gear, ChartLine } from '@phosphor-icons/react'
import ServicesManager from './professional/ServicesManager'
import ProfessionalsManager from './professional/ProfessionalsManager'
import AgendaView from './professional/AgendaView'
import SettingsManager from './professional/SettingsManager'
import ReportsView from './professional/ReportsView'
import { checkAndSendReminders } from '@/lib/notifications'

type ProfessionalPanelProps = {
  professionalAccount: ProfessionalAccount
}

export default function ProfessionalPanel({ professionalAccount }: ProfessionalPanelProps) {
  const [services] = useLocalStorage<Service[]>(`services_${professionalAccount.id}`, [])
  const [professionals] = useLocalStorage<Professional[]>(`professionals_${professionalAccount.id}`, [])
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>(`appointments_${professionalAccount.id}`, [])
  const [businessSettings, setBusinessSettings] = useLocalStorage<BusinessSettings>(`businessSettings_${professionalAccount.id}`, {
    businessName: professionalAccount.businessName,
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
    if (businessSettings && businessSettings.businessName !== professionalAccount.businessName) {
      setBusinessSettings((current) => ({
        ...(current || {
          slotDuration: 30,
          businessHours: {},
          bookingAdvance: 30,
          reminderTime: 120
        }),
        businessName: professionalAccount.businessName
      }))
    }
  }, [professionalAccount.businessName, businessSettings, setBusinessSettings])

  useEffect(() => {
    if (!appointments || !services || !professionals || !businessSettings) return

    const interval = setInterval(() => {
      checkAndSendReminders(
        appointments,
        services,
        professionals,
        businessSettings.reminderTime,
        (appointmentId) => {
          setAppointments((current) =>
            (current || []).map(apt =>
              apt.id === appointmentId ? { ...apt, reminderSent: true } : apt
            )
          )
        }
      )
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [appointments, services, professionals, businessSettings, setAppointments])

  const handleStatusChange = (appointmentId: string, newStatus: AppointmentStatus) => {
    setAppointments((current) =>
      (current || []).map(apt =>
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      )
    )
  }

  const handleDeleteAppointment = (appointmentId: string) => {
    setAppointments((current) =>
      (current || []).filter(apt => apt.id !== appointmentId)
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{professionalAccount.businessName}</h2>
            <p className="text-muted-foreground">{professionalAccount.category}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="agenda" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="agenda" className="gap-2">
            <CalendarDots size={16} weight="bold" />
            <span className="hidden sm:inline">Agenda</span>
          </TabsTrigger>
          <TabsTrigger value="services" className="gap-2">
            <Gear size={16} weight="bold" />
            <span className="hidden sm:inline">Serviços</span>
          </TabsTrigger>
          <TabsTrigger value="professionals" className="gap-2">
            <Users size={16} weight="bold" />
            <span className="hidden sm:inline">Equipe</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Gear size={16} weight="bold" />
            <span className="hidden sm:inline">Configurações</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2">
            <ChartLine size={16} weight="bold" />
            <span className="hidden sm:inline">Relatórios</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agenda" className="space-y-6">
          <AgendaView
            appointments={appointments || []}
            services={services || []}
            professionals={professionals || []}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteAppointment}
          />
        </TabsContent>

        <TabsContent value="services">
          <ServicesManager professionalId={professionalAccount.id} />
        </TabsContent>

        <TabsContent value="professionals">
          <ProfessionalsManager professionalId={professionalAccount.id} />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsManager professionalId={professionalAccount.id} />
        </TabsContent>

        <TabsContent value="reports">
          <ReportsView
            appointments={appointments || []}
            services={services || []}
            professionals={professionals || []}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
