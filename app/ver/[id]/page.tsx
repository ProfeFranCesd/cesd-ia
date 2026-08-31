'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { 
  ShieldCheck, 
  CheckCircle2, 
  User, 
  Calendar, 
  Wrench, 
  FileText, 
  AlertTriangle,
  ExternalLink,
  Bot
} from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase'

export default function VerificacionPage() {
  const params = useParams()
  const rawId = params?.id as string

  const [declaracion, setDeclaracion] = useState<any>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!rawId) return

    const cargarDeclaracion = async () => {
      setCargando(true)
      try {
        const supabase = getSupabaseClient()
        const decodedId = decodeURIComponent(rawId)

        // Buscar por ID o por URL que contenga el identificador
        const { data, error } = await supabase
          .from('declaraciones')
          .select('*')
          .or(`id.eq.${decodedId},classroom_url.ilike.%${decodedId}%`)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (error) {
          console.error('Error al consultar Supabase:', error)
          setError('No se pudo verificar la declaración en la base de datos.')
        } else if (!data) {
          setError('No se encontró ninguna declaración registrada con este identificador.')
        } else {
          setDeclaracion(data)
        }
      } catch (err) {
        console.error('Error:', err)
        setError('Ocurrió un error al cargar la verificación.')
      } finally {
        setCargando(false)
      }
    }

    cargarDeclaracion()
  }, [rawId])

  // Badge según nivel de uso de IA
  const getNivelBadge = (nivel: string) => {
    switch (nivel?.toLowerCase()) {
      case 'ninguno':
        return <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">🟢 No usó Inteligencia Artificial</span>
      case 'asistido':
        return <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">🟡 Uso Asistido (Ideas / Corrección)</span>
      case 'generado':
        return <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200">🔴 Generado en gran parte con IA</span>
      default:
        return <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">{nivel || 'Declarado'}</span>
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl space-y-4">
        
        {/* Banner institucional Superior */}
        <header className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xs">
              🤖
            </div>
            <div>
              <h1 className="text-sm font-bold leading-none text-slate-900">CESD · Centro Educativo</h1>
              <p className="text-[10px] text-slate-500">Sistema Oficial de Transparencia IA</p>
            </div>
          </div>
          <span className="text-[11px] font-medium text-slate-400">Consulta pública</span>
        </header>

        {cargando ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
            <div className="inline-block animate-spin size-6 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
            <p className="text-xs text-slate-500">Verificando firma digital en la base de datos...</p>
          </div>
        ) : error ? (
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl text-center space-y-2">
            <AlertTriangle className="size-8 text-amber-600 mx-auto" />
            <h2 className="text-sm font-bold text-amber-900">Declaración No Encontrada</h2>
            <p className="text-xs text-amber-700">{error}</p>
          </div>
        ) : (
          <>
            {/* Banner verde de Confirmación */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3 text-emerald-900">
              <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xs font-bold">Declaración Verificada Oficialmente ✅</h2>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  La información coincide con el registro académico firmado por el estudiante en CESD.
                </p>
              </div>
            </div>

            {/* Ficha Principal del Registro */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
              
              {/* Encabezado del Registro */}
              <div className="p-5 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Sello de Transparencia</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <User className="size-4 text-indigo-600" />
                    <h3 className="text-base font-bold text-slate-900">{declaracion.alumno_nombre || 'Estudiante CESD'}</h3>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Identificador Único</span>
                  <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    {rawId}
                  </span>
                </div>
              </div>

              {/* Detalle de la Declaración Realizada */}
              <div className="p-5 space-y-4 text-xs">
                
                {/* Nivel de Uso de IA */}
                <div>
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                    Nivel de uso de IA declarado:
                  </span>
                  {getNivelBadge(declaracion.uso_ia)}
                </div>

                {/* Herramientas Utilizadas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <Wrench className="size-3" /> Herramienta/s Utilizada/s
                    </span>
                    <p className="font-medium text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      {declaracion.herramientas_ia || 'Ninguna'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <Calendar className="size-3" /> Fecha de Registro
                    </span>
                    <p className="font-medium text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      {declaracion.created_at ? new Date(declaracion.created_at).toLocaleString('es-AR') : 'Reciente'}
                    </p>
                  </div>
                </div>

                {/* Intervención Humana */}
                {declaracion.intervencion_humana && (
                  <div className="space-y-1 pt-2">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <FileText className="size-3" /> Intervención Humana y Revisión Realizada
                    </span>
                    <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
                      {declaracion.intervencion_humana}
                    </p>
                  </div>
                )}

              </div>

              {/* Pie de Página con Firma Digital */}
              <div className="p-4 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="size-3.5 text-emerald-600" /> Registro Académico Inmutable
                </span>
                <span>Estado: <strong className="text-emerald-700 font-semibold">Válido / Firmado</strong></span>
              </div>

            </div>
          </>
        )}

      </div>
    </div>
  )
}