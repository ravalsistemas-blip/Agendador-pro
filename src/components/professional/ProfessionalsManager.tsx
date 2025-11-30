import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Professional } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Pencil, Trash, User } from '@phosphor-icons/react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { generateId } from '@/lib/utils'
import { toast } from 'sonner'

type ProfessionalsManagerProps = {
  professionalId: string
}

export default function ProfessionalsManager({ professionalId }: ProfessionalsManagerProps) {
  const [professionals, setProfessionals] = useKV<Professional[]>(`professionals_${professionalId}`, [])
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    specialty: ''
  })

  const resetForm = () => {
    setFormData({ name: '', specialty: '' })
    setEditingProfessional(null)
  }

  const handleSubmit = () => {
    if (!formData.name) {
      toast.error('Nome é obrigatório')
      return
    }

    if (editingProfessional) {
      setProfessionals((current) =>
        (current || []).map(p =>
          p.id === editingProfessional.id
            ? { ...formData, id: p.id }
            : p
        )
      )
      toast.success('Profissional atualizado com sucesso!')
    } else {
      const newProfessional: Professional = {
        ...formData,
        id: generateId(),
        specialty: formData.specialty || undefined
      }
      setProfessionals((current) => [...(current || []), newProfessional])
      toast.success('Profissional adicionado com sucesso!')
    }

    resetForm()
    setIsDialogOpen(false)
  }

  const handleEdit = (professional: Professional) => {
    setEditingProfessional(professional)
    setFormData({
      name: professional.name,
      specialty: professional.specialty || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (professionalId: string) => {
    setProfessionals((current) => (current || []).filter(p => p.id !== professionalId))
    toast.success('Profissional removido com sucesso!')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold">Equipe</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie os profissionais do seu negócio
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus size={16} weight="bold" className="mr-2" />
              Adicionar Profissional
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingProfessional ? 'Editar Profissional' : 'Novo Profissional'}
              </DialogTitle>
              <DialogDescription>
                Adicione um membro da equipe
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prof-name">Nome Completo *</Label>
                <Input
                  id="prof-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: João Silva"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prof-specialty">Especialidade (opcional)</Label>
                <Input
                  id="prof-specialty"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  placeholder="Ex: Barbeiro, Cabeleireiro, Esteticista"
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
                  {editingProfessional ? 'Salvar' : 'Adicionar'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {!professionals || professionals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User size={48} className="text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Nenhum profissional cadastrado ainda</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus size={16} weight="bold" className="mr-2" />
              Adicionar Primeiro Profissional
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {professionals.map(professional => (
            <Card key={professional.id}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                      {getInitials(professional.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{professional.name}</CardTitle>
                    {professional.specialty && (
                      <CardDescription className="mt-1">
                        {professional.specialty}
                      </CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    size="sm"
                    onClick={() => handleEdit(professional)}
                  >
                    <Pencil size={14} className="mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(professional.id)}
                  >
                    <Trash size={14} className="mr-1" />
                    Remover
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
