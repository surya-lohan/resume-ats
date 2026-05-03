import React from 'react'
import { IoPlayForward } from "react-icons/io5";
import { GiRoastChicken } from "react-icons/gi";

export const Navbar = ({ active = 'builder', onNavigate = () => { } }) => {
    const nav = [
        { id: 'builder', label: 'Resume Builder', icon: <IoPlayForward className='text-xl' /> },
        { id: 'roaster', label: 'Resume Roaster', icon: <GiRoastChicken className='text-xl' /> },
    ];

    return (
        <aside className='w-50 h-screen shrink-0 bg-[#1E4DB7] text-white flex flex-col justify-between'>
            <div>
                <div className='px-4 py-6 flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-[#ffffff33] flex items-center justify-center'>
                        <span className='font-semibold text-lg'>RB</span>
                    </div>
                    <div>
                        <div className='text-white font-semibold text-lg'>Resume Suite</div>
                        <div className='text-[#ffffffcc] text-xs'>Build • Roaster</div>
                    </div>
                </div>

                <nav className='mt-8 px-2 flex flex-col gap-1'>
                    {nav.map(item => {
                        const isActive = active === item.id;
                        return (
                            <button
                                key={item.id}
                                type='button'
                                onClick={() => onNavigate(item.id)}
                                className={isActive ? 'flex items-center gap-3 w-full text-left px-4 py-3 rounded-r-md transition-colors border-l-4 border-white font-semibold text-white' : 'flex items-center gap-3 w-full text-left px-4 py-3 rounded-r-md transition-colors text-[#ffffffe6] hover:bg-[#ffffff1a]'}
                            >
                                <span className='text-white'>{item.icon}</span>
                                <span className={isActive ? 'text-white' : 'text-[#ffffffe6]'}>{item.label}</span>
                            </button>
                        )
                    })}
                </nav>
            </div>

        </aside>
    )
}
