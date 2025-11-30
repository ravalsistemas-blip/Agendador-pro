import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parse, addMinutes, startOfDay, isAfter, isBefore, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateTimeSlots(
  startTime: string,
  endTime: string,
  slotDuration: number,
  breakStart?: string,
  breakEnd?: string
): string[] {
  const slots: string[] = []
  const baseDate = startOfDay(new Date())
  
  let currentTime = parse(startTime, "HH:mm", baseDate)
  const end = parse(endTime, "HH:mm", baseDate)
  
  const breakStartTime = breakStart ? parse(breakStart, "HH:mm", baseDate) : null
  const breakEndTime = breakEnd ? parse(breakEnd, "HH:mm", baseDate) : null
  
  while (isBefore(currentTime, end)) {
    const timeString = format(currentTime, "HH:mm")
    
    const isInBreak = breakStartTime && breakEndTime && 
      !isBefore(currentTime, breakStartTime) && 
      isBefore(currentTime, breakEndTime)
    
    if (!isInBreak) {
      slots.push(timeString)
    }
    
    currentTime = addMinutes(currentTime, slotDuration)
  }
  
  return slots
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export function formatDateTime(dateTime: string): string {
  return format(parseISO(dateTime), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
}

export function formatDate(dateTime: string): string {
  return format(parseISO(dateTime), "dd/MM/yyyy", { locale: ptBR })
}

export function formatTime(dateTime: string): string {
  return format(parseISO(dateTime), "HH:mm", { locale: ptBR })
}

export function getDayName(date: Date): string {
  return format(date, "EEEE", { locale: ptBR })
}

export function isTimeSlotAvailable(
  dateTime: string,
  appointments: Array<{ dateTime: string; status: string }>,
  duration: number
): boolean {
  const slotStart = parseISO(dateTime)
  const slotEnd = addMinutes(slotStart, duration)
  
  return !appointments.some(apt => {
    if (apt.status === 'cancelled' || apt.status === 'no-show') return false
    
    const aptStart = parseISO(apt.dateTime)
    const aptEnd = addMinutes(aptStart, duration)
    
    return (
      (isAfter(slotStart, aptStart) && isBefore(slotStart, aptEnd)) ||
      (isAfter(slotEnd, aptStart) && isBefore(slotEnd, aptEnd)) ||
      (isBefore(slotStart, aptStart) && isAfter(slotEnd, aptEnd))
    )
  })
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'scheduled':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'confirmed':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'completed':
      return 'bg-gray-100 text-gray-800 border-gray-200'
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'no-show':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    scheduled: 'Agendado',
    confirmed: 'Confirmado',
    completed: 'Concluído',
    cancelled: 'Cancelado',
    'no-show': 'Faltou'
  }
  return labels[status] || status
}

export function shouldSendReminder(
  appointmentDateTime: string,
  reminderTime: number,
  reminderSent: boolean
): boolean {
  if (reminderSent) return false
  
  const now = new Date()
  const appointmentTime = parseISO(appointmentDateTime)
  const reminderThreshold = addMinutes(appointmentTime, -reminderTime)
  
  return isAfter(now, reminderThreshold) && isBefore(now, appointmentTime)
}
