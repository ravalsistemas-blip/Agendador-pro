import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Service } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Pencil, Trash, Clock } from '@phosphor-icons/react'
import { formatCurrency, generateId } from '@/lib/utils'
import { toast } from 'sonner'

export default function ServicesManager() {
  const [services, setServices] = useKV<Service[]>('services', [])
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    duration: 30,
    price: 0,
    description: ''
  })

  const resetForm = () => {
    setFormData({ name: '', duration: 30, price: 0, description: '' })
    setEditingService(null)
  }

  const handleSubmit = () => {
    if (!formData.name || formData.price <= 0 || formData.duration <= 0) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    if (editingService) {
      setServices((current) =>
        (current || []).map(s =>
          s.id === editingService.id ? { ...formData, id: s.id } : s
        )
      )
      toast.success('Serviço atualizado com sucesso!')
    } else {
      const newService: Service = { ...formData, id: generateId() }
      setServices((current) => [...(current || []), newService])
      toast.success('Serviço criado com sucesso!')
    }

    resetForm()
    setIsDialogOpen(false)
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      duration: service.duration,
      price: service.price,
      description: service.description || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (serviceId: string) => {
    setServices((current) => (current || []).filter(s => s.id !== serviceId))
    toast.success('Serviço removido com sucesso!')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold">Serviços Oferecidos</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie os serviços disponíveis para agendamento
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus size={16} weight="bold" className="mr-2" />
              Novo Serviço
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingService ? 'Editar Serviço' : 'Novo Serviço'}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados do serviço oferecido
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="service-name">Nome do Serviço *</Label>
                <Input
                  id="service-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Corte Masculino"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="service-duration">Duração (min) *</Label>
                  <Input
                    id="service-duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                    placeholder="30"
                    min="5"
                    step="5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service-price">Preço (R$) *</Label>
                  <Input
                    id="service-price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="service-description">Descrição (opcional)</Label>
                <Textarea
                  id="service-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva o serviço..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    resetForm()
                    setIsDialogOpen(false)
                  }}
                >
                  Cancelar
                </Button>
                <Button className="flex-1" onClick={handleSubmit}>
                  {editingService ? 'Salvar' : 'Criar'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {!services || services.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">Nenhum serviço cadastrado ainda</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus size={16} weight="bold" className="mr-2" />
              Adicionar Primeiro Serviço
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map(service => (
            <Card key={service.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {service.description}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(service)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(service.id)}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock size={14} />
                      Duração
                    </span>
                    <span className="font-medium">{service.duration} min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Valor</span>
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(service.price)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
