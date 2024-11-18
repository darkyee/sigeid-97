export default function Layout({ children }) {
    return (
        <div>
            <header>
                <h1>Auth Layout</h1>
            </header>
            <main>{children}</main>
        </div>
    )
}