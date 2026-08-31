import { NextResponse } from 'next/server';
import { generateUniqueId, generateHash, generateQR } from '@/lib/cryptoUtils';
import { getSupabaseClient } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseClient();
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
      descripcion,
      classroom_url
    } = body;

    // 1. Generar metadata, Hash y QR
    const id = generateUniqueId(Math.floor(Math.random() * 900000) + 100000);
    const created_at = new Date().toISOString();
    const hash = generateHash({ id, student_email, coursework_id, nivel, created_at });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cesd-ia.vercel.app';
    const verificationUrl = `${baseUrl}/ver/${id}`;
    const qrCodeBase64 = await generateQR(verificationUrl);

    // 2. Guardar el registro completo en Supabase
    const { error: dbError } = await supabase
      .from('declaraciones')
      .insert([
        {
          id: id, // Permite que la vista /ver/[id] recupere el registro directamente
          alumno_nombre: student_name,
          herramientas_ia: Array.isArray(herramientas) ? herramientas.join(', ') : herramientas,
          uso_ia: nivel || descripcion,
          intervencion_humana: finalidades,
          classroom_url: classroom_url || verificationUrl,
        },
      ]);

    if (dbError) {
      console.error('Error al guardar en Supabase:', dbError);
      return NextResponse.json(
        { success: false, message: 'Error al guardar en la base de datos: ' + dbError.message },
        { status: 500 }
      );
    }

    // 3. Responder al cliente con todos los datos generados
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

  } catch (error: any) {
    console.error('Error en API declarar:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error al procesar la declaración' },
      { status: 500 }
    );
  }
}