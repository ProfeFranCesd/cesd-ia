'use client'

import { useState } from 'react'
import { Check, ChevronRight, Copy, FileCheck2, QrCode, Search, ShieldCheck, X } from 'lucide-react'
import Image from 'next/image'

// Mock data
const students = [
  { name: 'Juan Pérez', initials: 'JP', usage: 'Sí', tool: 'ChatGPT', level: '🟡', levelName: 'Colaboradora', tone: 'yellow' },
  { name: 'Sofía Rodríguez', initials: 'SR', usage: 'Sí', tool: 'Gemini', level: '🟢', levelName: 'Asistente', tone: 'green' },
  { name: 'Mateo González', initials: 'MG', usage: 'No', tool: '—', level: '⚪', levelName: 'Sin uso', tone: 'gray' },
  { name: 'Valentina López', initials: 'VL', usage: 'Sí', tool: 'Copilot', level: '🔴', levelName: 'Generadora', tone: 'red' },
  { name: 'Tomás Fernández', initials: 'TF', usage: 'Sí', tool: 'ChatGPT', level: '🟢', levelName: 'Asistente', tone: 'green' },
]

const aiRules = [
  { id: 'prohibited', icon: '🚫', label: 'IA no permitida', desc: 'Producción 100% individual.' },
  { id: 'assistant', icon: '🟢', label: 'Permitida únicamente como Asistente', desc: 'Dudas, corrección de texto/código.' },
  { id: 'collaborator', icon: '🟡', label: 'Permitida como Colaboradora', desc: 'Co-creación con revisión obligatoria.' },
  { id: 'generator', icon: '🔴', label: 'Permitida como Generadora', desc: 'Requiere defensa y explicación detallada.' },
  { id: 'free', icon: '🔓', label: 'Permitida libremente', desc: 'Declaración obligatoria.' },
]

const toneClasses = {
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  yellow: 'bg-amber-50 text-amber-800 ring-amber-200',
  red: 'bg-rose-50 text-rose-700 ring-rose-200',
  gray: 'bg-muted text-muted-foreground ring-border',
}

// Navigation Component
function Nav({ view, setView }: { view: string; setView: (view: string) => void }) {
  const tabs = [
    { id: 'form', label: 'Declarar Uso' },
    { id: 'badge', label: 'Sello & QR' },
    { id: 'config', label: 'Configurar Tarea' },
    { id: 'dashboard', label: 'Panel Docente' },
    { id: 'verify', label: 'Verificar Sello' },
  ]
  
  return (
    <nav className="flex flex-wrap items-center gap-1 rounded-xl border border-border bg-card p-1 shadow-sm" aria-label="Vistas del sistema">
      {tabs.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => setView(id)}
          className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
            view === id
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          {label}
        </button>
      ))}
    </nav>
  )
}

// Metric Card Component
function Metric({ label, value, detail, tone }: { label: string; value: string; detail?: string; tone: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className={`size-2 rounded-full ${tone}`} />
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
      {detail && <p className="mt-1 text-xs text-muted-foreground">{detail}</p>}
    </div>
  )
}

// 1. Declaration Form View
// 1. Declaration Form View (Conectado a la API)
function DeclarationForm({ onSuccess }: { onSuccess: (data: any) => void }) {
  const [selectedLevel, setSelectedLevel] = useState('collaborator')
  const [tools, setTools] = useState<string[]>(['ChatGPT'])
  const [purposes, setPurposes] = useState<string[]>(['ideas', 'explain'])
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const toolOptions = ['ChatGPT', 'Gemini', 'Copilot', 'Otra']
  const purposeOptions = [
    { id: 'ideas', label: 'Generar ideas' },
    { id: 'explain', label: 'Explicar conceptos' },
    { id: 'code-gen', label: 'Generar código' },
    { id: 'code-fix', label: 'Corregir código' },
    { id: 'text', label: 'Crear texto' },
    { id: 'images', label: 'Crear imágenes' },
    { id: 'analysis', label: 'Analizar información' },
    { id: 'other', label: 'Otro' },
  ]

  const levelOptions = [
    { id: 'assistant', emoji: '🟢', label: 'Asistente', desc: 'apoyo, dudas, corrección' },
    { id: 'collaborator', emoji: '🟡', label: 'Colaboradora', desc: 'participación activa, co-creación' },
    { id: 'generator', emoji: '🔴', label: 'Generadora', desc: 'gran parte del producto final' },
  ]

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const payload = {
        nivel: selectedLevel,
        herramientas: tools,
        finalidades: purposes,
        descripcion: notes,
      }

      const res = await fetch('/api/declarar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await res.json()
      if (result.success) {
        onSuccess(result.data) // Le enviamos la data generada a la página principal
      }
    } catch (error) {
      console.error('Error al enviar la declaración:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <header className="border-b border-border pb-5">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">CESD · Transparencia IA</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Declaración de uso de Inteligencia Artificial</h1>
          </div>
        </div>
      </header>

      {/* Level Selection */}
      <div>
        <label className="block text-sm font-semibold mb-3">Nivel de uso de IA</label>
        <div className="grid gap-3">
          {levelOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedLevel(opt.id)}
              className={`flex items-start gap-4 rounded-xl border-2 p-4 transition ${
                selectedLevel === opt.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-muted-foreground/50'
              }`}
            >
              <span className="text-2xl">{opt.emoji}</span>
              <div className="text-left">
                <p className="font-semibold">{opt.label}</p>
                <p className="text-xs text-muted-foreground">{opt.desc}</p>
              </div>
              <div className={`ml-auto size-5 rounded-full border-2 ${
                selectedLevel === opt.id ? 'border-primary bg-primary' : 'border-border'
              }`} />
            </button>
          ))}
        </div>
      </div>

      {/* Tools */}
      <div>
        <label className="block text-sm font-semibold mb-3">Herramientas utilizadas</label>
        <div className="flex flex-wrap gap-2">
          {toolOptions.map((tool) => (
            <button
              key={tool}
              onClick={() => setTools(tools.includes(tool) ? tools.filter(t => t !== tool) : [...tools, tool])}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                tools.includes(tool)
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border hover:bg-muted'
              }`}
            >
              {tools.includes(tool) ? '✓ ' : ''}{tool}
            </button>
          ))}
        </div>
      </div>

      {/* Purposes */}
      <div>
        <label className="block text-sm font-semibold mb-3">Finalidad del uso</label>
        <div className="grid grid-cols-2 gap-2">
          {purposeOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setPurposes(purposes.includes(opt.id) ? purposes.filter(p => p !== opt.id) : [...purposes, opt.id])}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition text-left ${
                purposes.includes(opt.id)
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border hover:bg-muted'
              }`}
            >
              {purposes.includes(opt.id) ? '✓ ' : ''}{opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Student Work */}
      <div>
        <label className="block text-sm font-semibold mb-2">¿Qué parte del trabajo realizaste o modificaste vos?</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Describí tu aporte específico..."
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary min-h-[100px]"
        />
      </div>

      {/* Submit Button */}
      <button 
        onClick={handleSubmit}
        disabled={loading}
        className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
      >
        {loading ? 'Generando Sello...' : 'Confirmar y Declarar'}
      </button>
    </section>
  )
}

// 2. Badge & QR View
// 2. Badge & QR View (Conectado con datos reales)
function BadgeQRView({ data }: { data?: any }) {
  const [copied, setCopied] = useState(false)

  // Extraemos la data de la API o usamos valores por defecto si entra directamente
  const id = data?.id || 'CESD-IA-000184'
  const studentName = data?.student_name || 'Juan Pérez'
  const nivel = data?.nivel || 'collaborator'
  const herramientas = Array.isArray(data?.herramientas) 
    ? data.herramientas.join(', ') 
    : (data?.herramientas || 'ChatGPT')
  const hash = data?.hash || '8f4a8e...e921'
  const qrCode = data?.qrCodeBase64

  const handleCopy = () => {
    navigator.clipboard.writeText(id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Estilos y etiquetas dinámicas según nivel
  const levelMap: Record<string, { label: string; style: string }> = {
    assistant: { label: '🟢 IA Asistente', style: 'bg-emerald-100 text-emerald-900' },
    collaborator: { label: '🟡 IA Colaboradora', style: 'bg-amber-100 text-amber-900' },
    generator: { label: '🔴 IA Generadora', style: 'bg-rose-100 text-rose-900' },
  }

  const levelInfo = levelMap[nivel] || { label: `🟡 IA ${nivel}`, style: 'bg-amber-100 text-amber-900' }

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div className="rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <h1 className="text-lg font-bold text-emerald-900">SELLO DE TRANSPARENCIA IA</h1>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-200 px-3 py-1.5 text-xs font-bold text-emerald-900">
            <Check className="size-3.5" /> Verificado
          </span>
        </div>

        {/* Badge Content */}
        <div className="mt-6 rounded-xl bg-white p-6 grid gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Estudiante</p>
            <p className="mt-2 text-xl font-semibold">{studentName}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Curso</p>
              <p className="mt-1 font-medium">5° Año · Proyecto Arduino</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Fecha</p>
              <p className="mt-1 font-medium">27/08/2026</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground mb-2">Nivel</p>
            <span className={`inline-flex rounded-full px-3 py-1.5 text-sm font-bold ${levelInfo.style}`}>
              {levelInfo.label}
            </span>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Herramienta</p>
            <p className="mt-1 font-medium">{herramientas}</p>
          </div>

          <div className="flex items-end gap-4 border-t border-border pt-4">
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground mb-2">ID Único</p>
              <code className="block font-mono text-lg font-bold tracking-wider">{id}</code>
            </div>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-muted transition"
            >
              <Copy className="size-3.5" /> {copied ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          <div className="flex gap-4 items-center">
            <div className="rounded-lg bg-muted p-3 flex-1 flex justify-center">
              {qrCode ? (
                <img
                  src={qrCode}
                  alt={`QR Code para ${id}`}
                  className="w-32 h-32 bg-white rounded p-1 shadow-sm border"
                />
              ) : (
                <div className="bg-white rounded p-4 text-xs text-muted-foreground text-center border">
                  [QR de muestra]
                </div>
              )}
            </div>
            <div className="text-xs text-muted-foreground flex-1">
              <p className="font-medium mb-1">Firma SHA-256:</p>
              <code className="block font-mono text-[10px] break-all">{hash.substring(0, 18)}...</code>
              <p className="mt-3 font-medium mb-1">URL de verificación:</p>
              <code className="block font-mono text-[10px] break-all">transparencia.cesd.edu.ar/ver/{id}</code>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// 3. Teacher Configuration View
function TeacherConfig() {
  const [selectedRule, setSelectedRule] = useState('collaborator')
  const [requireBadge, setRequireBadge] = useState(true)

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <header className="border-b border-border pb-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">CESD Transparencia IA</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Configurar Actividad</h1>
        <p className="mt-1 text-sm text-muted-foreground">Establece las condiciones de uso de IA para esta tarea.</p>
      </header>

      {/* AI Rules */}
      <div>
        <label className="block text-sm font-semibold mb-3">Condiciones de uso de IA</label>
        <div className="space-y-2">
          {aiRules.map((rule) => (
            <button
              key={rule.id}
              onClick={() => setSelectedRule(rule.id)}
              className={`w-full flex items-start gap-4 rounded-lg border-2 p-4 transition text-left ${
                selectedRule === rule.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-muted-foreground/50'
              }`}
            >
              <span className="text-xl">{rule.icon}</span>
              <div className="flex-1">
                <p className="font-semibold">{rule.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{rule.desc}</p>
              </div>
              <div className={`mt-1 size-5 rounded-full border-2 flex-shrink-0 ${
                selectedRule === rule.id ? 'border-primary bg-primary' : 'border-border'
              }`} />
            </button>
          ))}
        </div>
      </div>

      {/* Badge Requirement */}
      <div className="rounded-lg border border-border bg-card p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={requireBadge}
            onChange={(e) => setRequireBadge(e.target.checked)}
            className="mt-1 rounded border border-input"
          />
          <div>
            <p className="font-semibold">Exigir Sello de Transparencia</p>
            <p className="text-xs text-muted-foreground mt-1">para dar por entregada la tarea</p>
          </div>
        </label>
      </div>

      {/* Save Button */}
      <button className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition hover:opacity-90">
        Guardar Configuración de Tarea
      </button>
    </section>
  )
}

// 4. Analytics Dashboard View
function Dashboard() {
  const [query, setQuery] = useState('')
  const filtered = students.filter((student) =>
    student.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">CESD · Transparencia IA</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Panel de uso de IA</h1>
          <p className="mt-1 text-sm text-muted-foreground">5° Año - Programación y Robótica</p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
          <ShieldCheck className="size-4" /> Curso activo
        </span>
      </header>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Metric label="Total entregas" value="32" detail="100% del curso" tone="bg-primary" />
        <Metric label="🟢 Asistente" value="14" detail="44%" tone="bg-emerald-500" />
        <Metric label="🟡 Colaboradora" value="12" detail="37%" tone="bg-amber-400" />
        <Metric label="🔴 Generadora" value="4" detail="13%" tone="bg-rose-500" />
        <Metric label="⚪ Sin uso de IA" value="2" detail="6%" tone="bg-muted-foreground" />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">Declaraciones recientes</h2>
            <p className="mt-1 text-xs text-muted-foreground">Revisá el uso declarado por cada estudiante.</p>
          </div>
          <label className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2">
            <Search className="size-4 text-muted-foreground" />
            <span className="sr-only">Buscar estudiante</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground sm:w-44"
              placeholder="Buscar estudiante"
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-muted/40 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Estudiante</th>
                <th className="px-4 py-3 font-semibold">Uso de IA</th>
                <th className="px-4 py-3 font-semibold">Herramienta</th>
                <th className="px-4 py-3 font-semibold">Nivel</th>
                <th className="px-4 py-3 font-semibold">Estado declaración</th>
                <th className="px-4 py-3 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((student) => (
                <tr key={student.name} className="transition hover:bg-muted/25">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {student.initials}
                      </span>
                      <span className="font-medium">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        student.usage === 'Sí'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {student.usage}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{student.tool}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
                        toneClasses[student.tone as keyof typeof toneClasses]
                      }`}
                    >
                      {student.level} {student.levelName}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                      <Check className="size-4" /> Verificada
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold transition hover:bg-muted">
                      Ver Sello / QR <ChevronRight className="size-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

// 5. Public Verification View
function VerifyPage() {
  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col gap-5">
      <header className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-lg">🤖</div>
          <div>
            <p className="text-sm font-bold tracking-tight">CESD · Centro Educativo</p>
            <p className="text-xs text-muted-foreground">Sistema de Transparencia IA</p>
          </div>
        </div>
        <span className="hidden text-xs font-semibold text-muted-foreground sm:block">Consulta pública</span>
      </header>

      {/* Verification Alert */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-6 shrink-0 text-emerald-600" />
          <div>
            <h1 className="text-lg font-semibold text-emerald-900">Declaración Verificada Oficialmente ✅</h1>
            <p className="mt-1 text-sm leading-6 text-emerald-800">
              La información coincide con el registro académico firmado por CESD.
            </p>
          </div>
        </div>
      </div>

      {/* Details Card */}
      <article className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
        <div className="flex items-start justify-between gap-4 border-b border-border pb-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Sello de transparencia</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Juan Pérez</h2>
          </div>
          <FileCheck2 className="size-7 text-primary" />
        </div>

        <dl className="grid gap-x-8 gap-y-5 pt-5 sm:grid-cols-2">
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Curso</dt>
            <dd className="mt-1 text-sm font-medium">5° Año Tecnológico</dd>
          </div>
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Tarea</dt>
            <dd className="mt-1 text-sm font-medium">Proyecto Arduino & Sensores</dd>
          </div>
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Fecha de entrega</dt>
            <dd className="mt-1 text-sm font-medium">27 de Agosto de 2026, 14:30 hs</dd>
          </div>
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Herramienta</dt>
            <dd className="mt-1 text-sm font-medium">ChatGPT</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Nivel declarado</dt>
            <dd className="mt-2">
              <span className="inline-flex rounded-full bg-amber-100 px-3 py-1.5 text-sm font-bold text-amber-900">
                🟡 IA Colaboradora
              </span>
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Uso declarado</dt>
            <dd className="mt-1 text-sm leading-6 text-muted-foreground">
              Generación del sketch inicial de Arduino y depuración de errores de sintaxis en el bucle principal.
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Aporte del estudiante</dt>
            <dd className="mt-1 text-sm leading-6 text-muted-foreground">
              Modifiqué las asignaciones de pines, agregué la lectura del sensor ultrasónico y reescribí la lógica de control.
            </dd>
          </div>
        </dl>

        {/* Security Footer */}
        <div className="mt-7 flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Identificador único</p>
            <code className="mt-2 block font-mono font-semibold tracking-wider">CESD-IA-000184</code>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Firma SHA-256</p>
            <code className="mt-2 block font-mono text-xs tracking-wider">a94f8e...3b12</code>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Timestamp</p>
            <p className="mt-2 font-mono text-xs">2026-08-27T17:30:00Z</p>
          </div>
        </div>

        <p className="mt-5 text-[10px] text-muted-foreground text-center">
          transparencia.cesd.edu.ar/ver/CESD-IA-000184
        </p>
      </article>
    </section>
  )
}

// Main Page Component
// Main Page Component
export default function Page() {
  const [view, setView] = useState('form')
  const [selloData, setSelloData] = useState<any>(null) // Guardará ID, QR y Hash

  return (
    <main className="min-h-screen bg-background px-4 py-5 text-foreground sm:px-8 sm:py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">🤖 CESD IA</p>
          <Nav view={view} setView={setView} />
        </div>

        {/* View Router */}
        {view === 'form' && (
          <DeclarationForm 
            onSuccess={(data) => {
              setSelloData(data)
              setView('badge') // Pasa automáticamente a la pestaña del Sello
            }} 
          />
        )}
        {view === 'badge' && <BadgeQRView data={selloData} />}
        {view === 'config' && <TeacherConfig />}
        {view === 'dashboard' && <Dashboard />}
        {view === 'verify' && <VerifyPage />}

        <p className="text-center text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          CESD · Educación transparente, aprendizaje auténtico
        </p>
      </div>
    </main>
  )
}
