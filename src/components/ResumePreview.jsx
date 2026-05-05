/* ============================================
    RESPONSIVE UPGRADE — 2026-05-05
    Breakpoints: 320 / 480 / 600 / 768 / 1024 / 1440px
    Approach: Mobile-first
    Modified: Preview width, stack order, type scaling, overflow control
    ============================================ */

export default function ResumePreview({ data }) {
    // Safe fallbacks to prevent crashes if data is missing during initial load
    const personal = data?.personalInfo || {};
    const description = data?.personalInfo?.description || "";
    const experience = data?.experience || [];
    const education = data?.education || [];
    const projects = data?.projects || [];
    const skills = data?.skills || [];

    return (
        <div className='mx-auto w-full max-w-[840px] rounded-2xl border border-[#D4E0F5] bg-white p-5 text-black shadow-2xl font-serif box-border overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] lg:sticky lg:top-6 lg:max-h-[calc(100dvh-7rem)] lg:p-10'>

            {/* 1. HEADER (Name & Contact) */}
            <div className='mb-6 text-center'>
                <h1 className='mb-1 text-[clamp(1.25rem,3vw,1.75rem)] font-bold uppercase text-black'>
                    {personal.fullName || "FULL NAME"}
                </h1>
                <p className='flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs leading-6 text-gray-800 sm:text-sm'>
                    {personal.phone && <span>{personal.phone || "Phone Number"}</span>}
                    {personal.phone && personal.email && <span>|</span>}

                    {personal.email && <span>{personal.email || "Email Address"}</span>}
                    {(personal.email && (personal.linkedin || personal.github)) && <span>|</span>}

                    {personal.linkedin && <span>{personal.linkedin || "LinkedIn Profile"}</span>}
                    {personal.linkedin && personal.github && <span>|</span>}

                    {personal.github && <span>{personal.github || "GitHub Profile"}</span>}
                </p>
            </div>

            {/*User description */}

            <div className='mb-4'>
                <p className='whitespace-pre-wrap text-sm leading-7 text-gray-800'>
                    {description || "A passionate and dedicated Computer Science student with a strong foundation in software development and a keen interest in full-stack web development. Eager to apply my skills and knowledge in real-world projects and contribute to innovative solutions."}
                </p>
            </div>

            {/* 2. EDUCATION (Usually top for freshers) */}
            <div className='mb-4'>
                <h2 className='mb-2 border-b border-black pb-1 text-sm font-bold uppercase tracking-wide text-black sm:text-md'>
                    Education
                </h2>

                {education.map((edu, index) => (
                    <div key={index} className='mb-3'>
                        <div className='flex flex-col gap-1 text-sm font-bold text-black sm:flex-row sm:justify-between sm:gap-4'>
                            <span>{edu.college || "University Name"}</span>
                            <span>{edu.year || "May 2026"}</span>
                        </div>
                        <div className='text-sm italic text-gray-900'>
                            <span>{edu.degree || "B.Tech in Computer Science"}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. EXPERIENCE */}
            {experience.length > 0 && (
                <div className='mb-4'>
                    <h2 className='mb-2 border-b border-black pb-1 text-sm font-bold uppercase tracking-wide text-black sm:text-md'>
                        Experience
                    </h2>

                    {experience.map((job, index) => (
                        <div key={index} className='mb-3'>
                            <div className='flex flex-col gap-1 text-sm font-bold text-black sm:flex-row sm:justify-between sm:gap-4'>
                                <span>{job.role || "Job Title"}</span>
                                <span>{job.duration || "Jan 2024 - Present"}</span>
                            </div>
                            <div className='mb-1 text-sm italic text-gray-900'>
                                {job.company || "Company Name"}
                            </div>

                            {/* Split the textarea description by newlines to create bullet points */}
                            <ul className='ml-5 list-disc list-outside space-y-1 text-sm text-gray-800'>
                                {job.description ? (
                                    job.description.split('\n').map((bullet, i) => (
                                        bullet.trim() && <li key={i}>{bullet}</li>
                                    ))
                                ) : (
                                    <li>Developed and maintained web applications using React and Node.js.</li>
                                )}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {/* 4. PROJECTS */}
            <div className='mb-4'>
                <h2 className='mb-2 border-b border-black pb-1 text-sm font-bold uppercase tracking-wide text-black sm:text-md'>
                    Projects
                </h2>

                {projects.map((proj, index) => (
                    <div key={index} className='mb-3'>
                        <div className='flex flex-col gap-1 text-sm font-bold text-black sm:flex-row sm:justify-between sm:gap-4'>
                            <span className='wrap-break-word'>
                                {proj.name || "Project Name"}
                                {proj.tools && <span className='font-normal italic'> | {proj.tools}</span>}
                            </span>
                            <span>{proj.duration || "Aug 2024"}</span>
                        </div>

                        <ul className='mt-1 ml-5 list-disc list-outside space-y-1 text-sm text-gray-800'>
                            {proj.description ? (
                                proj.description.split('\n').map((bullet, i) => (
                                    bullet.trim() && <li key={i}>{bullet}</li>
                                ))
                            ) : (
                                <li>Built a full-stack application using MERN stack solving X problem.</li>
                            )}
                        </ul>
                    </div>
                ))}
            </div>

            {/* 5. SKILLS */}
            <div className='mb-4'>
                <h2 className='mb-2 border-b border-black pb-1 text-sm font-bold uppercase tracking-wide text-black sm:text-md'>
                    Technical Skills
                </h2>
                <div className='text-sm leading-7 text-gray-800'>
                    {skills.length > 0 ? (
                        skills.map((skillSet, index) => (
                            <div key={index} className='mb-3 wrap-break-word'>
                                <p><strong>Languages:</strong> {skillSet.Languages}</p>
                                <p><strong>Frameworks:</strong> {skillSet.Frameworks}</p>
                                <p><strong>Tools/Databases:</strong> {skillSet.Tools}</p>
                            </div>
                        ))
                    ) : (
                        <>
                            <p><strong>Languages:</strong> Java, JavaScript, TypeScript, HTML/CSS</p>
                            <p><strong>Frameworks:</strong> React, Node.js, Express, Next.js, Tailwind</p>
                            <p><strong>Tools/Databases:</strong> Git, MongoDB, Prisma, Supabase</p>
                        </>
                    )}
                </div>
            </div>

        </div>
    );
}