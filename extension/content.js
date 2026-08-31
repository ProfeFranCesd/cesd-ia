function verificarYMostrarBoton() {
  const esPaginaDeTarea = window.location.href.includes('/a/');
  const btnExistente = document.getElementById('cesd-ia-btn');

  if (!esPaginaDeTarea) {
    if (btnExistente) btnExistente.remove();
    return;
  }

  if (btnExistente) return;

  // 1. Botón flotante
  const btn = document.createElement('button');
  btn.id = 'cesd-ia-btn';
  btn.type = 'button';
  btn.innerHTML = '🛡️ Transparencia IA';

  btn.style.cssText = `
    position: fixed;
    top: 80px;
    right: 30px;
    z-index: 99999;
    background-color: #1a73e8;
    color: #ffffff;
    border: none;
    padding: 10px 18px;
    border-radius: 20px;
    font-family: 'Google Sans', Roboto, Arial, sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    transition: all 0.2s ease-in-out;
  `;

  btn.addEventListener('mouseenter', () => {
    btn.style.backgroundColor = '#1557b0';
    btn.style.transform = 'scale(1.04)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.backgroundColor = '#1a73e8';
    btn.style.transform = 'scale(1)';
  });

  // 2. Modal Centrado y Estilizado
  btn.addEventListener('click', () => {
    if (document.getElementById('cesd-ia-modal-overlay')) return;

    // Fondo oscuro traslúcido
    const overlay = document.createElement('div');
    overlay.id = 'cesd-ia-modal-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(4px);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    `;

    // Ventana modal contenedora
    const container = document.createElement('div');
    container.id = 'cesd-ia-modal-container';
    container.style.cssText = `
      position: relative;
      width: 100%;
      max-width: 520px;
      height: 90vh;
      max-height: 680px;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    `;

    // Botón de cierre (✕)
    const closeBtn = document.createElement('button');
    closeBtn.id = 'cesd-ia-close-btn';
    closeBtn.innerText = '✕';
    closeBtn.style.cssText = `
      position: absolute;
      top: 12px;
      right: 12px;
      z-index: 1000000;
      background: #f1f5f9;
      color: #334155;
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    `;
    closeBtn.addEventListener('mouseenter', () => closeBtn.style.background = '#e2e8f0');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.background = '#f1f5f9');
    closeBtn.onclick = () => overlay.remove();

    // Iframe responsivo
    const currentUrl = encodeURIComponent(window.location.href);
    const iframe = document.createElement('iframe');
    iframe.id = 'cesd-ia-iframe';
    iframe.src = `https://cesd-ia.vercel.app/classroom?url=${currentUrl}`;
    iframe.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
      border-radius: 16px;
    `;

    container.appendChild(closeBtn);
    container.appendChild(iframe);
    overlay.appendChild(container);
    document.body.appendChild(overlay);
  });

  document.body.appendChild(btn);
}

// Observador para cambios en la SPA de Classroom
const observer = new MutationObserver(() => {
  verificarYMostrarBoton();
});

observer.observe(document.body, { childList: true, subtree: true });

verificarYMostrarBoton();