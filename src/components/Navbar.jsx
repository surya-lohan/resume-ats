import { HiOutlineDocumentText, HiOutlineSparkles } from 'react-icons/hi2'
import { LuCircleCheck } from 'react-icons/lu'

export const Navbar = ({ active = 'builder', onNavigate = () => { }, lastSavedText = 'Draft auto-saved' }) => {
    const navItems = [
        { id: 'builder', label: 'Resume Builder', icon: <HiOutlineDocumentText className='text-lg' /> },
        { id: 'roaster', label: 'ATS Roaster & Audit', icon: <HiOutlineSparkles className='text-lg' /> },
    ]

    return (
        <header className='sticky top-0 z-30 w-full border-b border-slate-200/90 bg-white/90 backdrop-blur-md transition-colors'>
            <div className='flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8'>
                {/* Brand / Logo */}
                <div className='flex items-center gap-3'>
                    <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200 ring-1 ring-indigo-500/20'>
                        <span className='font-mono text-sm font-bold tracking-tight'>RS</span>
                    </div>
                    <div className='flex flex-col'>
                        <div className='flex items-center gap-2'>
                            <span className='text-base font-bold tracking-tight text-slate-900'>ResumeStudio</span>
                            <span className='hidden rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-600/20 md:inline-block'>
                                ATS Pro
                            </span>
                        </div>
                        <span className='hidden text-xs text-slate-500 sm:inline'>Research-backed ATS studio</span>
                    </div>
                </div>

                {/* Segmented Mode Switcher */}
                <nav className='flex items-center rounded-xl bg-slate-100 p-1 text-slate-600 ring-1 ring-slate-200/60' aria-label='Studio View Mode'>
                    {navItems.map((item) => {
                        const isActive = active === item.id
                        return (
                            <button
                                key={item.id}
                                type='button'
                                onClick={() => onNavigate(item.id)}
                                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all sm:px-4 sm:py-2 sm:text-sm ${
                                    isActive
                                        ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-900/5'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                                }`}
                            >
                                <span className='shrink-0'>{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        )
                    })}
                </nav>

                {/* Right Status Pill */}
                <div className='flex items-center gap-2'>
                    <div className='hidden items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600 sm:flex'>
                        <LuCircleCheck className='text-emerald-500' />
                        <span className='font-medium'>{lastSavedText}</span>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar
