import React from 'react'
import { IoPlayForward } from "react-icons/io5";
import { GiRoastChicken } from "react-icons/gi";
import { PiShieldCheckFill } from "react-icons/pi";
export const Sidebar = () => {
    return (
        <>
            <div className='bg-[#0acd91] w-2xs h-screen flex-col p-2 items-start justify-center'>
                <img className='p-4' src="" alt="logo" />
                <div className=' text-white w-full p-6 h-fit flex flex-col items gap-4 justify-between'>
                    <button className='pt-2 pb-2 pl-4 pr-4 flex items-center justify-start gap-2 rounded-md hover:bg-[#f2f9c7] hover:text-[#0acd91] hover: transform transition-all hover:font-medium'>
                        <IoPlayForward className='text-xl' />
                        Resume Builder
                    </button>
                    <button className='pt-2 pb-2 pl-4 pr-4 flex items-center justify-start gap-2 rounded-md hover:bg-[#f2f9c7] hover:text-[#0acd91] transform transition-all hover:font-medium'>
                        <GiRoastChicken className='text-xl' />
                        Resume Roaster
                    </button>
                    <button className='pt-2 pb-2 pl-4 pr-4 flex items-center justify-start gap-2 rounded-md hover:bg-[#f2f9c7] hover:text-[#0acd91] transform transition-all hover:font-medium'>
                        <PiShieldCheckFill className='text-xl' />
                        ATS Checker
                    </button>
                </div>
            </div>
        </>
    )
}
