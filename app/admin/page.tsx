'use client'

import React, { useEffect, useState } from 'react'
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  ExternalLink, 
  Calendar, 
  User, 
  FileText, 
  Download,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase'

interface Declaracion {
  id: string
  created_at: string
  alumno_nombre: string
  herramientas_ia: string
  uso_ia: string
  intervencion_humana: string
  classroom_url: string
}

export default function AdminDashboardPage() {
  const [declaraciones, setDeclaraciones] = useState<Declaracion[]>([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroNivel, setFiltroNivel] = useState('todos')

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setCargando(true)
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('declaraciones')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) console.error('Error al cargar datos:', error)
      else setDeclaraciones(data || [])
    } catch (err) {
      console.error('Error de conexión:', err)
    } finally {
      setCargando(false)
    }
  }

  // Métricas calculadas
  const total = declaraciones.length
  const totalSinIA = declaraciones.filter(d => d.uso_ia === 'ninguno' || d.herramientas_ia === 'Ninguna').length
  const totalAsistido = declaraciones.filter(d => d.uso_ia === 'asistido').length
  const totalGenerado = declaraciones.filter(d => d.uso_ia === 'generado').length

  // Filtrado dinámico
  const filtradas = declaraciones.filter((item) => {
    const coincideBusqueda = 
      item.alumno_nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.id?.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.herramientas_ia?.toLowerCase().includes(busqueda.toLowerCase())

    if (filtroNivel === 'todos') return coincideBusqueda
    if (filtroNivel === 'ninguno') return coincideBusqueda && (item.uso_ia === 'ninguno' || item.herramientas_ia === 'Ninguna')
    if (filtroNivel === 'asistido') return coincideBusqueda && item.uso_ia === 'asistido'
    if (filtroNivel === 'generado') return coincideBusqueda && item.uso_ia === 'generado'
    return coincideBusqueda
  })

  // Exportar datos a CSV para Excel
  const exportarCSV = () => {
    if (declaraciones.length === 0) return alert('No hay datos para exportar')

    const headers = ['ID,Estudiante,Nivel Uso IA,Herramientas,Intervencion Humana,Fecha\n']
    const rows = declaraciones.map(d => [
      `"${d.id || ''}"`,
      `"${d.alumno_nombre || ''}"`,
      `"${d.uso_ia || ''}"`,
      `"${d.herramientas_ia || ''}"`,
      `"${(d.intervencion_humana || '').replace(/"/g, '""')}"`,
      `"${d.created_at ? new Date(d.created_at).toLocaleDateString('es-AR') : ''}"`
    ].join(','))

    const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Reporte_Transparencia_IA_CESD_${new Date().toISOString().slice(0,10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Encabezado Principal */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-100">
              <ShieldCheck className="size-7" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">Panel Directivo · CESD IA</h1>
              <p className="text-xs text-slate-500">Auditoría institucional de integridad y uso pedagógico de IA</p>
            </div>
          </div>
          
          <button
            onClick={exportarCSV}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors shadow-sm self-start sm:self-auto"
          >
            <Download className="size-4" /> Exportar Reporte (.CSV)
          </button>
        </header>

        {/* Tarjetas de Métricas Directivas (KPIs) */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block mb-1">Total Declaraciones</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-slate-900">{total}</span>
              <BarChart3 className="size-5 text-indigo-500" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block mb-1">🟢 100% Humano</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-emerald-600">{totalSinIA}</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {total > 0 ? Math.round((totalSinIA / total) * 100) : 0}%
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block mb-1">🟡 Uso Asistido</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-amber-600">{totalAsistido}</span>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                {total > 0 ? Math.round((totalAsistido / total) * 100) : 0}%
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block mb-1">🔴 Generado con IA</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-rose-600">{totalGenerado}</span>
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                {total > 0 ? Math.round((totalGenerado / total) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Buscador y Filtros */}
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="relative w-full sm:w-1/2">
            <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por estudiante, herramienta o código ID..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="size-4 text-slate-400" />
            <select
              value={filtroNivel}
              onChange={(e) => setFiltroNivel(e.target.value)}
              className="w-full sm:w-auto text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <option value="todos">Todos los Niveles</option>
              <option value="ninguno">🟢 No usó IA</option>
              <option value="asistido">🟡 Uso Asistido</option>
              <option value="generado">🔴 Generado en gran parte</option>
            </select>
          </div>
        </div>

        {/* Tabla Institucional de Registros */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {cargando ? (
            <div className="p-12 text-center text-xs text-slate-500 space-y-2">
              <div className="inline-block animate-spin size-6 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
              <p>Cargando registros institucionales...</p>
            </div>
          ) : filtradas.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500 space-y-1">
              <FileText className="size-8 mx-auto text-slate-300 mb-2" />
              <p className="font-bold text-slate-700">Sin declaraciones registradas</p>
              <p className="text-slate-400">Prueba con otros criterios de búsqueda o filtro.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4">Identificador</th>
                    <th className="p-4">Estudiante</th>
                    <th className="p-4">Nivel Declarado</th>
                    <th className="p-4">Herramientas</th>
                    <th className="p-4">Intervención Humana</th>
                    <th className="p-4">Fecha</th>
                    <th className="p-4 text-right">Ficha Oficial</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtradas.map((row) => (
                    <tr key={row.id || Math.random()} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-mono font-bold text-indigo-600 whitespace-nowrap">
                        {row.id}
                      </td>
                      <td className="p-4 font-medium text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <User className="size-3.5 text-slate-400" />
                          {row.alumno_nombre || 'Estudiante CESD'}
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {row.uso_ia === 'ninguno' || row.herramientas_ia === 'Ninguna' ? (
                          <span className="bg-emerald-50 text-emerald-700 font-semibold px-2 py-1 rounded-full text-[10px] border border-emerald-200">🟢 Sin IA</span>
                        ) : row.uso_ia === 'asistido' ? (
                          <span className="bg-amber-50 text-amber-700 font-semibold px-2 py-1 rounded-full text-[10px] border border-amber-200">🟡 Asistido</span>
                        ) : (
                          <span className="bg-rose-50 text-rose-700 font-semibold px-2 py-1 rounded-full text-[10px] border border-rose-200">🔴 Generado</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-[11px] font-medium">
                          {row.herramientas_ia || 'Ninguna'}
                        </span>
                      </td>
                      <td className="p-4 max-w-xs truncate text-slate-500">
                        {row.intervencion_humana || '-'}
                      </td>
                      <td className="p-4 text-slate-400 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {row.created_at ? new Date(row.created_at).toLocaleDateString('es-AR') : '-'}
                        </div>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <a
                          href={`/ver/${row.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-indigo-600 font-semibold hover:underline"
                        >
                          Ver <ExternalLink className="size-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}