import AppNavbarGlobal from "@/components/AppNavbar"

export default function AppNavbar() {

    const items = [
        { text: "Reporte Desperfectos", url: "/profesores/desperfectos" },
        { text: "Inventario", url: "/profesores/inventario" }
    ]

    return (
        <AppNavbarGlobal items={items} />
    )
}