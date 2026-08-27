import crypto from 'crypto';
import QRCode from 'qrcode';

const SECRET_KEY = process.env.SECRET_KEY || 'clave_secreta_cesd_2026';

// Genera el ID formato CESD-IA-000184
export function generateUniqueId(seqNumber = 184) {
  const padded = String(seqNumber).padStart(6, '0');
  return `CESD-IA-${padded}`;
}

// Genera la firma SHA-256 no falsificable
export function generateHash(data) {
  const payload = `${data.id}:${data.student_email}:${data.coursework_id}:${data.nivel}:${data.created_at}:${SECRET_KEY}`;
  return crypto.createHash('sha256').update(payload).digest('hex');
}

// Genera la imagen del QR en base64
export async function generateQR(url) {
  try {
    return await QRCode.toDataURL(url, { width: 200, margin: 2 });
  } catch (err) {
    console.error('Error generando QR:', err);
    return null;
  }
}