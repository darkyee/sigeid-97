import AppNavbarGlobal from "@/components/AppNavbar"

export default function AppNavbar() {

    const items = [
        { text: "Instalaciones Deportivas", url: "/admin/instalaciones" },
        { text: "Reporte de Desperfectos", url: "/admin/desperfectos" },
    ]

    return (
        <AppNavbarGlobal items={items} />
    )
}