export type ProfessionalCategory = 
  | 'Cabeleireiro'
  | 'Barbearia'
  | 'Manicure/pedicure'
  | 'Designer de sobrancelhas'
  | 'Depilação'
  | 'Clínicas de estética'
  | 'Psicólogo'
  | 'Nutricionista'
  | 'Fisioterapeuta'
  | 'Personal trainer'
  | 'Fonoaudiólogo'
  | 'Quiropraxista'
  | 'Médico'
  | 'Banho e tosa'
  | 'Veterinário'
  | 'Mecânico'
  | 'Lava-rápido / estética automotiva'
  | 'Advogado'
  | 'Contador'
  | 'Consultor de negócios'
  | 'Coach / mentor'
  | 'Fotógrafo / filmagem'
  | 'Professor particular'
  | 'Escola de idiomas'
  | 'Aulas de música / dança / instrumentos'

export type ProfessionalAccount = {
  id: string
  email: string
  password: string
  businessName: string
  category: ProfessionalCategory
  ownerName: string
  phone: string
  createdAt: string
}

export type Professional = {
  id: string
  name: string
  specialty?: string
  avatar?: string
}

export type ClientAccount = {
  id: string
  firstName: string
  lastName: string
  phone: string
  cpf?: string
  createdAt: string
}

export type Service = {
  id: string
  name: string
  duration: number
  price: number
  description?: string
}

export type AppointmentStatus = 
  | 'scheduled'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'no-show'

export type Appointment = {
  id: string
  serviceId: string
  professionalId: string
  clientName: string
  clientPhone: string
  clientEmail?: string
  dateTime: string
  status: AppointmentStatus
  notes?: string
  confirmationSent: boolean
  reminderSent: boolean
  createdAt: string
}

export type BusinessHours = {
  [day: string]: {
    enabled: boolean
    start: string
    end: string
    breakStart?: string
    breakEnd?: string
  }
}

export type BusinessSettings = {
  businessName: string
  slotDuration: number
  businessHours: BusinessHours
  bookingAdvance: number
  reminderTime: number
}

export type NotificationMessage = {
  id: string
  type: 'confirmation' | 'reminder' | 'cancellation' | 'new-booking'
  recipient: 'client' | 'professional'
  appointmentId: string
  sentAt: string
  message: string
}
