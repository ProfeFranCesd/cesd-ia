'use client'

import React, { useState } from 'react'
import { CheckCircle2, ShieldCheck, Loader2, Copy, Check } from 'lucide-react'

export default function ClassroomAddonPage() {
  const [declarado, setDeclarado] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [nivel, setNivel] = useState('asistido')
  
  // Guardar datos devueltos por la API
  const [verificationUrl, setVerificationUrl] = useState('')
  const [copiado, setCopiado] = useState(false)

  // Campos del formulario
  const [herramientas, setHerramientas] = useState('')
  const [usoIA, setUsoIA] = useState('')
  const [intervencionHumana, setIntervencionHumana] = useState('')
  const [revisadoPor, setRevisadoPor] = useState('')

  const handleConfirmar = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)

    try {
      const searchParams = new URLSearchParams(window.location.search)
      const classroomUrl = searchParams.get('url') || ''

      const res = await fetch('/api/declarar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_name: revisadoPor,
          alumno_nombre: revisadoPor,
          nivel: nivel,
          herramientas: nivel === 'ninguno' ? 'Ninguna' : herramientas,
          uso_ia: nivel === 'ninguno' ? 'No utilizó IA' : usoIA,
          intervencion_humana: nivel === 'ninguno' ? 'Trabajo 100% humano' : intervencionHumana,
          finalidades: intervencionHumana,
          descripcion: usoIA,
          classroom_url: classroomUrl,
        }),
      })

      const result = await res.json()

      if (result.success) {
        const url = result.data?.verificationUrl || ''
        setVerificationUrl(url)
        setDeclarado(true)

        // Copiar automáticamente al portapapeles
        if (url && navigator.clipboard) {
          navigator.clipboard.writeText(url)
          setCopiado(true)
        }
      } else {
        alert('Error al guardar la declaración: ' + (result.message || result.error))
      }
    } catch (error) {
      console.error('Error enviando formulario:', error)
      alert('Ocurrió un error de conexión al enviar el sello.')
    } finally {
      setCargando(false)
    }
  }

  const copiarAlPortapapeles = () => {
    if (verificationUrl && navigator.clipboard) {
      navigator.clipboard.writeText(verificationUrl)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 3000)
    }
  }

  return (
    <main className="p-4 max-w-md mx-auto bg-background min-h-screen flex items-center justify-center">
      <div className="w-full rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="text-center pb-3 border-b border-border mb-4">
          <div className="mx-auto size-9 rounded-xl bg-primary/10 flex items-center justify-center mb-1.5">
            <ShieldCheck className="size-5 text-primary" />
          </div>
          <h2 className="text-base font-bold text-foreground">Transparencia IA · CESD</h2>
          <p className="text-[11px] text-muted-foreground">
            Declaración integrada para Google Classroom
          </p>
        </div>

        {!declarado ? (
          <form onSubmit={handleConfirmar} className="space-y-3 text-xs">
            {/* Nivel de uso */}
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-muted-foreground block text-[10px]">
                Uso de IA en este trabajo:
              </label>
              <select
                value={nivel}
                onChange={(e) => setNivel(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="ninguno">🟢 No usé Inteligencia Artificial</option>
                <option value="asistido">🟡 Uso Asistido (Ideas / Corrección)</option>
                <option value="generado">🔴 Generado en gran parte con IA</option>
              </select>
            </div>

            {/* Campos condicionales si usó IA */}
            {nivel !== 'ninguno' && (
              <>
                <div className="space-y-1">
                  <label className="font-semibold text-foreground block">
                    Herramienta/s utilizada/s:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. ChatGPT, Claude, Gemini"
                    value={herramientas}
                    onChange={(e) => setHerramientas(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground block">
                    La IA fue utilizada para:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Lluvia de ideas, corrección ortográfica"
                    value={usoIA}
                    onChange={(e) => setUsoIA(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground block">
                    La intervención humana consistió en:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Edición del texto y verificación de datos"
                    value={intervencionHumana}
                    onChange={(e) => setIntervencionHumana(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </>
            )}

            {/* Campo siempre visible */}
            <div className="space-y-1">
              <label className="font-semibold text-foreground block">
                El contenido fue revisado y validado por:
              </label>
              <input
                type="text"
                required
                placeholder="Nombre y Apellido del Estudiante"
                value={revisadoPor}
                onChange={(e) => setRevisadoPor(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full mt-3 rounded-md bg-primary py-2 px-4 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {cargando ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Guardando...
                </>
              ) : (
                'Generar Sello de Transparencia'
              )}
            </button>
          </form>
        ) : (
          <div className="text-center py-4 space-y-3 text-xs">
            <CheckCircle2 className="size-10 text-emerald-500 mx-auto" />
            <div>
              <p className="font-semibold text-emerald-900 text-sm">¡Sello Registrado con Éxito!</p>
              <p className="text-[11px] text-muted-foreground mt-1">
                El enlace se ha copiado automáticamente a tu portapapeles.
              </p>
            </div>

            {verificationUrl && (
              <div className="bg-muted p-2 rounded-md text-left break-all font-mono text-[10px] space-y-2 border border-border">
                <span className="text-muted-foreground block font-sans font-semibold text-[10px]">Enlace de Verificación:</span>
                <p className="text-foreground">{verificationUrl}</p>
                
                <button
                  onClick={copiarAlPortapapeles}
                  className="w-full py-1.5 px-3 rounded bg-primary text-primary-foreground font-sans font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-colors"
                >
                  {copiado ? (
                    <>
                      <Check className="size-3.5" /> ¡Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" /> Copiar Enlace para Classroom
                    </>
                  )}
                </button>
              </div>
            )}

            <p className="text-[10px] text-muted-foreground bg-amber-500/10 text-amber-900 p-2 rounded border border-amber-500/20">
              📌 <b>Paso final:</b> Volvé a tu tarea de Classroom, hace clic en <b>Añadir o crear ➔ Enlace</b> y pegá este enlace (Ctrl + V) antes de entregar.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}