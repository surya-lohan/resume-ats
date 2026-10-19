import { useState } from 'react'
import { LuMaximize2, LuFileText } from 'react-icons/lu'

export default function ResumePreview({ data }) {
    const [zoom, setZoom] = useState('fit') // '75', '90', '100', 'fit'

    // Safe fallbacks to prevent crashes if data is missing during initial load
    const personal = data?.personalInfo || {}
    const description = data?.personalInfo?.description || ''
    const experience = data?.experience || []
    const education = data?.education || []
    const projects = data?.projects || []
    const skills = data?.skills || []
    const showExperience = data?.showExperience !== false
    const showProjects = data?.showProjects !== false

    const zoomScale = zoom === '75' ? 0.75 : zoom === '90' ? 0.9 : 1.0

    return (
        <div className='flex h-full w-full flex-col min-h-0 bg-slate-200/60 overflow-hidden'>
            {/* Studio Canvas Control Bar */}
            <div className='flex h-12 shrink-0 w-full items-center justify-between border-b border-slate-200/90 bg-white/95 px-4 sm:px-6 shadow-2xs backdrop-blur z-10'>
                <div className='flex items-center gap-2 text-xs font-semibold text-slate-700'>
                    <LuFileText className='text-base text-indigo-600' />
                    <span>A4 Studio Canvas</span>
                    <span className='hidden rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-normal text-slate-500 sm:inline-block'>
                        ATS Research Standard • Single Page Target
                    </span>
                </div>

                {/* Zoom Controls */}
                <div className='flex items-center gap-1 rounded-lg bg-slate-100 p-0.5 text-xs text-slate-600'>
                    <button
                        type='button'
                        onClick={() => setZoom('75')}
                        className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${zoom === '75' ? 'bg-white text-indigo-600 shadow-xs font-semibold' : 'hover:text-slate-900'
                            }`}
                        title='75% Zoom'
                    >
                        75%
                    </button>
                    <button
                        type='button'
                        onClick={() => setZoom('90')}
                        className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${zoom === '90' ? 'bg-white text-indigo-600 shadow-xs font-semibold' : 'hover:text-slate-900'
                            }`}
                        title='90% Zoom'
                    >
                        90%
                    </button>
                    <button
                        type='button'
                        onClick={() => setZoom('100')}
                        className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${zoom === '100' ? 'bg-white text-indigo-600 shadow-xs font-semibold' : 'hover:text-slate-900'
                            }`}
                        title='100% Zoom'
                    >
                        100%
                    </button>
                    <button
                        type='button'
                        onClick={() => setZoom('fit')}
                        className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition ${zoom === 'fit' ? 'bg-white text-indigo-600 shadow-xs font-semibold' : 'hover:text-slate-900'
                            }`}
                        title='Fit to Pane'
                    >
                        <LuMaximize2 className='text-[11px]' />
                        <span>Fit</span>
                    </button>
                </div>
            </div>

            {/* Studio Canvas Scrollable Workbench Area */}
            <div className='flex-1 w-full overflow-y-auto overflow-x-auto custom-scrollbar p-4 sm:p-6 lg:p-8 flex justify-center items-start'>
                <div
                    style={{
                        transform: zoom !== 'fit' ? `scale(${zoomScale})` : 'none',
                        transformOrigin: 'top center',
                        transition: 'transform 0.2s ease-in-out',
                    }}
                    className='w-full max-w-[794px] shrink-0 pb-12'
                >
                    {/* A4 Sheet */}
                    <div className='relative min-h-[1123px] w-full rounded-xs bg-white p-7 text-black shadow-2xl ring-1 ring-slate-900/10 font-serif box-border sm:p-12'>
                        {/* 1-Page A4 Break Indicator at 1123px */}
                        <div
                            style={{ top: '1123px' }}
                            className='pointer-events-none absolute inset-x-0 -ml-2 -mr-2 z-20 flex items-center justify-between border-t-2 border-dashed border-rose-400/80 px-4'
                        >
                            <span className='rounded bg-rose-50 px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-rose-700 shadow-xs ring-1 ring-rose-300'>
                                Page 1 Boundary — Aim to keep resume above this line for 1-page ATS standard
                            </span>
                            <span className='rounded bg-rose-50 px-2 py-0.5 text-[10px] font-mono font-medium text-rose-700 shadow-xs ring-1 ring-rose-300'>
                                1123px (A4 End)
                            </span>
                        </div>

                        {/* 1. HEADER (Name & Contact) */}
                        <div className='mb-6 text-center'>
                            <h1 className='mb-1.5 text-[clamp(1.35rem,3.2vw,1.85rem)] font-bold uppercase tracking-tight text-black'>
                                {personal.fullName || 'FULL NAME'}
                            </h1>
                            <div className='flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs leading-5 text-gray-800 sm:text-sm'>
                                {personal.phone && <span>{personal.phone}</span>}
                                {personal.phone && (personal.email || personal.linkedin || personal.github) && <span>|</span>}

                                {personal.email && <span>{personal.email}</span>}
                                {personal.email && (personal.linkedin || personal.github) && <span>|</span>}

                                {personal.linkedin && <span>{personal.linkedin}</span>}
                                {personal.linkedin && personal.github && <span>|</span>}

                                {personal.github && <span>{personal.github}</span>}
                            </div>
                        </div>

                        {/* Personal Summary */}
                        <div className='mb-4'>
                            <p className='whitespace-pre-wrap text-sm leading-6 text-gray-800'>
                                {description ||
                                    'A passionate and dedicated Computer Science student with a strong foundation in software development and a keen interest in full-stack web development. Eager to apply my skills and knowledge in real-world projects and contribute to innovative solutions.'}
                            </p>
                        </div>

                        {/* 2. EDUCATION */}
                        {education.length > 0 && (
                            <div className='mb-4'>
                                <h2 className='mb-2 border-b border-black pb-1 text-sm font-bold uppercase tracking-wider text-black'>
                                    Education
                                </h2>

                                {education.map((edu, index) => {
                                    const metaRight = [
                                        edu.cgpa ? `CGPA: ${edu.cgpa}` : '',
                                        edu.location || '',
                                    ]
                                        .filter(Boolean)
                                        .join(' • ')

                                    return (
                                        <div key={index} className='mb-3'>
                                            <div className='flex flex-col gap-0.5 text-sm font-bold text-black sm:flex-row sm:justify-between sm:gap-4'>
                                                <span>{edu.college || 'University Name'}</span>
                                                {edu.year && <span>{edu.year}</span>}
                                            </div>
                                            <div className='flex flex-col gap-0.5 text-sm sm:flex-row sm:justify-between sm:gap-4'>
                                                <span className='italic text-gray-900'>{edu.degree || 'Degree Program'}</span>
                                                {metaRight && <span className='text-xs text-gray-700 sm:text-sm'>{metaRight}</span>}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        {/* 3. EXPERIENCE */}
                        {showExperience && experience.length > 0 && (
                            <div className='mb-4'>
                                <h2 className='mb-2 border-b border-black pb-1 text-sm font-bold uppercase tracking-wider text-black'>
                                    Experience
                                </h2>

                                {experience.map((job, index) => (
                                    <div key={index} className='mb-3'>
                                        <div className='flex flex-col gap-0.5 text-sm font-bold text-black sm:flex-row sm:justify-between sm:gap-4'>
                                            <span>{job.role || 'Job Title'}</span>
                                            {job.duration && <span>{job.duration}</span>}
                                        </div>
                                        <div className='mb-1 text-sm italic text-gray-900'>
                                            {job.company || 'Company Name'}
                                        </div>

                                        <ul className='ml-5 list-disc list-outside space-y-1 text-sm text-gray-800 leading-relaxed'>
                                            {job.description ? (
                                                job.description
                                                    .split('\n')
                                                    .map((bullet, i) => bullet.trim() && <li key={i}>{bullet}</li>)
                                            ) : (
                                                <li>Developed and maintained web applications using React and Node.js.</li>
                                            )}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 4. PROJECTS */}
                        {showProjects && projects.length > 0 && (
                            <div className='mb-4'>
                                <h2 className='mb-2 border-b border-black pb-1 text-sm font-bold uppercase tracking-wider text-black'>
                                    Projects
                                </h2>

                                {projects.map((proj, index) => (
                                    <div key={index} className='mb-3'>
                                        <div className='flex flex-col gap-0.5 text-sm font-bold text-black sm:flex-row sm:justify-between sm:gap-4'>
                                            <span className='wrap-break-word'>
                                                {proj.name || 'Project Name'}
                                                {proj.tools && <span className='font-normal italic'> | {proj.tools}</span>}
                                            </span>
                                            {proj.duration && <span>{proj.duration}</span>}
                                        </div>

                                        <ul className='mt-1 ml-5 list-disc list-outside space-y-1 text-sm text-gray-800 leading-relaxed'>
                                            {proj.description ? (
                                                proj.description
                                                    .split('\n')
                                                    .map((bullet, i) => bullet.trim() && <li key={i}>{bullet}</li>)
                                            ) : (
                                                <li>Built a full-stack application using modern web frameworks solving key challenges.</li>
                                            )}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 5. SKILLS */}
                        <div className='mb-4'>
                            <h2 className='mb-2 border-b border-black pb-1 text-sm font-bold uppercase tracking-wider text-black'>
                                Technical Skills
                            </h2>
                            <div className='text-sm leading-6 text-gray-800'>
                                {skills.length > 0 && (skills[0].Languages || skills[0].Frameworks || skills[0].Tools) ? (
                                    skills.map((skillSet, index) => (
                                        <div key={index} className='mb-2 wrap-break-word space-y-1'>
                                            {skillSet.Languages && (
                                                <p><strong>Languages:</strong> {skillSet.Languages}</p>
                                            )}
                                            {skillSet.Frameworks && (
                                                <p><strong>Frameworks:</strong> {skillSet.Frameworks}</p>
                                            )}
                                            {skillSet.Tools && (
                                                <p><strong>Tools/Databases:</strong> {skillSet.Tools}</p>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className='space-y-1'>
                                        <p><strong>Languages:</strong> Java, JavaScript, TypeScript, HTML/CSS</p>
                                        <p><strong>Frameworks:</strong> React, Node.js, Express, Next.js, Tailwind</p>
                                        <p><strong>Tools/Databases:</strong> Git, MongoDB, PostgreSQL, Docker</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}