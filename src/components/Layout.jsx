import React from 'react'
import { Navbar } from './Navbar'

export const Layout = ({ children, active = 'builder', onNavigate = () => { } }) => {
    return (
        <div className='flex h-screen'>
            <Navbar active={active} onNavigate={onNavigate} />

            <div className='flex-1 bg-[#F5F8FF] overflow-y-auto'>
                <div className='max-w-7xl mx-auto p-6'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Layout
