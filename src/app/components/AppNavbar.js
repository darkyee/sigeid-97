'use client';

import Link from "next/link";
import { supabase } from '~/lib/supabase';
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AppNavbar({ items }) {

    const router = useRouter()
    const [email, setEmail] = useState('');

    async function cerrarSesion(event) {
        try {
            event.preventDefault();
            await supabase.auth.signOut();
            router.push('/login')
        } catch (error) {
            console.log(error)
        }
    }

    supabase.auth.getUser()
        .then(response => {
            // console.log(response.data.user.email)
            setEmail(response.data.user.email)
        })
        .catch(console.error)

    return (
        <nav id="app-navbar" className="navbar navbar-expand-lg navbar-dark bg-primary py-4">
            <div className="container">
                {/* <div className="row"> */}
                {/* <div className="col col-12"> */}
                <Link className="" href="/">
                    <img className="img img-fluid" src='/logo.svg'></img>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="nav">
                    <div className="navbar-nav">
                        {items.map((item, index) => (
                            <Link key={index} className="nav-link" href={item.url}>{item.text}</Link>
                        ))}
                        <div className="ms-2 dropdown">
                            <button className=" btn btn-outline-light rounded-pill " type="button" id="sessionMenu" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="bi-person-circle"></i>
                                <span className="mx-2">{email}</span>
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="sessionMenu">
                                <li><a className="dropdown-item" href="#">Ajustes</a></li>
                                <li><a className="dropdown-item" href="#" onClick={(e) => cerrarSesion(e)}>Cerrar Sesión</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                {/* </div> */}
                {/* </div> */}
            </div>
        </nav>
    )
}