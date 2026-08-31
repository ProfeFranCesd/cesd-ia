// Dentro del evento onSubmit de tu formulario en app/classroom/page.tsx:
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  // Capturar la URL de Classroom enviada como parámetro por la extensión
  const searchParams = new URLSearchParams(window.location.search)
  const classroomUrl = searchParams.get('url') || ''

  const res = await fetch('/api/declarar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      alumno_nombre: nombre,
      herramientas_ia: herramientas,
      uso_ia: uso,
      intervencion_humana: intervencion,
      classroom_url: classroomUrl,
    }),
  })

  const result = await res.json()

  if (result.success) {
    alert('¡Sello de Transparencia IA registrado!')
  } else {
    alert('Error al guardar: ' + result.error)
  }
}