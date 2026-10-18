import { Navbar } from './Navbar'

export const Layout = ({ children, active = 'builder', onNavigate = () => { }, lastSavedText }) => {
    return (
        <div className='h-screen w-full bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased overflow-hidden'>
            <Navbar active={active} onNavigate={onNavigate} lastSavedText={lastSavedText} />
            <main className='flex-1 w-full min-w-0 min-h-0 flex flex-col overflow-hidden'>
                {children}
            </main>
        </div>
    )
}

export default Layout
