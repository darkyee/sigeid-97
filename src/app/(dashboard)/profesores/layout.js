
import { supabase } from "~/lib/supabase"
import AppNavbar from "./components/AppNavbar"
import AppFooter from "@/components/AppFooter"
import { redirect } from "next/navigation"

export default function Layout({ children }) {

    supabase.auth.getUser()
        .then(response => {
            if (response.data.user === null) {
                redirect('/login')
            }
        })
        .catch(console.error)

    return (
        <div className="container-fluid px-0">
            <div className="row g-0">
                <div className="col">
                    <AppNavbar></AppNavbar>
                    <main>
                        <div className="container py-5">
                            <div className="row">
                                <div className="col">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </main>
                    <AppFooter></AppFooter>
                </div>
            </div>
        </div>
    )
}