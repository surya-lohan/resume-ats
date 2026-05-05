/* ============================================
    RESPONSIVE UPGRADE — 2026-05-05
    Breakpoints: 320 / 480 / 600 / 768 / 1024 / 1440px
    Approach: Mobile-first
    Modified: Generic app layout shell
    ============================================ */

import React from 'react'
import { Navbar } from './Navbar'

export const Layout = ({ children, active = 'builder', onNavigate = () => { } }) => {
    return (
        <div className='min-h-dvh bg-[#F5F8FF] text-[#0F2260] flex flex-col'>
            <Navbar active={active} onNavigate={onNavigate} />

            <div className='flex-1 min-w-0 overflow-x-clip overflow-y-auto'>
                <div className='mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Layout
