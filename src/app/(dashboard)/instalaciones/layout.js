import AppFooter from "@/components/AppFooter"
import AppNavbar from "../profesores/components/AppNavbar"

export default function Layout({ children }) {
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