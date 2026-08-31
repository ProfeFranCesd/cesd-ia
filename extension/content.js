;(function () {
  if (document.getElementById('cesd-ia-btn')) return

  // Crear botón flotante
  const btn = document.createElement('button')
  btn.id = 'cesd-ia-btn'
  btn.innerHTML = '🛡️ Transparencia IA'
  document.body.appendChild(btn)

  // Abrir ventana emergente
  btn.addEventListener('click', () => {
    if (document.getElementById('cesd-ia-modal-overlay')) return

    const overlay = document.createElement('div')
    overlay.id = 'cesd-ia-modal-overlay'

    const container = document.createElement('div')
    container.id = 'cesd-ia-modal-container'

    const closeBtn = document.createElement('button')
    closeBtn.id = 'cesd-ia-close-btn'
    closeBtn.innerText = '✕'
    closeBtn.onclick = () => overlay.remove()

    const iframe = document.createElement('iframe')
    iframe.id = 'cesd-ia-iframe'
    iframe.src = 'https://cesd-ia.vercel.app/classroom'

    container.appendChild(closeBtn)
    container.appendChild(iframe)
    overlay.appendChild(container)
    document.body.appendChild(overlay)
  })
})()