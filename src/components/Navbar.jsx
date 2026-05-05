/* ============================================
    RESPONSIVE UPGRADE — 2026-05-05
    Breakpoints: 320 / 480 / 600 / 768 / 1024 / 1440px
    Approach: Mobile-first
    Modified: Full-width top navigation for all breakpoints
    ============================================ */

import React from 'react'
import { IoPlayForward } from "react-icons/io5";
import { GiRoastChicken } from "react-icons/gi";

export const Navbar = ({ active = 'builder', onNavigate = () => { } }) => {
    const nav = [
        { id: 'builder', label: 'Resume Builder', icon: <IoPlayForward className='text-xl' /> },
        { id: 'roaster', label: 'Resume Roaster', icon: <GiRoastChicken className='text-xl' /> },
    ];

    return (
        <header className='sticky top-0 z-30 w-full border-b border-white/15 bg-[#1E4DB7] text-white'>
            <div className='mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8'>
                <div className='flex items-center gap-3'>
                    <div className='flex h-11 w-11 items-center justify-center rounded-full bg-[#ffffff33]'>
                        <span className='text-lg font-semibold'>RB</span>
                    </div>
                    <div>
                        <div className='text-base font-semibold text-white sm:text-lg'>Resume Suite</div>
                        <div className='text-xs text-[#ffffffcc]'>Build • Roaster</div>
                    </div>
                </div>

                <nav className='grid grid-cols-2 gap-2 sm:w-auto sm:grid-cols-none sm:grid-flow-col sm:auto-cols-max'>
                    {nav.map(item => {
                        const isActive = active === item.id;
                        return (
                            <button
                                key={item.id}
                                type='button'
                                onClick={() => onNavigate(item.id)}
                                className={isActive
                                    ? 'flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/15 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors'
                                    : 'flex min-h-11 items-center justify-center gap-2 rounded-xl border border-transparent bg-white/5 px-4 py-3 text-sm text-[#ffffffe6] transition-colors hover:bg-white/10'
                                }
                            >
                                <span className='shrink-0 text-white'>{item.icon}</span>
                                <span className='truncate text-white/95'>{item.label}</span>
                            </button>
                        )
                    })}
                </nav>
            </div>
        </header>
    )
}
