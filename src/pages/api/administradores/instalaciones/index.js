import { supabase } from "~/lib/supabase";

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '20mb'
        },
    },
}

export default async function handler(req, res) {

    if (req.method === "GET") {
        try {
            let { data, error } = await supabase
                .from('InstalacionDeportiva')
                .select('*', { count: 'exact' })

            if (error) {
                return res.json({ error: error.message }, { status: 400 });
            }

            return res.json({ data }, { status: 200 }); // Devolver la respuesta exitosa
        } catch (error) {
            return res.json({ error: 'Error al procesar la solicitud', message: error }, { status: 500 });
        }
    }

    else if (req.method === "POST") {
        try {
            const body = await req.json()
            const { nombre, descripcion, photo: foto, presta: se_presta, disponibilidad_horario } = body;

            // Agrega el desperfecto
            let { data, error } = await supabase
                .from('InstalacionDeportiva')
                .insert({
                    nombre,
                    foto,
                    descripcion,
                    se_presta,
                    disponibilidad_horario,
                })

            if (error) {
                return res.json({ error: error.message }, { status: 400 });
            }

            return res.json({ data: 'ok' }, { status: 200 }); // Devolver la respuesta exitosa
        } catch (error) {
            return res.json({ error: 'Error al procesar la solicitud', message: error }, { status: 500 }); // Devolver respuesta de error
        }
    }

}

// export async function GET(params) {
//     try {

//         let { data, error } = await supabase
//             .from('InstalacionDeportiva')
//             .select('*', { count: 'exact' })

//         if (error) {
//             return NextResponse.json({ error: error.message }, { status: 400 });
//         }

//         return NextResponse.json({ data }, { status: 200 }); // Devolver la respuesta exitosa
//     } catch (error) {
//         return NextResponse.json({ error: 'Error al procesar la solicitud', message: error }, { status: 500 });
//     }
// }

// export async function POST(request) {
//     try {

//         const body = await request.json()
//         const { nombre, descripcion, photo: foto, presta: se_presta } = body;

//         // Agrega el desperfecto
//         let { data, error } = await supabase
//             .from('InstalacionDeportiva')
//             .insert({
//                 nombre,
//                 foto,
//                 descripcion,
//                 se_presta,
//                 disponibilidad_horario: null,
//             })

//         if (error) {
//             return NextResponse.json({ error: error.message }, { status: 400 });
//         }

//         return NextResponse.json({ data: 'ok' }, { status: 200 }); // Devolver la respuesta exitosa
//     } catch (error) {
//         return NextResponse.json({ error: 'Error al procesar la solicitud', message: error }, { status: 500 }); // Devolver respuesta de error
//     }
// }