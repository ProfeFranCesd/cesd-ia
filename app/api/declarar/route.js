import { NextResponse } from 'next/server';
import { generateUniqueId, generateHash, generateQR } from '@/lib/cryptoUtils';

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      student_email = 'estudiante@cesd.edu.ar',
      student_name = 'Juan Pérez',
      course_id = 'CURSO-501',
      coursework_id = 'TAREA-ARDUINO',
      submission_id = 'SUB-12345',
      nivel,
      herramientas,
      finalidades,
      descripcion
    } = body;

    // Generar metadata
    const id = generateUniqueId(Math.floor(Math.random() * 900000) + 100000); // ID temporal para prueba
    const created_at = new Date().toISOString();

    // Generar Hash criptográfico
    const hash = generateHash({ id, student_email, coursework_id, nivel, created_at });

    // Generar QR que apunta a la verificación
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const verificationUrl = `${baseUrl}/ver/${id}`;
    const qrCodeBase64 = await generateQR(verificationUrl);

    // Respuesta exitosa
    return NextResponse.json({
      success: true,
      data: {
        id,
        student_name,
        nivel,
        herramientas,
        finalidades,
        descripcion,
        hash,
        qrCodeBase64,
        verificationUrl,
        created_at
      }
    });

  } catch (error) {
    console.error('Error en API declarar:', error);
    return NextResponse.json(
      { success: false, message: 'Error al procesar la declaración' },
      { status: 500 }
    );
  }
}