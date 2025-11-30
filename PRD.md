# Planning Guide

Sistema de agendamento profissional completo que conecta prestadores de serviço (salões, clínicas, consultórios) com seus clientes através de uma plataforma intuitiva de marcação de horários com notificações automáticas.

**Experience Qualities**: 
1. **Eficiente** - O processo de agendar ou gerenciar horários deve levar segundos, não minutos, eliminando friction e burocracia
2. **Confiável** - Usuários devem sentir segurança de que seus horários estão confirmados e que receberão lembretes oportunos
3. **Profissional** - A interface deve transmitir credibilidade e organização, espelhando a seriedade do negócio

**Complexity Level**: Complex Application (advanced functionality, accounts)
  - Sistema dual com painéis distintos (profissional e cliente), múltiplos estados de agendamento, sistema de notificações, gestão de serviços e profissionais, relatórios e analytics

## Essential Features

### Sistema de Autenticação - Cadastro de Profissional
- **Functionality**: Registro completo de conta profissional com seleção de categoria de atuação
- **Purpose**: Criar conta única por profissional para gerenciar seu negócio de forma isolada
- **Trigger**: Acesso ao painel profissional sem estar logado
- **Progression**: Acessa área profissional → Clica em "Cadastre-se" → Preenche nome completo, telefone, nome do negócio → Seleciona categoria profissional (25 opções organizadas por área) → Define e-mail e senha → Cria conta → Faz login automaticamente
- **Success criteria**: Conta criada, profissional logado, dados do negócio salvos nas configurações

### Sistema de Autenticação - Login de Profissional
- **Functionality**: Login com e-mail e senha para profissionais cadastrados
- **Purpose**: Acesso seguro e individualizado ao painel de gestão
- **Trigger**: Acesso ao painel profissional ou logout
- **Progression**: Acessa área profissional → Digita e-mail e senha → Clica em "Entrar" → Sistema valida credenciais → Redireciona para painel
- **Success criteria**: Profissional autenticado com acesso exclusivo aos seus dados

### Sistema de Autenticação - Registro Simplificado de Cliente
- **Functionality**: Coleta de dados básicos do cliente para facilitar agendamentos futuros
- **Purpose**: Pré-preencher formulários e criar histórico do cliente
- **Trigger**: Cliente acessa área de agendamento pela primeira vez
- **Progression**: Acessa área cliente → Modal aparece solicitando dados → Preenche nome, sobrenome, WhatsApp (obrigatórios) e CPF (opcional) → Salva ou pula → Dados armazenados localmente
- **Success criteria**: Dados do cliente salvos e utilizados para pré-preencher formulários de agendamento

### Painel do Profissional - Cadastro de Serviços
- **Functionality**: Criar, editar e excluir serviços oferecidos com nome, duração e preço
- **Purpose**: Definir catálogo de serviços disponíveis para agendamento
- **Trigger**: Botão "Novo Serviço" no painel administrativo
- **Progression**: Clique em adicionar → Preenche formulário (nome, duração, preço) → Salva → Aparece na lista de serviços
- **Success criteria**: Serviços aparecem corretamente no painel do cliente para seleção

### Painel do Profissional - Gestão de Profissionais
- **Functionality**: Cadastrar múltiplos profissionais/colaboradores do estabelecimento
- **Purpose**: Permitir agendamentos específicos por profissional em negócios com equipe
- **Trigger**: Botão "Adicionar Profissional" na seção de equipe
- **Progression**: Clique em adicionar → Preenche nome e especialidades → Configura disponibilidade → Salva → Profissional disponível para agendamento
- **Success criteria**: Clientes podem selecionar profissional específico ao agendar

### Painel do Profissional - Configuração de Horários
- **Functionality**: Definir dias e horários de funcionamento, pausas e bloqueios
- **Purpose**: Estabelecer grade horária disponível para agendamentos
- **Trigger**: Acesso à seção "Horários de Atendimento"
- **Progression**: Seleciona dias da semana → Define horário início/fim → Configura intervalo de almoço → Define duração de slot → Salva configuração
- **Success criteria**: Apenas horários configurados aparecem como disponíveis para clientes

### Painel do Profissional - Visualização de Agenda
- **Functionality**: Calendário visual mostrando todos agendamentos em diferentes views (dia/semana/mês)
- **Purpose**: Visão centralizada de todos compromissos para organização e planejamento
- **Trigger**: Acesso ao painel principal (tela inicial do profissional)
- **Progression**: Carrega agenda → Visualiza agendamentos em cards → Pode filtrar por profissional/serviço → Clica em agendamento para detalhes/ações
- **Success criteria**: Todos agendamentos visíveis com status correto, cores distintas por estado

### Painel do Profissional - Gerenciamento de Agendamentos
- **Functionality**: Confirmar, cancelar, remarcar ou marcar status de comparecimento
- **Purpose**: Controle total sobre os agendamentos para lidar com imprevistos
- **Trigger**: Clique em agendamento específico na agenda
- **Progression**: Seleciona agendamento → Abre modal com detalhes → Escolhe ação (confirmar/cancelar/remarcar/concluir) → Confirma → Status atualizado
- **Success criteria**: Mudanças refletem imediatamente na agenda e cliente é notificado

### Painel do Cliente - Seleção de Serviço e Agendamento
- **Functionality**: Interface para escolher serviço, profissional, data e horário
- **Purpose**: Permitir auto-agendamento pelo cliente sem intermediação
- **Trigger**: Acesso ao link público do estabelecimento
- **Progression**: Visualiza serviços disponíveis → Seleciona serviço → Escolhe profissional (opcional) → Seleciona data → Escolhe horário livre → Preenche dados pessoais → Confirma agendamento → Recebe confirmação
- **Success criteria**: Agendamento criado com sucesso, aparece na agenda do profissional

### Sistema de Notificações - Confirmação Imediata
- **Functionality**: Enviar notificações ao criar agendamento (para profissional e cliente)
- **Purpose**: Confirmar o agendamento para ambas partes imediatamente
- **Trigger**: Conclusão de novo agendamento
- **Progression**: Cliente finaliza agendamento → Sistema cria registro → Dispara notificação para profissional (novo agendamento) → Dispara notificação para cliente (confirmação)
- **Success criteria**: Ambos recebem notificações instantâneas com detalhes corretos

### Sistema de Notificações - Lembrete Automático
- **Functionality**: Enviar lembrete ao cliente 2 horas antes do horário agendado
- **Purpose**: Reduzir taxa de faltas e no-shows
- **Trigger**: Sistema verifica agendamentos próximos a cada 5 minutos
- **Progression**: Job verifica agendamentos → Identifica horários em 2h → Filtra os que ainda não receberam lembrete → Envia notificação → Marca como enviado
- **Success criteria**: Cliente recebe lembrete exatamente 2h antes do horário

### Relatórios e Analytics
- **Functionality**: Dashboard com métricas de agendamentos, taxa de faltas, serviços mais populares
- **Purpose**: Insights para tomada de decisão e otimização do negócio
- **Trigger**: Acesso à seção "Relatórios"
- **Progression**: Abre relatórios → Visualiza cards com métricas principais → Pode filtrar por período → Analisa gráficos de tendência
- **Success criteria**: Dados precisos refletindo realidade dos agendamentos

## Edge Case Handling

- **Conflito de Horários**: Sistema bloqueia automaticamente horário quando agendado, impedindo dupla marcação
- **Cancelamento pelo Cliente**: Link de cancelamento permite que cliente cancele até 2h antes, liberando horário
- **Falta sem Aviso**: Profissional marca como "faltou", afeta estatísticas mas não bloqueia cliente
- **Horário Passado**: Sistema oculta automaticamente horários já decorridos da seleção
- **Profissional Indisponível**: Se profissional selecionado for excluído, agendamentos existentes permanecem mas novos são bloqueados
- **Fuso Horário**: Todos horários salvos e exibidos em fuso local do navegador do usuário
- **Formulário Incompleto**: Validação impede submissão sem dados obrigatórios (nome, telefone)

## Design Direction

O design deve evocar profissionalismo clean e moderno, transmitindo organização e eficiência através de uma interface minimal mas funcional, com hierarquia visual clara que prioriza a informação mais relevante em cada contexto.

## Color Selection

Complementary palette (azul confiável + laranja energético)

- **Primary Color**: Azul profundo (oklch(0.45 0.15 250)) - transmite confiabilidade, profissionalismo e calma, usado em CTAs principais e headers
- **Secondary Colors**: Cinza neutro (oklch(0.96 0 0)) para backgrounds sutis e cards, criando espaço respirável
- **Accent Color**: Laranja vibrante (oklch(0.68 0.18 45)) para status ativo, confirmações e elementos que demandam atenção
- **Foreground/Background Pairings**: 
  - Background (Branco oklch(1 0 0)): Texto primário escuro (oklch(0.2 0 0)) - Ratio 16.4:1 ✓
  - Card (Cinza claro oklch(0.98 0 0)): Texto primário escuro (oklch(0.2 0 0)) - Ratio 15.2:1 ✓
  - Primary (Azul oklch(0.45 0.15 250)): Texto branco (oklch(1 0 0)) - Ratio 8.2:1 ✓
  - Secondary (Cinza oklch(0.96 0 0)): Texto escuro (oklch(0.2 0 0)) - Ratio 14.8:1 ✓
  - Accent (Laranja oklch(0.68 0.18 45)): Texto escuro (oklch(0.15 0 0)) - Ratio 10.5:1 ✓
  - Muted (Cinza médio oklch(0.94 0 0)): Texto médio (oklch(0.45 0 0)) - Ratio 6.8:1 ✓

## Font Selection

Tipografia limpa e legível usando Inter para transmitir modernidade e profissionalismo, com hierarquia clara entre títulos, labels e conteúdo.

- **Typographic Hierarchy**: 
  - H1 (Título da Página): Inter Bold/32px/letter-spacing -0.02em
  - H2 (Seções Principais): Inter Semibold/24px/letter-spacing -0.01em
  - H3 (Cards e Componentes): Inter Semibold/18px/letter-spacing normal
  - Body (Textos gerais): Inter Regular/16px/line-height 1.5
  - Small (Labels e metadata): Inter Medium/14px/line-height 1.4
  - Tiny (Timestamps): Inter Regular/12px/text muted

## Animations

Animações devem ser sutis e funcionais, reforçando feedback de interação sem atrasar o usuário, com transições suaves que comunicam mudanças de estado.

- **Purposeful Meaning**: Micro-animações em botões (scale on hover), transições de modal (fade + slide), e feedback de confirmação (check bounce) transmitem responsividade
- **Hierarchy of Movement**: Elementos críticos (confirmação de agendamento) recebem animação mais pronunciada; elementos secundários (hover em cards) recebem apenas sutil shift

## Component Selection

- **Components**: 
  - Calendar (shadcn) para seleção de datas com customização de disponibilidade
  - Dialog (shadcn) para modais de confirmação e detalhes de agendamento
  - Select (shadcn) para escolha de serviços e profissionais
  - Badge (shadcn) com cores customizadas para status de agendamento
  - Card (shadcn) para layout de agendamentos e serviços
  - Form + Input (shadcn) para cadastros com validação
  - Tabs (shadcn) para alternar entre views de agenda (dia/semana/mês)
  - Avatar (shadcn) para fotos de profissionais
  - Button (shadcn) com variants para diferentes níveis de ação
  - Separator (shadcn) para dividir seções visualmente
  - ScrollArea (shadcn) para listas longas de horários

- **Customizations**: 
  - TimeSlotPicker: componente customizado mostrando grid de horários disponíveis com estados (livre/ocupado/selecionado)
  - AgendaView: componente de calendário semanal mostrando agendamentos como blocos temporais
  - StatusBadge: Badge com cores semânticas para diferentes status

- **States**: 
  - Buttons: hover com scale(1.02), active com scale(0.98), disabled com opacity 0.5
  - Inputs: focus com ring em primary, error com ring em destructive
  - Cards: hover com subtle shadow elevation, selected com border em primary

- **Icon Selection**: 
  - CalendarDots para agendamentos
  - Clock para horários
  - User/Users para profissionais/clientes
  - CheckCircle para confirmações
  - XCircle para cancelamentos
  - Bell para notificações
  - ChartLine para relatórios
  - Plus para adicionar
  - Pencil para editar
  - Trash para excluir

- **Spacing**: 
  - Container padding: px-4 md:px-6 lg:px-8
  - Section gaps: gap-6 md:gap-8
  - Card padding: p-4 md:p-6
  - Form field gaps: gap-4
  - Button padding: px-4 py-2 (default), px-6 py-3 (large)

- **Mobile**: 
  - Tabs horizontais tornam-se dropdown select em mobile
  - Agenda semanal torna-se view de dia único em mobile
  - Modais ocupam tela inteira em mobile (usando Drawer do vaul)
  - Cards empilham verticalmente
  - Formulários em uma coluna
  - Bottom navigation para alternar entre cliente/profissional em mobile
