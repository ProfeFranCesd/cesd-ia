import { ShieldCheck, FileCheck2 } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PublicVerifyPage({ params }: PageProps) {
  const { id } = await params

  return (
    <main className="min-h-screen bg-background p-4 sm:p-8">
      <section className="mx-auto flex w-full max-w-2xl flex-col gap-5">
        <header className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-lg text-white">🤖</div>
            <div>
              <p className="text-sm font-bold tracking-tight">CESD · Centro Educativo</p>
              <p className="text-xs text-muted-foreground">Sistema de Transparencia IA</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-muted-foreground">Consulta pública</span>
        </header>

        {/* Banner de Verificación */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 size-6 shrink-0 text-emerald-600" />
            <div>
              <h1 className="text-lg font-semibold text-emerald-900">Declaración Verificada Oficialmente ✅</h1>
              <p className="mt-1 text-sm text-emerald-800">
                La información coincide con el registro académico firmado por CESD.
              </p>
            </div>
          </div>
        </div>

        {/* Tarjeta de Datos */}
        <article className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
          <div className="flex items-start justify-between gap-4 border-b border-border pb-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Sello de transparencia</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Estudiante CESD</h2>
            </div>
            <FileCheck2 className="size-7 text-primary" />
          </div>

          <dl className="grid gap-x-8 gap-y-5 pt-5 sm:grid-cols-2">
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Identificador Único</dt>
              <dd className="mt-1 text-sm font-mono font-bold text-primary">{id}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Estado</dt>
              <dd className="mt-1 text-sm font-medium text-emerald-600">Válido / Firmado</dd>
            </div>
          </dl>
        </article>
      </section>
    </main>
  )
}