import { Appointment, Service, Professional, NotificationMessage } from './types'
import { formatDateTime } from './utils'
import { toast } from 'sonner'

export function sendConfirmationToClient(
  appointment: Appointment,
  service: Service,
  professional: Professional
): NotificationMessage {
  const message = `✅ Agendamento confirmado!\n\n${service.name}\nCom: ${professional.name}\n${formatDateTime(appointment.dateTime)}\n\nEm caso de imprevisto, entre em contato com antecedência.`
  
  toast.success('Agendamento confirmado!', {
    description: `${formatDateTime(appointment.dateTime)} - ${service.name}`
  })
  
  return {
    id: `notif-${Date.now()}-client`,
    type: 'confirmation',
    recipient: 'client',
    appointmentId: appointment.id,
    sentAt: new Date().toISOString(),
    message
  }
}

export function sendNotificationToProfessional(
  appointment: Appointment,
  service: Service
): NotificationMessage {
  const message = `🔔 Novo agendamento!\n\nCliente: ${appointment.clientName}\nServiço: ${service.name}\n${formatDateTime(appointment.dateTime)}\nTelefone: ${appointment.clientPhone}`
  
  toast.info('Novo agendamento recebido', {
    description: `${appointment.clientName} - ${formatDateTime(appointment.dateTime)}`
  })
  
  return {
    id: `notif-${Date.now()}-prof`,
    type: 'new-booking',
    recipient: 'professional',
    appointmentId: appointment.id,
    sentAt: new Date().toISOString(),
    message
  }
}

export function sendReminderToClient(
  appointment: Appointment,
  service: Service,
  professional: Professional
): NotificationMessage {
  const message = `⏰ Lembrete de agendamento!\n\n${service.name}\nCom: ${professional.name}\n${formatDateTime(appointment.dateTime)}\n\nSe não puder comparecer, por favor avise com antecedência.`
  
  toast('Lembrete enviado ao cliente', {
    description: `${appointment.clientName} - ${formatDateTime(appointment.dateTime)}`
  })
  
  return {
    id: `notif-${Date.now()}-reminder`,
    type: 'reminder',
    recipient: 'client',
    appointmentId: appointment.id,
    sentAt: new Date().toISOString(),
    message
  }
}

export function sendCancellationNotification(
  appointment: Appointment,
  service: Service,
  cancelledBy: 'client' | 'professional'
): NotificationMessage {
  const recipient = cancelledBy === 'client' ? 'professional' : 'client'
  const message = cancelledBy === 'client'
    ? `❌ Agendamento cancelado\n\nCliente: ${appointment.clientName}\nServiço: ${service.name}\n${formatDateTime(appointment.dateTime)}`
    : `❌ Agendamento cancelado pelo estabelecimento\n\n${service.name}\n${formatDateTime(appointment.dateTime)}\n\nEntre em contato para mais informações.`
  
  toast.error('Agendamento cancelado', {
    description: formatDateTime(appointment.dateTime)
  })
  
  return {
    id: `notif-${Date.now()}-cancel`,
    type: 'cancellation',
    recipient,
    appointmentId: appointment.id,
    sentAt: new Date().toISOString(),
    message
  }
}

export async function checkAndSendReminders(
  appointments: Appointment[],
  services: Service[],
  professionals: Professional[],
  reminderTime: number,
  onReminderSent: (appointmentId: string) => void
): Promise<void> {
  const now = new Date()
  
  for (const appointment of appointments) {
    if (
      appointment.reminderSent || 
      appointment.status !== 'scheduled' && appointment.status !== 'confirmed'
    ) {
      continue
    }
    
    const appointmentTime = new Date(appointment.dateTime)
    const timeDiff = (appointmentTime.getTime() - now.getTime()) / (1000 * 60)
    
    if (timeDiff <= reminderTime && timeDiff > 0) {
      const service = services.find(s => s.id === appointment.serviceId)
      const professional = professionals.find(p => p.id === appointment.professionalId)
      
      if (service && professional) {
        sendReminderToClient(appointment, service, professional)
        onReminderSent(appointment.id)
      }
    }
  }
}
