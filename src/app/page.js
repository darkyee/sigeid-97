import { redirect } from 'next/navigation'; // Importa la función redirect

export default function App() {

    // Implementar aqui la condicion para verificar si el usuario está logueado
    // Si no está logueado manda a login
    // Si esá logueado manda a una pagina principal segun el role del usuario logueado

    redirect('/login'); // pruebas

    return ""
}