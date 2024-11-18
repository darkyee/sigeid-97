import { supabase } from "~/lib/supabase";

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '20mb'
        },
    },
}

export default async function handler(req, res) {

    if (req.method === "POST") {
        try {

            // let body2 = await request.json()
            // console.log(body2)

            // return NextResponse.json({ data: 'ok' }, { status: 200 }); // Devolver la respuesta exitosa


            const body = await req.json()

            const { asunto, descripcion, instalacion_afectada, estado, fecha, photos, reportado_por } = body;
            // console.log(asunto, descripcion, estado, fecha, photos)

            // Agrega el desperfecto
            let { data, error } = await supabase
                .from('ReporteDesperfecto')
                .insert({
                    asunto,
                    descripcion,
                    instalacion_afectada,
                    fecha_reporte: fecha,
                    estado_reporte: estado,
                    reportado_por
                })
                .select()
                .single()

            if (error) {
                console.log(error)
                return res.json({ error: error.message }, { status: 400 });
            }

            // Agrega las fotos
            photos.forEach(async photo => {
                await supabase
                    .from('FotoDesperfecto')
                    .insert({
                        id_reporte: data.id_reporte_desperfecto,
                        foto: photo
                    })
            })

            return res.json({ data: 'ok' }, { status: 200 }); // Devolver la respuesta exitosa
        } catch (error) {
            return res.json({ error: 'Error al procesar la solicitud', message: error }, { status: 500 }); // Devolver respuesta de error
        }
    }
    
}